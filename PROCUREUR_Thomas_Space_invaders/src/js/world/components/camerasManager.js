import * as THREE from 'three';

class CamerasManager{
    #cameras = []
    #currentCameraIndex
    #currentCamera

    #fov = 40
    #near = 0.1
    #far = 500

    constructor() {
        this.#currentCamera = this.createCamera(new THREE.Vector3(0, 6, -17), new THREE.Vector3(0, 0, 100));
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

    switchCamera(){
        this.#currentCameraIndex = (this.#currentCameraIndex + 1) % this.#cameras.length;
        this.#currentCamera = this.#cameras[this.#currentCameraIndex];
    }

    getCurrentCamera(){
        return this.#currentCamera;
    }
}

export { CamerasManager };
