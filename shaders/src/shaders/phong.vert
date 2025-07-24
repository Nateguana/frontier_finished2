attribute vec3 vPosition;
attribute vec3 vNormal;
attribute vec2 vTexture;

uniform mat4 mModel;
uniform mat4 mView;
uniform mat4 mProjection;
uniform mat4 mShadow;
uniform vec3 vLightPos;

varying vec3 L, N, V;
varying vec2 UV;
varying vec4 S;

void main() {
    vec4 world_pos = mModel * vec4(vPosition, 1.0);
    vec4 view_pos = mView * world_pos;
    vec3 normal = mat3(mView) * mat3(mModel) * vNormal;

    L = vLightPos - view_pos.xyz;

    N = normal;

    V = -view_pos.xyz;

    UV = vTexture;

    S = mShadow * world_pos;

    gl_Position = mProjection * view_pos;
}