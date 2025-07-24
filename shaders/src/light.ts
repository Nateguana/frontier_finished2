import * as mv from "./MV"
import { GLObject } from "./object"

export class Light extends GLObject {
    private light_matrix = mv.mat4();
    position: mv.Vec4 = mv.vec4();
    constructor() {
        super("light")
    }
    make_transform(parent_transform: mv.Mat4): void {
        super.make_transform(parent_transform);
        let pos = mv.get_translation(this.transform);
        this.position = mv.vec4(pos);
        this.light_matrix = mv.lookAt(pos, mv.vec3(), mv.vec3(1, 0, 0))
    }
    get_postition(): mv.Vec4 {
        return this.position;
    }
    get_matrix(): mv.Mat4 {
        return this.light_matrix;
    }
}