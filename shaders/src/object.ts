import * as mv from "./MV";
export class GLObject {
    name: string;
    translation: mv.Vec3 = mv.vec3();
    rotation: mv.Vec3 = mv.vec3();
    scale: mv.Vec3 = mv.vec3(1, 1, 1);
    transform: mv.Mat4 = mv.mat4();
    children: Record<string, GLObject> = {};
    constructor(name: string) {
        this.name = name;
    }
    make_transform(parent_transform: mv.Mat4) {
        this.transform = mv.mult_mat(
            parent_transform,
            mv.mult_mat(
                mv.translate(this.translation),
                mv.mult_mat(
                    mv.rotateX(this.rotation[0]),
                    mv.mult_mat(
                        mv.rotateY(this.rotation[1]),
                        mv.mult_mat(
                            mv.rotateZ(this.rotation[2]),
                            mv.scalem(this.scale),
                        ),
                    )
                )),
        );
        for (let child of Object.values(this.children)) {
            child.make_transform(this.transform);
        }
    }
    set_translation(value: mv.Vec3): this {
        this.translation = value;
        return this;
    }
    set_rotation(value: mv.Vec3): this {
        this.rotation = value;
        return this;
    }
    set_scale(value: mv.Vec3): this {
        this.scale = value;
        return this;
    }
    add_child(obj: GLObject): this {
        this.children[obj.name] = obj;
        return this;
    }
    get_transform() {
        return this.transform;
    }
    get_geometry(): null | string {
        return null;
    }
}


export class ModelObject extends GLObject {
    geometry: string;
    has_shadow: boolean = true;
    skybox_type: number = 0;
    constructor(name: string, geometry: string) {
        super(name);
        this.geometry = geometry;
    }
    set_no_shadow(): this {
        this.has_shadow = false;
        return this;
    }
    set_skybox_type(type: number): this {
        this.skybox_type = type;
        return this;
    }
    get_geometry(): string {
        return this.geometry;
    }
}
