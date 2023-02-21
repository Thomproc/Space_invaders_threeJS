import * as THREE from 'three';

class CamerasManager{
    #events
    #cameras = []
    #currentCameraIndex
    #currentCamera

    #fov = 50
    #near = 0.1
    #far = 100

    constructor(events) {
        this.#events = events;
        this.#currentCamera = this.createCamera(new THREE.Vector3(0, 3, -11), new THREE.Vector3(0, 0, 100));
        this.#currentCameraIndex = this.addCamera(this.#currentCamera);
        this.#events.addEvent(
            "keypress", 
            e => {
                if(e.key === "c") {
                    this.switchCamera();
                }
        }
        );
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
