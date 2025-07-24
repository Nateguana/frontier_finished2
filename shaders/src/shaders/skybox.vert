attribute vec2 vPosition;
varying vec2 V;

void main() {
    V = vPosition;
    gl_Position = vec4(vPosition, 1, 1);
}