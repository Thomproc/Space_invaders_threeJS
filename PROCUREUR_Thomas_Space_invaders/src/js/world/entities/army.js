import * as THREE from 'three';
import { Battalion } from './battalion'
import { config } from './config'

const collisionBox = new THREE.Box3()
class Army {
    #scene
    #models

    #armyGroup = new THREE.Group()
    #battalions = []

    constructor(scene, models){
        this.#scene = scene;
        this.#models = models;
    }

    buildLevel(level){
        console.log("niveau :", level);
        const enemiesStructure = config.levels[level].enemies.structure;
        for (let i = 0; i < enemiesStructure.nbBattalions; i++) {
            const battalionConfig = {
                "nbBattalions": enemiesStructure.nbBattalions,
                "index": i,
                "enemiesType": enemiesStructure.types[i],
                "nbEnemies": enemiesStructure.nbEnemiesPerBattalion[i]
            }
            const battalion = new Battalion(this.#scene, this.#models, battalionConfig);
            this.#battalions.push(battalion);
            this.#armyGroup.add(battalion.getGroup())
        }
        this.#scene.add(this.#armyGroup)
    }

    tick(delta){
        this.#battalions.forEach(battalion => {
            battalion.tick(delta);
        });
    }

    collisionWithEnemy(bulletSphere, damage){
        collisionBox.setFromObject(this.#armyGroup);
        // const collisionBoxHelper = new THREE.Box3Helper(collisionBox, 0xffff00);
        // this.#scene.add(collisionBoxHelper);
        if(collisionBox.intersectsSphere(bulletSphere)){
            // Pour chaque battaillon dans mon armée, on regarde s'il y a une collision
            for (let index = 0; index < this.#battalions.length; index++) {
                const battalion = this.#battalions[index];
                if(battalion.collisionWithEnemy(bulletSphere, damage)){
                    //supprimer battalion groupe et liste SI plus d'ennemies dedans !!
                    if(battalion.enemiesDied()){
                        console.log(battalion)
                        this.deleteBattalion(battalion, index);
                    } else {
                        //mettre à jour le groupe d'armée
                        console.log(this.#armyGroup.children)
                        console.log(this.#armyGroup.children)

                    }
                    return true;
                }
            }
        }
        return false;
    }

    deleteBattalion(battalion, index){
        console.log(battalion)
        this.#armyGroup.remove(battalion.getGroup());
        this.#battalions.splice(index, 1);
    }

    enemiesDied(){
        // console.log(this.#battalions.length)
        return this.#battalions.length == 0;
    }

}

export { Army }