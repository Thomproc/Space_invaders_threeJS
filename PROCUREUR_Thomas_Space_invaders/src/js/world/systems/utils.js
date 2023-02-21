import { Vector3 } from "three";

function sumVectors(v1, v2){
    return new Vector3().copy(v1).add(v2);
}

export { sumVectors }