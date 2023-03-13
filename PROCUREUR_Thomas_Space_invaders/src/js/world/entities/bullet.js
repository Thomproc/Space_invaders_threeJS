import * as THREE from 'three';
import { config } from './config'

const pi = Math.PI;

class Bullet {
    #scene
    #mesh

    #maxDepth = config.world.size.depth;
    #secondTick = false //La balle n'a le temps de s'affichée avant que la fonction tick() soit appelée et l'avance. 
                        //Cela permet d'attendre qu'elle soit rendue une première fois avant de mettre à jour sa position.
    #radius = 0.1
    #speed
    #damage
    
    constructor(scene, position, speed, damage){
        this.#scene = scene;
        const geometry = new THREE.SphereGeometry(this.#radius, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 0.9,
            roughness: 0.2
        });
        this.#mesh = new THREE.Mesh(geometry, material);
        this.#mesh.position.set(position.x, position.y, position.z += this.#radius / 2);
        this.#scene.add(this.#mesh);

        this.#speed = speed;
        this.#damage = damage;
    }

    tick(delta){
        this.#secondTick ? this.#mesh.position.z += this.#speed : this.#secondTick = true;
    }

    outOfWorld(){
        return this.#mesh.position.z > this.#maxDepth;
    }

    getDamage(){
        return this.#damage;
    }

    getMesh(){
        return this.#mesh;
    }
}

export { Bullet }