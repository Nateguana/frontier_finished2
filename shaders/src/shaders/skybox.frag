precision mediump float;

uniform mat4 mInverseView;
uniform samplerCube texture;
varying vec2 V;

void main() {
    vec4 L = mInverseView * vec4(V, 1, 1);
    vec4 fcolor = textureCube(texture, normalize(L.xyz / L.w));
    gl_FragColor = fcolor;// + vec4(1.0, 0.0, 1.0, 1.0);
}