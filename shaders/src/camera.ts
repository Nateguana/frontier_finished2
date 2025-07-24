import * as mv from "./MV"
import { GLObject } from "./object"

export class Camera extends GLObject {
    private camera_matrix = mv.mat4();
    private up_dir = mv.vec3(0, 1, 0);
    // private lookat_offset: mv.Vec3 = mv.vec3();
    constructor(name: string) {
        super(`${name} Camera`);
    }

    get_matrix(): mv.Mat4 {
        return this.camera_matrix;
    }

    make_transform(parent_transform: mv.Mat4) {
        super.make_transform(parent_transform);
        let eye = mv.get_translation(this.transform);
        let lookat = mv.get_translation(parent_transform);
        this.camera_matrix = mv.lookAt(eye, lookat, this.up_dir);
    }
    set_up_dir(up: mv.Vec3): this {
        this.up_dir = up;
        return this;
    }

    // set_look_at(at: mv.Vec3): this {
    //     this.lookat_offset = at;
    //     return this;
    // }
}