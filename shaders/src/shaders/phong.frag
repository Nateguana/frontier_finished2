precision mediump float;

uniform mat3 mLightMults;
uniform float shininess;
uniform float light_type;
uniform float skybox_type;
uniform sampler2D texture;
uniform samplerCube skybox;
uniform sampler2D shadow;

uniform mat4 mInverseView;

varying vec3 L, N, V;
varying vec2 UV;
varying vec4 S;

vec3 get_color(vec3 V, vec3 L, vec3 N, vec3 diffuse_color, vec3 specular_color, float light_type) {
    float LN_dot = dot(L, N);

    vec3 R = (2.0 * LN_dot * N) - L;

    float ambient_light;
    float other_light;
    if(light_type < 0.0) {
        ambient_light = -light_type;
        other_light = 0.0;
    } else {
        ambient_light = 0.25;
        other_light = light_type;
    }

    vec3 diffuse = diffuse_color * max(LN_dot, 0.0);
    vec3 specular = specular_color * pow(max(dot(V, R), 0.0), shininess);
    vec3 ambient = diffuse_color * ambient_light;

    return ambient + (specular + diffuse) * other_light;
}

void main() {
    vec2 uv = UV;
    float texture_mix = uv.x < 0.0 ? 0.0 : 0.8;
    uv.y = 1.0 - uv.y;

    vec3 diffuse_color = (1.0 - texture_mix) * mLightMults[0] +
        texture_mix * texture2D(texture, uv).xyz;

    float light_type_num = light_type;

    vec3 shadow_uv = S.xyz / S.w;
    float pixel_depth = shadow_uv.z - .01;
    float shadow_depth = texture2D(shadow, shadow_uv.xy).x;

    // if(shadow_uv.z < 0.0) {
    //     gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    //     return;
    // }

    // bool x = clamp(shadow_uv.x, 0.0, 1.0) != shadow_uv.x;
    // bool y = clamp(shadow_uv.y, 0.0, 1.0) != shadow_uv.y;
    // bool is_in_range = shadow_uv.x >= 0.0 &&
    //     shadow_uv.x >= 1.0 &&
    //     shadow_uv.y >= 0.0 &&
    //     shadow_uv.y >= 1.0;
    // if(x || y) {
    //     gl_FragColor = vec4(x ? 1.0 : 0.0, 0.0, y ? 1.0 : 0.0, 1.0);
    //     return;
    // }

    if(pixel_depth >= shadow_depth) {
        light_type_num = 0.0;
        // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        // return;
    }

    vec3 N_V = normalize(V);
    vec3 N_L = normalize(L);
    vec3 N_N = normalize(N);

    float skybox_mix = 0.0;
    vec3 skybox_uv = reflect(-N_V, N_N);

    if(skybox_type != 0.0) {
        skybox_mix = 0.25;
    }
    if(skybox_type < 0.0) {
        skybox_uv = refract(-N_V, N_N, 1.5);
    }

    vec3 skybox_dir = mat3(mInverseView) * skybox_uv;
    vec3 rcolor = textureCube(skybox, skybox_dir).xyz;

    vec3 fcolor = get_color(N_V, N_L, N_N, diffuse_color, mLightMults[2], light_type_num);

    vec3 color = (1.0 - skybox_mix) * fcolor + skybox_mix * rcolor;
    gl_FragColor = vec4(color, 1.0);
}
