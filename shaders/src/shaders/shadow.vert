attribute vec3 vPosition;

uniform mat4 mMatrix;

void main() {
    gl_Position = mMatrix * vec4(vPosition, 1.0);
}