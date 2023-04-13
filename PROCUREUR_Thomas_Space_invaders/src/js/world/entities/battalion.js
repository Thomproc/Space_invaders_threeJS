import * as THREE from 'three'
import { Enemy } from './enemy'
import { config } from './config'

const battalionBox = new THREE.Box3();

class Battalion {
    #scene
    #models
    #sounds
    #IHM
    #battalionTypes
    #callBack_upgradeArmy
    
    #battalionGroup = new THREE.Group()
    #enemies = []


    constructor(scene, models, sounds, IHM, battalionTypes, callBack_upgradeArmy){
        this.#scene = scene;
        this.#models = models;
        this.#sounds = sounds;
        this.#IHM = IHM;
        this.#battalionTypes = battalionTypes;
        this.#callBack_upgradeArmy = callBack_upgradeArmy;

        this.buildBattalion();
    }

    buildBattalion(){
        const nbEnemies = this.#battalionTypes.length;
        const enemyWidthSize = this.#models.getEnemySize();
        const enemiesWidthSize = enemyWidthSize * nbEnemies; // Somme des largeurs des ennemis pour déterminer ensuite leur espacement
        
        // Calcule de l'espacement en largeur entre les ennemis
        const spaceAvailable = config.world.size.width / 1.5;
        const enemiesSpacingWidth = (spaceAvailable - enemiesWidthSize) / (nbEnemies + 1);

        const enemyPosition = new THREE.Vector3();
        
        // Création des ennemies et calcule de la largeur qu'ils prennent en étant collés
        for (let i = 0; i < nbEnemies; i++) {
            const enemyType = this.#battalionTypes[i];
            if(enemyType == null){
                continue;
            }
            const enemyDatas = this.#models.getEnemy(enemyType);
            const newEnemy = new Enemy(this.#scene, this.#sounds, this.#IHM, enemyDatas, enemyType);
            
            // On calcule la position de l'ennemi
            const enemyPosX = enemyWidthSize / 2 + enemiesSpacingWidth + i * (enemiesSpacingWidth + enemyWidthSize) - spaceAvailable / 2;
            enemyPosition.set(enemyPosX, 0, 0);
            newEnemy.setPosition(enemyPosition);
            
            this.#enemies.push(newEnemy);
            this.#battalionGroup.add(newEnemy.getModel());
        }
    }

    addPointsToEnemies(){
        this.#enemies.forEach(enemy => {
            enemy.addPoint();
        });
    }

    tick(delta){
        for (let index = 0; index < this.#enemies.length; index++) {
            const enemy = this.#enemies[index];
            enemy.tick(delta);
            if(enemy.isDead()){
                this.#enemies.splice(index, 1);
                this.#callBack_upgradeArmy();
            }
        }
    }

    collisionWithEnemy(hitContainer, damage){
        battalionBox.setFromObject(this.#battalionGroup);
        if(hitContainer instanceof THREE.Box3 && battalionBox.intersectsBox(hitContainer) || hitContainer instanceof THREE.Sphere && battalionBox.intersectsSphere(hitContainer)){
            for (let index = 0; index < this.#enemies.length; index++) {
                const enemy = this.#enemies[index];
                if(!enemy.isDying() && enemy.collisionWithEnemy(hitContainer, damage)){
                    return true;
                }
            }
        }
        return false;
    }

    // Un bataillon est en train de mourir si tous les enemis qui le composent sont en train de mourir
    isDying(){
        for (let index = 0; index < this.#enemies.length; index++) {
            const enemy = this.#enemies[index];
            if(!enemy.isDying()){
                return false;
            }
        }
        return true;
    }

    isDead(){
        return this.#enemies.length == 0;
    }

////Getters et setters
    getSize(){
        const groupSize = new THREE.Vector3();
        battalionBox.setFromObject(this.#battalionGroup);
        battalionBox.getSize(groupSize);
        return groupSize;
    }

    getEnemies(){
        return this.#enemies;
    }

    getGroup(){
        return this.#battalionGroup;
    }

    getPosition(){
        return this.#battalionGroup.position;
    }

    setPosition(newPosition){
        this.#battalionGroup.position.copy(newPosition);
        return;
    }
}

export { Battalion }