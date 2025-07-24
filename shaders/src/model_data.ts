export interface Load_Geometry {
    type: 'obj';
    path: string;
    name: string;
    materal: string;
}

export interface Load_Material {
    type: 'mtl';
    path: string;
    name: string;
}

export type Texture_Target = "2d" | "+x" | "-x" | "+y" | "-y" | "+z" | "-z";

export interface Load_Texture {
    type: 'png';
    path: string;
    name: string;
    alpha: boolean;
    slot: number;
    target: Texture_Target;
}

export type LoadData = Load_Geometry | Load_Material | Load_Texture;

const path = 'https://web.cs.wpi.edu/~jmcuneo/cs4731/project3/';
export const MODEL_DATA: LoadData[] = [
    { path, name: 'bunny', type: 'mtl' },
    { path, name: 'bunny', type: 'obj', materal: 'bunny' },
    { path, name: 'car', type: 'mtl' },
    { path, name: 'car', type: 'obj', materal: 'car' },
    { path, name: 'lamp', type: 'mtl' },
    { path, name: 'lamp', type: 'obj', materal: 'lamp' },
    { path, name: 'skybox_negx', type: 'png', alpha: false, slot: 1, target: "-x" },
    { path, name: 'skybox_negy', type: 'png', alpha: false, slot: 1, target: "-y" },
    { path, name: 'skybox_negz', type: 'png', alpha: false, slot: 1, target: "-z" },
    { path, name: 'skybox_posx', type: 'png', alpha: false, slot: 1, target: "+x" },
    { path, name: 'skybox_posy', type: 'png', alpha: false, slot: 1, target: "+y" },
    { path, name: 'skybox_posz', type: 'png', alpha: false, slot: 1, target: "+z" },
    { path, name: 'stop', type: 'png', alpha: true, slot: 2, target: "2d" },
    { path, name: 'stop_alt', type: 'png', alpha: false, slot: 3, target: "2d" },
    { path, name: 'stopsign', type: 'mtl' },
    { path, name: 'stopsign', type: 'obj', materal: 'lamp' },
    { path, name: 'street', type: 'mtl' },
    { path, name: 'street', type: 'obj', materal: 'street' },
    { path, name: 'street_alt', type: 'mtl' },
    { path, name: 'street_alt', type: 'obj', materal: 'street_alt' },
];