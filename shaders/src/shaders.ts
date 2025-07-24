import * as WebGL from "./webgl"

import shadow_vert from "./shaders/shadow.vert?raw";
import shadow_frag from "./shaders/shadow.frag?raw";

import skybox_vert from "./shaders/skybox.vert?raw";
import skybox_frag from "./shaders/skybox.frag?raw";

import phong_vert from "./shaders/phong.vert?raw";
import phong_frag from "./shaders/phong.frag?raw";



export interface Shaders {
    shadow: Shader,
    skybox: Shader,
    phong: Shader,
}

export interface Shader {
    program: WebGLProgram,
    atributes: Record<string, number>
    uniforms: Record<string, WebGLUniformLocation>
}

function make_shader(gl: WebGL2RenderingContext, program: WebGLProgram): Shader {
    let atributes: Record<string, number> = {};
    let uniforms: Record<string, WebGLUniformLocation> = {};
    let attribute_count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (let j = 0; j < attribute_count; j++) {
        let attribute_info = gl.getActiveAttrib(program, j);
        atributes[attribute_info.name] = gl.getAttribLocation(program, attribute_info.name);
        console.log(j, atributes[attribute_info.name], attribute_info.name);
    }
    let uniform_count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let j = 0; j < uniform_count; j++) {
        let uniform_info = gl.getActiveUniform(program, j);
        uniforms[uniform_info.name] = gl.getUniformLocation(program, uniform_info.name);
        console.log(j, uniforms[uniform_info.name], uniform_info.name);
    }
    return {
        program,
        atributes,
        uniforms,
    }
}


export function init_webgl_shaders(gl: WebGL2RenderingContext): Shaders {
    let shadow = make_shader(gl, WebGL.init_shader(gl, shadow_vert, shadow_frag));
    let skybox = make_shader(gl, WebGL.init_shader(gl, skybox_vert, skybox_frag));
    let phong = make_shader(gl, WebGL.init_shader(gl, phong_vert, phong_frag));

    return {
        shadow,
        skybox,
        phong,
    }

}