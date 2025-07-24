//////////////////////////////////////////////////////////////////////////////
//
//  Angel.js
//
//////////////////////////////////////////////////////////////////////////////


//----------------------------------------------------------------------------
//
//  Typescript
//

interface Matrix {
    matrix: true;
}
interface NotMatrix {
    matrix?: false;
}

type _Vec2 = [number, number];
export interface Vec2 extends _Vec2, NotMatrix { }

type _Vec3 = [number, number, number];
export interface Vec3 extends _Vec3, NotMatrix { }

type _Vec4 = [number, number, number, number];
export interface Vec4 extends _Vec4, NotMatrix { }


type _Mat2 = [Vec2, Vec2];
export interface Mat2 extends _Mat2, Matrix { }

type _Mat3 = [Vec3, Vec3, Vec3];
export interface Mat3 extends _Mat3, Matrix { }

type _Mat4 = [Vec4, Vec4, Vec4, Vec4];
export interface Mat4 extends _Mat4, Matrix { }


export type AnyNumberArray = number | number[];

export type AnyVec = Vec2 | Vec3 | Vec4;

export type AnyMat = Mat2 | Mat3 | Mat4;

export type AnyType = AnyVec | AnyMat;

//----------------------------------------------------------------------------
//
//  Helper functions
//
function argumentsToArray(args: AnyNumberArray[]): number[] {
    return args.flatMap(e => e).flatMap(e => e);
}

export function radians(degrees: number): number {
    return degrees * Math.PI / 180.0;
}

export function degrees(radians: number): number {
    return radians * 180.0 / Math.PI;
}

//----------------------------------------------------------------------------
//
//  Vector Constructors
//

/**
 * makes a Vec2
 */
export function vec2(...args: AnyNumberArray[]): Vec2 {
    let result = argumentsToArray(args);
    switch (result.length) {
        case 0: result.push(0.0);
        case 1: result.push(0.0);
    }
    return result.splice(0, 2) as Vec2;
}

/**
 * makes a Vec3
 */
export function vec3(...args: AnyNumberArray[]): Vec3 {
    let result = argumentsToArray(args);
    switch (result.length) {
        case 0: result.push(0.0);
        case 1: result.push(0.0);
        case 2: result.push(0.0);
    }
    return result.splice(0, 3) as Vec3;
}

/**
 * makes a Vec4
 */
export function vec4(...args: AnyNumberArray[]): Vec4 {
    let result = argumentsToArray(args);
    switch (result.length) {
        case 0: result.push(0.0);
        case 1: result.push(0.0);
        case 2: result.push(0.0);
        case 3: result.push(1.0);
    }
    return result.splice(0, 4) as Vec4;
}

//----------------------------------------------------------------------------
//
//  Matrix Constructors
//
export function mat2(...args: AnyNumberArray[]): Mat2 {
    let v = argumentsToArray(args);
    let m = [];
    switch (v.length) {
        case 0:
            v[0] = 1;
        case 1:
            m = [
                vec2(v[0], 0.0),
                vec2(0.0, v[0])
            ];
            break;
        default:
            m.push(vec2(v));
            v.splice(0, 2);
            m.push(vec2(v));
            break;
    }
    let result = m as Mat2;
    result.matrix = true;
    return result;
}
//----------------------------------------------------------------------------
export function mat3(...args: AnyNumberArray[]): Mat3 {
    let v = argumentsToArray(args);
    let m = [];
    switch (v.length) {
        case 0:
            v[0] = 1;
        case 1:
            m = [
                vec3(v[0], 0.0, 0.0),
                vec3(0.0, v[0], 0.0),
                vec3(0.0, 0.0, v[0])
            ];
            break;
        default:
            m.push(vec3(v));
            v.splice(0, 3);
            m.push(vec3(v));
            v.splice(0, 3);
            m.push(vec3(v));
            break;
    }
    let result = m as Mat3;
    result.matrix = true;
    return result;
}
//----------------------------------------------------------------------------
export function mat4(...args: AnyNumberArray[]): Mat4 {
    let v = argumentsToArray(args);
    let m = [];
    switch (v.length) {
        case 0:
            v[0] = 1;
        case 1:
            m = [
                vec4(v[0], 0.0, 0.0, 0.0),
                vec4(0.0, v[0], 0.0, 0.0),
                vec4(0.0, 0.0, v[0], 0.0),
                vec4(0.0, 0.0, 0.0, v[0])
            ];
            break;
        case 4:
            m = [
                vec4(v[0], 0.0, 0.0, 0.0),
                vec4(0.0, v[1], 0.0, 0.0),
                vec4(0.0, 0.0, v[2], 0.0),
                vec4(0.0, 0.0, 0.0, v[3])
            ];
            break;
        default:
            m.push(vec4(v));
            v.splice(0, 4);
            m.push(vec4(v));
            v.splice(0, 4);
            m.push(vec4(v));
            v.splice(0, 4);
            m.push(vec4(v));
            break;
    }
    let result = m as Mat4;
    result.matrix = true;
    return result;
}
//----------------------------------------------------------------------------
//
//  Generic Mathematical Operations for Vectors and Matrices
//
export function equal<T extends AnyType>(u: T, v: T): boolean {
    if (u.length != v.length) {
        return false;
    }
    if (u.matrix && v.matrix) {
        for (let i = 0; i < u.length; ++i) {
            if (u[i].length != v[i].length) {
                return false;
            }
            for (let j = 0; j < u[i].length; ++j) {
                if (u[i][j] !== v[i][j]) {
                    return false;
                }
            }
        }
    }
    else if (u.matrix && !v.matrix || !u.matrix && v.matrix) {
        return false;
    }
    else {
        for (let i = 0; i < u.length; ++i) {
            if (u[i] !== v[i]) {
                return false;
            }
        }
    }
    return true;
}
//----------------------------------------------------------------------------
export function add<T extends AnyType>(u: T, v: T): T {
    if (u.matrix && v.matrix) {
        let m = [];
        if (u.length != v.length) {
            throw "add(): trying to add matrices of different dimensions";
        }
        for (let i = 0; i < u.length; ++i) {
            if (u[i].length != v[i].length) {
                throw "add(): trying to add matrices of different dimensions";
            }
            m.push([]);
            for (let j = 0; j < u[i].length; ++j) {
                m[i].push(u[i][j] + v[i][j]);
            }
        }
        let result = m as T;
        result.matrix = true;
        return result;
    }
    else if (u.matrix && !v.matrix || !u.matrix && v.matrix) {
        throw "add(): trying to add matrix and non-matrix variables";
    }
    else if (u.length != v.length) {
        throw "add(): vectors are not the same dimension";
    } else {
        let m = [];
        for (let i = 0; i < u.length; ++i) {
            m.push((u[i] as number) + (v[i] as number));
        }
        return m as T;
    }
}
//----------------------------------------------------------------------------
export function subtract<T extends AnyType>(u: T, v: T): T {
    if (u.matrix && v.matrix) {
        let m = [];
        if (u.length != v.length) {
            throw "subtract(): trying to subtract matrices" +
            " of different dimensions";
        }
        for (let i = 0; i < u.length; ++i) {
            if (u[i].length != v[i].length) {
                throw "subtract(): trying to subtact matrices" +
                " of different dimensions";
            }
            m.push([]);
            for (let j = 0; j < u[i].length; ++j) {
                m[i].push(u[i][j] - v[i][j]);
            }
        }
        let result = m as T;
        result.matrix = true;
        return result;
    }
    else if (u.matrix && !v.matrix || !u.matrix && v.matrix) {
        throw "subtact(): trying to subtact  matrix and non-matrix variables";
    }
    else if (u.length != v.length) {
        throw "subtract(): vectors are not the same length";
    } else {
        let m = [];
        for (let i = 0; i < u.length; ++i) {
            m.push((u[i] as number) - (v[i] as number));
        }
        return m as T;
    }
}
//----------------------------------------------------------------------------
export function mult_mat<T extends AnyMat>(u: T, v: T): T {
    if (u.length != v.length) {
        throw "mult_mat(): trying to mult matrices of different dimensions";
    } else {
        let m = [];
        for (let i = 0; i < u.length; ++i) {
            if (u[i].length != v[i].length) {
                throw "mult_mat(): trying to mult matrices of different dimensions";
            }
        }
        for (let i = 0; i < u.length; ++i) {
            m.push([]);
            for (let j = 0; j < v.length; ++j) {
                let sum = 0.0;
                for (let k = 0; k < u.length; ++k) {
                    sum += u[i][k] * v[k][j];
                }
                m[i].push(sum);
            }
        }
        let result = m as T;
        result.matrix = true;
        return result;
    }
}
export function mult_mat_vec<T extends AnyMat>(u: T, v: T[0]): T[0] {
    if (u.length != v.length) {
        throw "mult_mat(): trying to mult matrices and vectors of different dimensions";
    } else {
        let m = [];
        for (let i = 0; i < v.length; i++) {
            let sum = 0.0;
            for (let j = 0; j < v.length; j++) {
                sum += u[i][j] * v[j];
            }
            m.push(sum);
        }
        return m as T[0];
    }
}

export function mult_vec<T extends AnyVec>(u: T, v: T): T {
    if (u.length != v.length) {
        throw "mult_vec(): vectors are not the same dimension";
    } else {
        let result = [];
        for (let i = 0; i < u.length; ++i) {
            result.push(u[i] * v[i]);
        }
        return result as T;
    }
}
//----------------------------------------------------------------------------
//
//  Basic Transformation Matrix Generators
//
export function translate(v: Vec3): Mat4 {
    let result = mat4();
    result[0][3] = v[0];
    result[1][3] = v[1];
    result[2][3] = v[2];
    return result;
}
//----------------------------------------------------------------------------
export function rotate(axis: Vec3, angle: number): Mat4 {
    let v = normalize(axis);
    let x = v[0];
    let y = v[1];
    let z = v[2];
    let c = Math.cos(radians(angle));
    let omc = 1.0 - c;
    let s = Math.sin(radians(angle));
    let result = mat4(
        vec4(x * x * omc + c, x * y * omc - z * s, x * z * omc + y * s, 0.0),
        vec4(x * y * omc + z * s, y * y * omc + c, y * z * omc - x * s, 0.0),
        vec4(x * z * omc - y * s, y * z * omc + x * s, z * z * omc + c, 0.0),
        vec4());
    return result;
}
export function rotateX(theta: number): Mat4 {
    let c = Math.cos(radians(theta));
    let s = Math.sin(radians(theta));
    let rx = mat4(1.0, 0.0, 0.0, 0.0, 0.0, c, -s, 0.0, 0.0, s, c, 0.0, 0.0, 0.0, 0.0, 1.0);
    return rx;
}
export function rotateY(theta: number): Mat4 {
    let c = Math.cos(radians(theta));
    let s = Math.sin(radians(theta));
    let ry = mat4(c, 0.0, s, 0.0, 0.0, 1.0, 0.0, 0.0, -s, 0.0, c, 0.0, 0.0, 0.0, 0.0, 1.0);
    return ry;
}
export function rotateZ(theta: number): Mat4 {
    let c = Math.cos(radians(theta));
    let s = Math.sin(radians(theta));
    let rz = mat4(c, -s, 0.0, 0.0, s, c, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
    return rz;
}
//----------------------------------------------------------------------------
export function scalem(v: Vec3): Mat4 {
    let result = mat4();
    result[0][0] = v[0];
    result[1][1] = v[1];
    result[2][2] = v[2];
    return result;
}
//----------------------------------------------------------------------------
//
//  ModelView Matrix Generators
//
export function lookAt(eye: Vec3, at: Vec3, up: Vec3): Mat4 {
    if (equal(eye, at)) {
        return mat4();
    }
    let v = normalize(subtract(at, eye)); // view direction vector
    let n = normalize(cross(v, up)); // perpendicular vector
    let u = normalize(cross(n, v)); // "new" up vector
    let v2 = negate(v);
    let result = mat4(vec4(n, -dot(n, eye)), vec4(u, -dot(u, eye)), vec4(v2, -dot(v2, eye)), vec4());
    return result;
}
//----------------------------------------------------------------------------
//
//  Projection Matrix Generators
//
export function ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4 {
    if (left == right) {
        throw "ortho(): left and right are equal";
    }
    if (bottom == top) {
        throw "ortho(): bottom and top are equal";
    }
    if (near == far) {
        throw "ortho(): near and far are equal";
    }
    let w = right - left;
    let h = top - bottom;
    let d = far - near;
    let result = mat4();
    result[0][0] = 2.0 / w;
    result[1][1] = 2.0 / h;
    result[2][2] = -2.0 / d;
    result[0][3] = -(left + right) / w;
    result[1][3] = -(top + bottom) / h;
    result[2][3] = -(near + far) / d;
    return result;
}
//----------------------------------------------------------------------------
export function perspective(fovy: number, aspect: number, near: number, far: number) {
    let f = 1.0 / Math.tan(radians(fovy) / 2);
    let d = far - near;
    let result = mat4();
    result[0][0] = f / aspect;
    result[1][1] = f;
    result[2][2] = -(near + far) / d;
    result[2][3] = -2 * near * far / d;
    result[3][2] = -1;
    result[3][3] = 0.0;
    return result;
}
//----------------------------------------------------------------------------
//
//  Matrix Functions
//
export function transpose<T extends AnyMat>(m: T): T {
    let ret = Object.assign([], { matrix: true });
    for (let i = 0; i < m.length; ++i) {
        ret.push([]);
        for (let j = 0; j < m[i].length; ++j) {
            ret[i].push(m[j][i]);
        }
    }
    return ret as T;
}
//----------------------------------------------------------------------------
//
//  Vector Functions
//
export function dot<T extends AnyVec>(u: T, v: T): number {
    if (u.length != v.length) {
        throw "dot(): vectors are not the same dimension";
    }
    let sum = 0.0;
    for (let i = 0; i < u.length; ++i) {
        sum += u[i] * v[i];
    }
    return sum;
}
//----------------------------------------------------------------------------
export function negate<T extends Vec3>(u: T): T {
    let result = [];
    for (let i = 0; i < u.length; ++i) {
        result.push(-u[i]);
    }
    return result as T;
}
//----------------------------------------------------------------------------
export function cross(u: Vec3, v: Vec3): Vec3 {
    let result = [
        u[1] * v[2] - u[2] * v[1],
        u[2] * v[0] - u[0] * v[2],
        u[0] * v[1] - u[1] * v[0]
    ];
    return result as Vec3;
}
//----------------------------------------------------------------------------
export function length(u: AnyVec): number {
    return Math.sqrt(dot(u, u));
}
//----------------------------------------------------------------------------
export function normalize<T extends AnyVec>(u: T, excludeLastComponent: boolean = false): T {
    let last;
    if (excludeLastComponent) {
        last = u.pop();
    }
    let len = length(u);
    if (!isFinite(len)) {
        throw "normalize: vector " + u + " has zero length";
    }
    for (let i = 0; i < u.length; ++i) {
        u[i] /= len;
    }
    if (excludeLastComponent) {
        u.push(last);
    }
    return u;
}
//----------------------------------------------------------------------------
export function mix<T extends AnyVec>(u: T, v: T, s: number): T {
    let result = [];
    for (let i = 0; i < u.length; ++i) {
        result.push((1.0 - s) * u[i] + s * v[i]);
    }
    return result as T;
}
//----------------------------------------------------------------------------
//
// Vector and Matrix functions
//
export function scale<T extends AnyVec>(u: T, s: number): T {
    let result = [];
    for (let i = 0; i < u.length; ++i) {
        result.push(s * u[i]);
    }
    return result as T;
}

//----------------------------------------------------------------------------
//
//
//
// export function flatten(v: AnyType): Float32Array {
//     if (v.matrix === true) {
//         v = transpose(v);
//     }
//     let n = v.length;
//     let elemsAreArrays = false;
//     if (Array.isArray(v[0])) {
//         elemsAreArrays = true;
//         n *= v[0].length;
//     }
//     let floats = new Float32Array(n);
//     if (elemsAreArrays) {
//         let idx = 0;
//         for (let i = 0; i < v.length; ++i) {
//             for (let j = 0; j < v[i].length; ++j) {
//                 floats[idx++] = v[i][j];
//             }
//         }
//     }
//     else {
//         for (let i = 0; i < v.length; ++i) {
//             floats[i] = v[i];
//         }
//     }
//     return floats;
// }
//----------------------------------------------------------------------------
// let sizeof = {
//     'vec2': new Float32Array(flatten(vec2())).byteLength,
//     'vec3': new Float32Array(flatten(vec3())).byteLength,
//     'vec4': new Float32Array(flatten(vec4())).byteLength,
//     'mat2': new Float32Array(flatten(mat2())).byteLength,
//     'mat3': new Float32Array(flatten(mat3())).byteLength,
//     'mat4': new Float32Array(flatten(mat4())).byteLength
// };
// new functions 5/2/2015
// printing
export function printm(m) {
    if (m.length == 2)
        for (let i = 0; i < m.length; i++)
            console.log(m[i][0], m[i][1]);
    else if (m.length == 3)
        for (let i = 0; i < m.length; i++)
            console.log(m[i][0], m[i][1], m[i][2]);
    else if (m.length == 4)
        for (let i = 0; i < m.length; i++)
            console.log(m[i][0], m[i][1], m[i][2], m[i][3]);
}
// determinants
export function det2(m: Mat2): number {
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}
export function det3(m: Mat3): number {
    let d = m[0][0] * m[1][1] * m[2][2]
        + m[0][1] * m[1][2] * m[2][0]
        + m[0][2] * m[2][1] * m[1][0]
        - m[2][0] * m[1][1] * m[0][2]
        - m[1][0] * m[0][1] * m[2][2]
        - m[0][0] * m[1][2] * m[2][1];
    return d;
}
export function det4(m: Mat4): number {
    let m0 = mat3(
        vec3(m[1][1], m[1][2], m[1][3]),
        vec3(m[2][1], m[2][2], m[2][3]),
        vec3(m[3][1], m[3][2], m[3][3])
    );
    let m1 = mat3(
        vec3(m[1][0], m[1][2], m[1][3]),
        vec3(m[2][0], m[2][2], m[2][3]),
        vec3(m[3][0], m[3][2], m[3][3])
    );
    let m2 = mat3(
        vec3(m[1][0], m[1][1], m[1][3]),
        vec3(m[2][0], m[2][1], m[2][3]),
        vec3(m[3][0], m[3][1], m[3][3])
    );
    let m3 = mat3(
        vec3(m[1][0], m[1][1], m[1][2]),
        vec3(m[2][0], m[2][1], m[2][2]),
        vec3(m[3][0], m[3][1], m[3][2])
    );
    return m[0][0] * det3(m0) - m[0][1] * det3(m1)
        + m[0][2] * det3(m2) - m[0][3] * det3(m3);
}
export function det(m: AnyMat): number {
    if (m.length == 2)
        return det2(m);
    if (m.length == 3)
        return det3(m);
    if (m.length == 4)
        return det4(m);
}
//---------------------------------------------------------
// inverses
export function inverse2(m: Mat2): Mat2 {
    let a = mat2();
    let d = det2(m);
    a[0][0] = m[1][1] / d;
    a[0][1] = -m[0][1] / d;
    a[1][0] = -m[1][0] / d;
    a[1][1] = m[0][0] / d;
    a.matrix = true;
    return a;
}
export function inverse3(m: Mat3): Mat3 {
    let a = mat3();
    let d = det3(m);
    let a00 = mat2(
        vec2(m[1][1], m[1][2]),
        vec2(m[2][1], m[2][2])
    );
    let a01 = mat2(
        vec2(m[1][0], m[1][2]),
        vec2(m[2][0], m[2][2])
    );
    let a02 = mat2(
        vec2(m[1][0], m[1][1]),
        vec2(m[2][0], m[2][1])
    );
    let a10 = mat2(
        vec2(m[0][1], m[0][2]),
        vec2(m[2][1], m[2][2])
    );
    let a11 = mat2(
        vec2(m[0][0], m[0][2]),
        vec2(m[2][0], m[2][2])
    );
    let a12 = mat2(
        vec2(m[0][0], m[0][1]),
        vec2(m[2][0], m[2][1])
    );
    let a20 = mat2(
        vec2(m[0][1], m[0][2]),
        vec2(m[1][1], m[1][2])
    );
    let a21 = mat2(
        vec2(m[0][0], m[0][2]),
        vec2(m[1][0], m[1][2])
    );
    let a22 = mat2(
        vec2(m[0][0], m[0][1]),
        vec2(m[1][0], m[1][1])
    );
    a[0][0] = det2(a00) / d;
    a[0][1] = -det2(a10) / d;
    a[0][2] = det2(a20) / d;
    a[1][0] = -det2(a01) / d;
    a[1][1] = det2(a11) / d;
    a[1][2] = -det2(a21) / d;
    a[2][0] = det2(a02) / d;
    a[2][1] = -det2(a12) / d;
    a[2][2] = det2(a22) / d;
    return a;
}
export function inverse4(m: Mat4): Mat4 {
    let a = mat4();
    let d = det4(m);
    let a00 = mat3(
        vec3(m[1][1], m[1][2], m[1][3]),
        vec3(m[2][1], m[2][2], m[2][3]),
        vec3(m[3][1], m[3][2], m[3][3])
    );
    let a01 = mat3(
        vec3(m[1][0], m[1][2], m[1][3]),
        vec3(m[2][0], m[2][2], m[2][3]),
        vec3(m[3][0], m[3][2], m[3][3])
    );
    let a02 = mat3(
        vec3(m[1][0], m[1][1], m[1][3]),
        vec3(m[2][0], m[2][1], m[2][3]),
        vec3(m[3][0], m[3][1], m[3][3])
    );
    let a03 = mat3(
        vec3(m[1][0], m[1][1], m[1][2]),
        vec3(m[2][0], m[2][1], m[2][2]),
        vec3(m[3][0], m[3][1], m[3][2])
    );
    let a10 = mat3(
        vec3(m[0][1], m[0][2], m[0][3]),
        vec3(m[2][1], m[2][2], m[2][3]),
        vec3(m[3][1], m[3][2], m[3][3])
    );
    let a11 = mat3(
        vec3(m[0][0], m[0][2], m[0][3]),
        vec3(m[2][0], m[2][2], m[2][3]),
        vec3(m[3][0], m[3][2], m[3][3])
    );
    let a12 = mat3(
        vec3(m[0][0], m[0][1], m[0][3]),
        vec3(m[2][0], m[2][1], m[2][3]),
        vec3(m[3][0], m[3][1], m[3][3])
    );
    let a13 = mat3(
        vec3(m[0][0], m[0][1], m[0][2]),
        vec3(m[2][0], m[2][1], m[2][2]),
        vec3(m[3][0], m[3][1], m[3][2])
    );
    let a20 = mat3(
        vec3(m[0][1], m[0][2], m[0][3]),
        vec3(m[1][1], m[1][2], m[1][3]),
        vec3(m[3][1], m[3][2], m[3][3])
    );
    let a21 = mat3(
        vec3(m[0][0], m[0][2], m[0][3]),
        vec3(m[1][0], m[1][2], m[1][3]),
        vec3(m[3][0], m[3][2], m[3][3])
    );
    let a22 = mat3(
        vec3(m[0][0], m[0][1], m[0][3]),
        vec3(m[1][0], m[1][1], m[1][3]),
        vec3(m[3][0], m[3][1], m[3][3])
    );
    let a23 = mat3(
        vec3(m[0][0], m[0][1], m[0][2]),
        vec3(m[1][0], m[1][1], m[1][2]),
        vec3(m[3][0], m[3][1], m[3][2])
    );
    let a30 = mat3(
        vec3(m[0][1], m[0][2], m[0][3]),
        vec3(m[1][1], m[1][2], m[1][3]),
        vec3(m[2][1], m[2][2], m[2][3])
    );
    let a31 = mat3(
        vec3(m[0][0], m[0][2], m[0][3]),
        vec3(m[1][0], m[1][2], m[1][3]),
        vec3(m[2][0], m[2][2], m[2][3])
    );
    let a32 = mat3(
        vec3(m[0][0], m[0][1], m[0][3]),
        vec3(m[1][0], m[1][1], m[1][3]),
        vec3(m[2][0], m[2][1], m[2][3])
    );
    let a33 = mat3(
        vec3(m[0][0], m[0][1], m[0][2]),
        vec3(m[1][0], m[1][1], m[1][2]),
        vec3(m[2][0], m[2][1], m[2][2])
    );
    a[0][0] = det3(a00) / d;
    a[0][1] = -det3(a10) / d;
    a[0][2] = det3(a20) / d;
    a[0][3] = -det3(a30) / d;
    a[1][0] = -det3(a01) / d;
    a[1][1] = det3(a11) / d;
    a[1][2] = -det3(a21) / d;
    a[1][3] = det3(a31) / d;
    a[2][0] = det3(a02) / d;
    a[2][1] = -det3(a12) / d;
    a[2][2] = det3(a22) / d;
    a[2][3] = -det3(a32) / d;
    a[3][0] = -det3(a03) / d;
    a[3][1] = det3(a13) / d;
    a[3][2] = -det3(a23) / d;
    a[3][3] = det3(a33) / d;
    return a;
}
export function inverse<T extends AnyMat>(m: T): T {
    if (m.length == 2)
        return inverse2(m) as T;
    if (m.length == 3)
        return inverse3(m) as T;
    if (m.length == 4)
        return inverse4(m) as T;
}
export function normalMatrix(m, flag) {
    let a = mat4();
    a = inverse(transpose(m));
    if (flag != true)
        return a;
    else {
        let b = mat3();
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
                b[i][j] = a[i][j];
        return b;
    }
}

export function clamp(num: number, min: number, max: number): number {
    return Math.max(Math.min(num, max), min);
}

export function clampv<T extends AnyVec>(v: T, min: number, max: number): T {
    return v.map(e => clamp(e, min, max)) as T;
}

export function get_translation(u: Mat4): Vec3 {
    return vec3([0, 1, 2].map(e => u[e][3]));
}