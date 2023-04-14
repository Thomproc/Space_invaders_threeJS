import * as THREE from 'three';
import { config } from './config';

const pi = Math.PI;
const shieldSphere = new THREE.Sphere();

class Shield {
    #scene
    #loop
    #datas // Contient 3 modèles 3D de bouclier qui représentent l'état du bouclier

    #maxHit = 3 // Nombre de collisions que peut supporter la protection
    #nbHit = 0

    constructor(scene, loop, datas){
        this.#scene = scene;
        this.#loop = loop;
        this.#datas = datas;

        const rotation = new THREE.Euler(2 * pi * Math.random(), 2 * pi * Math.random(), 2 * pi * Math.random())
        for (const shieldDatas of Object.values(this.#datas)) {
            shieldDatas.model.rotation.copy(rotation);
            this.#scene.add(shieldDatas.model);
        }
    }

    tick(delta){
        if(!this.isDead()){
            for (const shieldDatas of Object.values(this.#datas)) {
                shieldDatas.model.rotation.x += config.shield.rotationSpeed * delta;
                shieldDatas.model.rotation.z += config.shield.rotationSpeed * delta;
            }
        }
    }

    hit(){
        this.disableModel();
        this.#nbHit++;
    }

    destroy(){
        while(this.#nbHit < this.#maxHit){
            this.disableModel();
            this.#nbHit++;
        }
    }

    disableModel(){
        this.#datas[this.#nbHit].model.visible = false;
    }

    enableModel(){
        this.#datas[this.#nbHit].model.visible = true;
    }

    isDead(){
        return this.#nbHit == this.#maxHit;
    }

    reset(){
        if(this.isDead()){
            this.#nbHit--;
        }
        while(this.#nbHit >= 0){
            this.enableModel();
            this.#nbHit--;
        }
        this.#nbHit = 0;
    }

//// Getters et setters

    getModel(){
        return this.#datas[this.#nbHit].model;
    }

    getSphere(){
        shieldSphere.set(this.#datas[this.#nbHit].model.position, this.#datas[this.#nbHit].size.x / 2);
        return shieldSphere;
    }

    setPosition(newPosition){
        for (const shieldDatas of Object.values(this.#datas)) {
            shieldDatas.model.position.copy(newPosition);
        }
    }

}

export { Shield }