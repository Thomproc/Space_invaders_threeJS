import * as THREE from 'three';
import { config } from '../entities/config';

class CamerasManager{
    #cameras = []
    #currentCameraIndex
    #currentCamera

    #fov = 20
    #near = 0.1
    #far = 2000

    constructor() {
        this.#currentCamera = this.createCamera(new THREE.Vector3(0, 10, -40), new THREE.Vector3(0, 0, config.world.size.depth / 2));
        this.#currentCameraIndex = this.addCamera(this.#currentCamera);
    }

    createCamera(position, target) {
        const aspect = window.innerWidth / window.innerHeight;
        const camera = new THREE.PerspectiveCamera(this.#fov, aspect, this.#near, this.#far);
        
        camera.position.copy(position);
        camera.lookAt(target);
        return camera;
    }

    //Rajoute une caméra à la liste et renvoie l'index de la caméra ajoutée dans la liste
    addCamera(camera){
        this.#cameras.push(camera);
        return this.#cameras.length - 1;
    }

    updateCameraPosition(indexCamera, newPosition){
        this.#cameras[indexCamera].position.copy(newPosition);
    }

    switchCamera(camIndex){
        // this.#currentCameraIndex = (this.#currentCameraIndex + 1) % this.#cameras.length;
        this.#currentCameraIndex = camIndex;
        this.#currentCamera = this.#cameras[this.#currentCameraIndex];
    }

    getCurrentCamera(){
        return this.#currentCamera;
    }
}

export { CamerasManager };
