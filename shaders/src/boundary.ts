import * as mv from "./MV"

export class Boundary {
    canvas: HTMLCanvasElement;
    light_switch: HTMLSpanElement;
    camera_name: HTMLSpanElement;
    camera_rot: HTMLSpanElement;
    show_skybox: HTMLSpanElement;
    show_shadows: HTMLSpanElement;
    show_reflect: HTMLSpanElement;
    show_refract: HTMLSpanElement;
    car_move: HTMLSpanElement;
    constructor() {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.light_switch = document.getElementById("light-switch") as HTMLSpanElement;
        this.camera_name = document.getElementById("camera-name") as HTMLSpanElement;
        this.camera_rot = document.getElementById("camera-rot") as HTMLSpanElement;
        this.show_skybox = document.getElementById("show-skybox") as HTMLSpanElement;
        this.show_shadows = document.getElementById("show-shadows") as HTMLSpanElement;
        this.show_reflect = document.getElementById("show-reflect") as HTMLSpanElement;
        this.show_refract = document.getElementById("show-refract") as HTMLSpanElement;
        this.car_move = document.getElementById("car-move") as HTMLSpanElement;
    }
    change_light_type(light_type: number) {
        this.light_switch.innerText = ["All Light", "Only Ambient", "Full Bright"][light_type];
    }
    change_camera(camera_name: string) {
        this.camera_name.innerText = camera_name;
    }
    change_camera_rotation(camera_rot: number) {
        this.camera_rot.innerText = camera_rot + "";
    }
    change_car(car_moving: boolean) {
        this.car_move.innerText = ["Off", "On"][Number(car_moving)]
    }
    change_skybox(show_skybox: boolean) {
        this.show_skybox.innerText = ["Off", "On"][Number(show_skybox)]
    }
    change_shadows(show_shadows: boolean) {
        this.show_shadows.innerText = ["Off", "On"][Number(show_shadows)]
    }
    change_reflect(show_reflect: boolean) {
        this.show_reflect.innerText = ["Off", "On"][Number(show_reflect)]
    }
    change_refract(show_refract: boolean) {
        this.show_refract.innerText = ["Off", "On"][Number(show_refract)]
    }
    // change_track_points(points: number) {
    //     this.track_points.innerText = points + "";
    // }
    // change_track_divisions(divs: number) {
    //     this.track_div.innerText = divs + "";
    // }
    // change_sphere_divisions(divs: number) {
    //     this.sphere_div.innerText = divs + "";
    // }
    // change_light_position(pos: mv.Vec3) {
    //     this.light_pos.innerText = `(${pos.join(",")})`;
    // }
    // change_camera_position(pos: mv.Vec3) {
    //     this.camera_pos.innerText = `(${pos.join(",")})`;
    // }
    // change_sphere_position(pos: number) {
    //     this.sphere_pos.innerText = pos.toFixed(2);
    // }
    // change_shader(name: string) {
    //     this.shader_name.innerText = name + "";
}