import * as THREE from 'three';
import { config } from './config'

const bulletBox = new THREE.Box3();

class Bullet {
    #scene
    #mesh

    #maxDepth = config.world.size.depth;
    #secondTick = false //La balle n'a le temps de s'afficher avant que la fonction tick() soit appelée et l'avance. 
                        //Cela permet d'attendre qu'elle soit rendue une première fois avant de mettre à jour sa position.
    #type
    #playerBulletradius = 0.1
    #enemyBulletradius = 0.2
    #speed
    #bulletProgression = 0 // Pour savoir de combien la balle a réellement avancée
    #damage
    
    constructor(scene, type,  position, speed, damage){
        this.#scene = scene;
        this.#type = type;
        this.#speed = speed;
        this.#damage = damage;

        if(type == "player"){
            const geometry = new THREE.SphereGeometry(this.#playerBulletradius, 5, 5);
            const material = new THREE.MeshStandardMaterial({
                color: 0x966100,
                metalness: 0.9,
                roughness: 0.2
            });
            this.#mesh = new THREE.Mesh(geometry, material);
            this.#mesh.position.set(position.x, position.y, position.z += this.#playerBulletradius / 2);
        } else {
            const geometry = new THREE.IcosahedronGeometry(this.#enemyBulletradius, 0);
            const material = new THREE.MeshStandardMaterial({
                color: 0x995407,
                metalness: 0.75,
                roughness: 0.2
            });
            this.#mesh = new THREE.Mesh(geometry, material);
            this.#mesh.position.set(position.x, position.y, position.z -= this.#enemyBulletradius / 2);
        }

        this.#scene.add(this.#mesh);
    }

    tick(delta){
        this.#bulletProgression = this.#speed * delta;
        if(this.#type == "player") {
            this.#secondTick ? this.#mesh.position.z += this.#bulletProgression : this.#secondTick = true;
        } else if(this.#type == "enemy") {
            this.#secondTick ? this.#mesh.position.z -= this.#bulletProgression : this.#secondTick = true;
        }
    }

    outOfWorld(){
        return this.#mesh.position.z > this.#maxDepth || this.#mesh.position.z < -this.#maxDepth ;
    }

//// Getters
    getDamage(){
        return this.#damage;
    }

    getMesh(){
        return this.#mesh;
    }

    getBox(){
        bulletBox.setFromObject(this.#mesh);
        if(this.#type == "player"){
            bulletBox.min.z -= this.#bulletProgression;
        }
        else if(this.#mesh.position.z > 0){
            bulletBox.max.z += this.#bulletProgression;
        }
        return bulletBox;
    }
}

export { Bullet }