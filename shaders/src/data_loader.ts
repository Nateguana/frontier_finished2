import { LoadData, Load_Geometry, Load_Material, Load_Texture, Texture_Target } from "./model_data";
import * as mv from "./MV";

const NO_UV = mv.vec2(-1, -1);

export class DataLoader {
    geometry: Record<string, Geometry[]> = {};
    material: Record<string, Material> = {};
    texture: Record<string, Texture> = {};
    texture_slots: Texture[] = [];
    async load(gl: WebGL2RenderingContext, data: LoadData[]): Promise<void> {
        const promises = data.map((e) => this.fetch_data(gl, e));
        await Promise.all(
            promises
        );
    }

    private async fetch_data(gl: WebGL2RenderingContext, data: LoadData): Promise<void> {
        const response = await fetch(`${data.path}${data.name}.${data.type}`);
        switch (data.type) {
            case 'obj':
                await this.add_geometry(gl, data, response)
                break;
            case 'mtl':
                await this.add_material(gl, data, response)
                break;
            case 'png':
                await this.add_texture(gl, data, response)
                break;
        }
    }
    private async add_geometry(gl: WebGL2RenderingContext, data: Load_Geometry, response: Response) {
        const try_add_geo = (object: string, data_array: number[], material: Material | null) => {
            if (data_array.length) {
                if (!this.geometry[object]) {
                    this.geometry[object] = [];
                }
                let array = new Float32Array(data_array);
                let buffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
                this.geometry[object].push(new Geometry(object, array, buffer, materal))
            }
        }
        let file = await response.text()
        // console.log(file);
        // Split and sanitize OBJ file input
        let lines = this.split_sanitize_file(file);

        // let normals = [];           // List of normal definitions from OBJ
        let verts: mv.Vec3[] = [];          // List of vertex definitions from OBJ
        let uvs: mv.Vec2[] = [];               // List of UV definitions (texture coordinates) from OBJ
        let materal = null;    // Current material in use
        let object = data.name;
        let data_array: number[] = [];

        for (let line of lines) {
            let match: RegExpMatchArray | null = null;
            // vertexes
            if (match = line.match(/^v (-?\d.\d+) (-?\d.\d+) (-?\d.\d+) *$/)) {
                verts.push(mv.vec3(parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3])));
            }
            // texture coords
            if (match = line.match(/^vt (\d.\d+) (\d.\d+) *$/)) {
                uvs.push(mv.vec2(parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3])));
            }
            // material
            else if (match = line.match(/^usemtl +(.+) *$/)) {
                try_add_geo(object, data_array, materal);
                materal = match[1];
            }
            // object
            else if (match = line.match(/^o +(.+) *$/)) {
                try_add_geo(object, data_array, materal);
                object = match[1];
                console.log(data.name, object);
            }
            // faces
            else if (match = line.match(/^f +(.+) *$/)) {
                let indices: mv.Vec3[] = match[1].split(' ').map(e => mv.vec3(e.split('/').map(parseFloat)));
                for (let j = 1; j < indices.length - 1; j++) {
                    let face_points = [];
                    let face_uvs = [];
                    for (let i = 0; i < 3; i++) {
                        let offset = (i ? j + i - 1 : 0);
                        face_points.push(verts[indices[offset][0] - 1]);
                        let uv_index = indices[offset][1] - 1;
                        face_uvs.push(isNaN(uv_index) ? NO_UV : uvs[uv_index]);
                    }
                    let normal = this.newell(mv.mat3(face_points))
                    for (let i = 0; i < 3; i++) {
                        data_array.push(...face_points[i]);
                        data_array.push(...normal);
                        data_array.push(...face_uvs[i]);
                    }
                }
            }
        }
        try_add_geo(object, data_array, materal);
    }

    private async add_material(_gl: WebGL2RenderingContext, data: Load_Material, response: Response) {
        const try_add_mat = (material: Material | null) => {
            if (material) {
                console.log(`got new materal from ${data.name}:`, material);
                this.material[material.name] = material;
            }
        }

        let file = await response.text()

        // Split and sanitize MTL file input
        let lines = this.split_sanitize_file(file);

        let material: Material | null = null;

        for (let line of lines) {
            let match: RegExpMatchArray | null = null;
            // new material
            if (match = line.match(/^newmtl +(.+) *$/)) {
                try_add_mat(material);
                material = new Material(match[1]);
            }
            // new material values
            else if (match = line.match(/^K([ads]) (\d\.\d+) +(\d\.\d+) +(\d\.\d+) *$/)) {
                const values = mv.vec3(parseFloat(match[2]), parseFloat(match[3]), parseFloat(match[4]));
                switch (match[1]) {
                    case 'd':
                        material.diffuse = values;
                        break;
                    case 's':
                        material.specular = values;
                        break;
                    case 'a':
                        material.ambient = values;
                        break;
                }
            }
            // new shininess
            else if (match = line.match(/^Ns (\d+\.\d+) *$/)) {
                material.shininess = parseFloat(match[1]);
            }
            // new texture
            else if (match = line.match(/^map_Kd +(\w+).\w+ *$/)) {
                material.texture = match[1];
            }
        }

        try_add_mat(material);
    }
    private async add_texture(gl: WebGL2RenderingContext, data: Load_Texture, response: Response) {
        const image = await this.make_image(response);
        const image_type = data.alpha ? gl.RGBA : gl.RGB;
        let texture = this.texture_slots[data.slot];
        let tex: WebGLTexture;
        if (texture) {
            tex = texture.texture;
        } else {
            tex = gl.createTexture();
            texture = new Texture(data.name, data.slot, tex);
            this.texture[data.name] = texture;
            this.texture_slots[data.slot] = texture;
        }
        texture.images[data.target] = image;

        let is_texture_2d = data.target == '2d';
        let texture_type = is_texture_2d ? gl.TEXTURE_2D : gl.TEXTURE_CUBE_MAP;
        let spec_texture_type = this.get_spec_texture_type(gl, data.target);

        gl.activeTexture(gl.TEXTURE0 + data.slot);
        gl.bindTexture(texture_type, tex);

        gl.texParameteri(texture_type, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(texture_type, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(texture_type, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(texture_type, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.texImage2D(
            spec_texture_type,
            0,
            image_type,
            image.width,
            image.height,
            0,
            image_type,
            gl.UNSIGNED_BYTE,
            image
        );


        console.log(`got new texture from ${data.name}:`, texture);

    }
    private async make_image(response: Response): Promise<HTMLImageElement> {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const img = new Image();
        await new Promise(res => {
            img.onload = () => res(img);
            img.src = url;
        });
        URL.revokeObjectURL(url)
        return img;
    }
    private get_spec_texture_type(gl: WebGL2RenderingContext, target: Texture_Target): number {
        switch (target) {
            case "2d":
                return gl.TEXTURE_2D;
            case "+x":
                return gl.TEXTURE_CUBE_MAP_POSITIVE_X;
            case "-x":
                return gl.TEXTURE_CUBE_MAP_NEGATIVE_X;
            case "+y":
                return gl.TEXTURE_CUBE_MAP_POSITIVE_Y;
            case "-y":
                return gl.TEXTURE_CUBE_MAP_NEGATIVE_Y;
            case "+z":
                return gl.TEXTURE_CUBE_MAP_POSITIVE_Z;
            case "-z":
                return gl.TEXTURE_CUBE_MAP_NEGATIVE_Z;
        }
    }
    private split_sanitize_file(file: string): string[] {
        let lines = file.split('\n');
        lines = lines.map(line => line.trim()).filter(e => e);
        return lines;
    }

    private newell(mat: mv.Mat3): mv.Vec3 {
        let ret = mv.vec3();
        for (let j = 0; j < 3; j++) {
            let i = (j + 1) % 3;
            let prod = mv.vec3(
                (mat[j][1] - mat[i][1]) * (mat[j][2] + mat[i][2]),
                (mat[j][2] - mat[i][2]) * (mat[j][0] + mat[i][0]),
                (mat[j][0] - mat[i][0]) * (mat[j][1] + mat[i][1])
            );
            ret = mv.add(ret, prod);
        }
        return ret;
    }
}

export class Geometry {
    name: string;
    data: Float32Array;
    materal: string;
    buffer: WebGLBuffer;
    constructor(name: string, data: Float32Array, buffer: WebGLBuffer, materal: string) {
        this.name = name;
        this.data = data;
        this.materal = materal;
        this.buffer = buffer;
    }
    get_buffer() {
        return this.buffer;
    }
}

export class Material {
    name: string;
    diffuse: mv.Vec3 = mv.vec3();
    specular: mv.Vec3 = mv.vec3();
    ambient: mv.Vec3 = mv.vec3();
    shininess: number = 0;
    texture: string = "";
    constructor(name: string) {
        this.name = name;
    }
    get_matrix(): [mv.Mat3, number] {
        return [mv.mat3(this.diffuse, this.specular, this.ambient), this.shininess]
    }

}

export class Texture {
    name: string;
    slot: number;
    texture: WebGLTexture;
    images: Partial<Record<Texture_Target, HTMLImageElement>> = {};
    constructor(name: string, slot: number, texture: WebGLTexture) {
        this.name = name;
        this.slot = slot;
        this.texture = texture;
    }
}