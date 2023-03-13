import * as THREE from 'three';
import { config } from './config'

const collisionBox = new THREE.Box3();

class Enemy {
    #scene
    #datas

    #type
    #health

    constructor(scene, enemyDatas, type){
        this.#scene = scene;
        this.#datas = enemyDatas;
        
        this.#type = type;
        this.#health = config.enemies[this.#type].health;

        // this.#scene.add(this.#datas.model);
    }

    tick(delta){
        this.#datas.model.position.z -= config.enemies[this.#type].speed;
        this.animate(delta);
    }

    animate(delta){
        this.#datas.mixer.update(delta);
    }

    hit(damage){
        this.#health -= damage;
    }

    collisionWithEnemy(bulletSphere, damage){
        collisionBox.setFromObject(this.#datas.model);
        let collisionBoxHelper = new THREE.Box3Helper(collisionBox, 0xffff00);
        this.#scene.add(collisionBoxHelper);
        if(collisionBox.intersectsSphere(bulletSphere)){
            console.log("ennemi touché !");
            this.hit(damage);
            return true;
        }
        return false;
    }

    setPosition(newPosition){
        this.#datas.model.position.copy(newPosition);
    }

    getHealth(){
        return this.#health;
    }

    getModel(){
        return this.#datas.model;
    }

}

export { Enemy }