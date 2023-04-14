import * as THREE from "three";

function sumVectors(vectors){
    const sum = new THREE.Vector3(0, 0, 0);
    vectors.forEach(vi => {
        sum.add(vi);
    });
    return sum;
}

function getMeshFromModel(object){
    const meshes = [];
    if (object.isMesh) {
        meshes.push(object);
        return meshes;
    }
    for (let i = 0; i < object.children.length; i++) {
        const child = object.children[i];
        const newMeshes = getMeshFromModel(child);
        if (newMeshes.length != 0) {
            meshes.push(...newMeshes);
        }
    }
    return meshes;
}

export { sumVectors, getMeshFromModel }