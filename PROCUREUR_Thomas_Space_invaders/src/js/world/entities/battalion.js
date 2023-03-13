import * as THREE from 'three';
import { Enemy } from './enemy'
import { config } from './config'

const collisionBox = new THREE.Box3();

class Battalion {
    #scene
    #models
    #battalionConfig
    
    #battalionGroup = new THREE.Group()
    #enemies = []

    constructor(scene, models, battalionConfig){
        this.#scene = scene;
        this.#models = models;
        this.#battalionConfig = battalionConfig;
        console.log(this.#battalionConfig)
        this.buildBattalion();
    }

    buildBattalion(){
        const nbBattalion = this.#battalionConfig.nbBattalions; 
        const nbEnemies = this.#battalionConfig.nbEnemies;
        const enemyType = this.#battalionConfig.enemiesType;
        const enemyPosition = new THREE.Vector3();
        for (let i = 0; i < nbEnemies; i++){
            const enemyDatas = this.#models.getEnemy(enemyType);
            const newEnemy = new Enemy(this.#scene, enemyDatas, enemyType);

            const enemiesSpacingWidth = (config.world.size.width - nbEnemies * enemyDatas.size.x) / (nbEnemies + 1);
            const enemiesSpacingDepth = (config.world.size.depth / 2 - nbBattalion * enemyDatas.size.z) / (nbBattalion + 1)
            const enemyPosX = enemyDatas.size.x / 2 + enemiesSpacingWidth + i * (enemiesSpacingWidth + enemyDatas.size.x) - config.world.size.width / 2;
            const enemyPosZ = enemyDatas.size.z / 2 + this.#battalionConfig.index * enemiesSpacingDepth + config.world.size.depth / 2;
            enemyPosition.set(enemyPosX, 0, enemyPosZ);
            newEnemy.setPosition(enemyPosition);

            this.#enemies.push(newEnemy);
            this.#battalionGroup.add(newEnemy.getModel());
        }
    }

    tick(delta){
        this.#enemies.forEach(enemy => {
            enemy.tick(delta);
        });
    }

    collisionWithEnemy(bulletSphere, damage){
        collisionBox.setFromObject(this.#battalionGroup);
        // const collisionBoxHelper = new THREE.Box3Helper(collisionBox, 0xffff00);
        // this.#scene.add(collisionBoxHelper);
        if(collisionBox.intersectsSphere(bulletSphere)){
            console.log("bataillon touché ");
            for (let index = 0; index < this.#enemies.length; index++) {
                const enemy = this.#enemies[index];
                // console.log("\t+++ Ennemie", index, "+++");
                if(enemy.collisionWithEnemy(bulletSphere, damage)){
                    //supprimer l'ennemi du bataillon : groupe et liste !!
                    if(enemy.getHealth() <= 0){
                        this.deleteEnemy(enemy, index)
                    }
                    return true;
                }
            }
        }
        return false;
    }

    enemiesDied(){
        return this.#enemies.length == 0;
    }

    getEnemies(){
        return this.#enemies;
    }

    getGroup(){
        return this.#battalionGroup;
    }

    deleteEnemy(enemy, index){
        this.#battalionGroup.remove(enemy.getModel());
        this.#enemies.splice(index, 1);
        this.#scene.remove(enemy.getModel());
    }
}

export { Battalion }