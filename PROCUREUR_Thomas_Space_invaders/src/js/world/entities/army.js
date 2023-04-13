import * as THREE from 'three';
import { Battalion } from './battalion'
import { Bullet } from '../entities/bullet'
import { config } from './config'

const armyBox = new THREE.Box3()
class Army {
    #scene
    #models
    #sounds
    #IHM
    #collisionDetection
    #gameIsOn

    #armyGroup = new THREE.Group()
    #battalions = []

    #spaceAvailable = config.world.size.depth / 3;

    // Propriétés de déplacement
    #depthSpeed
    #widthSpeed
    #widthDirection = 1

    // Propriétés d'attaque
    #shotSpeedFactor = 1
    #minNextShot
    #maxNextShot
    #nextShot // Un ennemi au hasard tire dans ... ms
    #animationFrameID
    #lastShotTime

    #bullets = []

    constructor(scene, models, sounds, IHM, collisionDetection){
        this.#scene = scene;
        this.#models = models;
        this.#sounds = sounds;
        this.#IHM = IHM;
        this.#collisionDetection = collisionDetection;
    }

    buildLevel(level){
        this.#gameIsOn = level != 0;
        if(level > 1){
            this.#widthSpeed = config.army.speed.width * config.army.speed.level_widthFactor * level / 2;
            this.#depthSpeed = config.army.speed.depth * config.army.speed.level_depthFactor * level / 2;
            this.#minNextShot = config.army.shot.nextShotInterval.min / (level / 2 * config.army.shot.level_shotFreqFactor);
            this.#maxNextShot = config.army.shot.nextShotInterval.max / (level / 2 * config.army.shot.level_shotFreqFactor);
            this.#shotSpeedFactor = config.army.shot.level_shotFreqFactor * level / 2;
        } else if(level == 1){
            this.#widthSpeed = config.army.speed.width;
            this.#depthSpeed = config.army.speed.depth;
            this.#minNextShot = config.army.shot.nextShotInterval.min;
            this.#maxNextShot = config.army.shot.nextShotInterval.max;
            this.#shotSpeedFactor = 1;
        }
        // Création des bataillons et calcule de la profondeur qu'ils prennent en étant collés
        let enemiesDepthSize = 0; // Somme de l'épaisseur des bataillons pour déterminer ensuite leur espacement
        
        const callBack_upgradeArmy = () => this.upgrade();
        const armyStructure = config.levels[level].enemies.structure;
        const nbBattalions = armyStructure.length;
        for (let i = 0; i < nbBattalions; i++) {
            const battalionTypes = armyStructure[nbBattalions - i - 1];
            const battalion = new Battalion(this.#scene, this.#models, this.#sounds, this.#IHM, battalionTypes, callBack_upgradeArmy);
            enemiesDepthSize += battalion.getSize().z;
            
            this.#battalions.push(battalion);
            this.#armyGroup.add(battalion.getGroup());
        }
        
        this.placeBattalion(nbBattalions, enemiesDepthSize);


        if(this.#gameIsOn){
            this.#armyGroup.position.set(0, 0, 0);
        } 
        else {
            const battalion = this.#battalions[0];
            battalion.addPointsToEnemies();
            const battalionPosition = battalion.getPosition();
            this.#armyGroup.position.set(0, 0, -battalionPosition.z / 1.5);
        }
        this.#scene.add(this.#armyGroup);

    }

    // Positionne les ennemis sur la profondeur du terrain
    placeBattalion(nbBattalions, enemiesDepthSize){
        const battalionSpacingDepth = (this.#spaceAvailable - enemiesDepthSize) / (nbBattalions - 1);
        
        const battalionPosition = new THREE.Vector3();
        let previousEnemyPositionZ = 0;
        for (let i = 0; i < nbBattalions; i++){
            const battalion = this.#battalions[i];
            const battalionDepthSize = battalion.getSize().z;
            const battalionPosZ = battalionDepthSize / 2 + previousEnemyPositionZ;
            
            battalionPosition.set(0 , 0, battalionPosZ + config.world.size.depth - this.#spaceAvailable);
            battalion.setPosition(battalionPosition);

            previousEnemyPositionZ = battalionPosZ + battalionDepthSize / 2 + battalionSpacingDepth;
        }
    }

    tick(delta){
        for (let index = 0; index < this.#battalions.length; index++) {
            const battalion = this.#battalions[index];
            battalion.tick(delta);
            if(battalion.isDead()){
                this.deleteBattalion(battalion, index);
            }
        }

        if(!this.#gameIsOn){
            return;
        }
        //Permet de faire avancer et osciller de gauche à droite mon armée
        //Impossible d'utiliser le groupe armyGroup car sa position ne correspond plus forcément au centre de l'armée une fois qu'une colonne (ou plus) d'ennemis est détruite
        this.#armyGroup.position.z -= this.#depthSpeed * delta;
        this.#armyGroup.position.x += this.#widthSpeed * this.#widthDirection * delta;
        armyBox.setFromObject(this.#armyGroup);
        // this.setArmyBoxWithEnemiesAlive();
        if(armyBox.max.x >= config.world.size.width / 2){
            this.#widthDirection = -1;
        } else if(armyBox.min.x < - config.world.size.width / 2){
            this.#widthDirection = 1;
        }

        //Mise à jour des balles
        this.#bullets.forEach((bullet, index) => {
            //Si une balle sort du monde ou si elle heurte le vaisseau / défenses
            if(bullet.outOfWorld()){
                this.deleteBullet(bullet, index);
            }
            else if(this.#collisionDetection(bullet)){
                this.deleteBullet(bullet, index);
            }
            else{
                bullet.tick(delta);
            }
        });
    }

    // Permet de rendre l'armée plus puissante en augmentant sa vitesse de déplacement, de ses tirs et sa cadence de tir
    upgrade(){
        const newWidthSpeed = this.#widthSpeed * config.army.speed.wave_widthFactor;
        newWidthSpeed > config.army.speed.maxWidth ? this.#widthSpeed = config.army.speed.maxWidth
                                                   : this.#widthSpeed = newWidthSpeed;

        const newDepthSpeed = this.#depthSpeed* config.army.speed.wave_widthFactor;
        newDepthSpeed > config.army.speed.maxWidth ? this.#depthSpeed = config.army.speed.maxDepth
                                                   : this.#depthSpeed = newDepthSpeed;

        const newMinNextShot = this.#minNextShot / config.army.shot.wave_shotFreqFactor;
        newMinNextShot < config.army.shot.minShot ? this.#minNextShot = config.army.shot.minShot
                                                   : this.#minNextShot = newMinNextShot;
        const newMaxNextShot = this.#maxNextShot / config.army.shot.wave_shotFreqFactor;
        newMaxNextShot < config.army.shot.minShot ? this.#maxNextShot = config.army.shot.minShot
                                                    : this.#maxNextShot = newMaxNextShot;

        const newShotSpeedFactor = this.#shotSpeedFactor * config.army.shot.wave_speedShotFactor;
        newShotSpeedFactor > config.army.shot.maxShotSpeedFactor ? this.#shotSpeedFactor = config.army.shot.maxShotSpeedFactor
                                                     : this.#shotSpeedFactor = newShotSpeedFactor;
        }

    collisionWithEnemy(hitContainer, damage){
        armyBox.setFromObject(this.#armyGroup);
        if(hitContainer instanceof THREE.Box3 && armyBox.intersectsBox(hitContainer) || hitContainer instanceof THREE.Sphere && armyBox.intersectsSphere(hitContainer)){
            // Pour chaque battaillon dans mon armée, on regarde s'il y a une collision
            for (let index = 0; index < this.#battalions.length; index++) {
                const battalion = this.#battalions[index];
                if(battalion.collisionWithEnemy(hitContainer, damage)){
                    return true;
                }
            }
        }
        return false;
    }

//// Méthodes liées aux attaques des ennemis
    setIsShooting(val){
        //Si on tire et qu'on n'a pas encore définit une fonction à appeler selon la fréquence de tir
        if(val && !this.#animationFrameID){
            this.setNextShot();
            this.#lastShotTime = Date.now();
            this.#animationFrameID = requestAnimationFrame(() => this.shoot());
        }
        //Sinon si on arrete de tirer on supprime l'appel récurent à la fonction "shoot"
        else if(!val){
            cancelAnimationFrame(this.#animationFrameID);
            this.#animationFrameID = null;
        }
    }

    setNextShot(){
        this.#nextShot = Math.random() * (this.#maxNextShot - this.#minNextShot) + this.#minNextShot;
    }

    shoot(){
        const currentTime = Date.now();
        if (!this.enemiesDied()){
            if(currentTime - this.#lastShotTime >= this.#nextShot){
                // On choisit un bataillon vivant au hasard
                const battalionsAlive = this.#battalions.filter(function(battalion) {
                    return !battalion.isDying();
                });
                
                // S'il n'y a aucun ennemi vivent dans le bataillon, on ne peut pas tirer 
                if(battalionsAlive.length == 0) {
                    return;
                } 
                const indexBattalion = Math.floor(Math.random() * battalionsAlive.length);
                const battalion = battalionsAlive[indexBattalion];
                
                // On choisit un ennemi vivant au hasard
                const enemiesInBattalion = battalion.getEnemies().filter(function(enemy) {
                    return !enemy.isDying();
                });
                const indexEnemy = Math.floor(Math.random() * enemiesInBattalion.length);
                const enemyShooter = enemiesInBattalion[indexEnemy];

                // L'ennemi choisi tire
                this.createBullet(battalion, enemyShooter);
                this.#sounds.enemyShotSound(true);
                this.#lastShotTime = Date.now();
                this.setNextShot();
            }
            this.#animationFrameID = requestAnimationFrame(() => this.shoot());
        }
    }

    createBullet(battalion, enemy){
        const bulletPosition = new THREE.Vector3().copy(enemy.getPosition());
        bulletPosition.z = this.getPosition().z + battalion.getPosition().z - enemy.getSize().z / 2;
        bulletPosition.x = this.getPosition().x + enemy.getPosition().x;
        const bullet = new Bullet(this.#scene, "enemy", bulletPosition, config.enemies[enemy.getType()].bulletSpeed * this.#shotSpeedFactor, 1);
        this.#bullets.push(bullet);
    }

    deleteBullet(bullet, index){
        this.#bullets.splice(index, 1);
        this.#scene.remove(bullet.getMesh());
    }

//// 
    deleteBattalion(battalion, index){
        this.#armyGroup.remove(battalion.getGroup());
        this.#battalions.splice(index, 1);
    }

    tooCloseToShip(shipBox){
        const expandBoxVector = new THREE.Vector3(config.world.size.width, 0, 0);
        shipBox.expandByVector(expandBoxVector); //Permet de vérifier si l'armée est au même niveau que le vaisseau
        armyBox.setFromObject(this.#armyGroup);
        return armyBox.intersectsBox(shipBox);
    }

    enemiesDied(){
        if(this.#battalions.length == 0){
            this.setIsShooting(false);
            return true;
        }
        return false;
    }

//// Getters
    getSize(){
        const groupSize = new THREE.Vector3();
        armyBox.setFromObject(this.#armyGroup);
        armyBox.getSize(groupSize);
        return groupSize;
    }

    getGroup(){
        return this.#armyGroup;
    }

    getPosition(){
        return this.#armyGroup.position;
    }

//// Destructeur
    delete(addScore){
        while(this.#bullets.length > 0){
            this.deleteBullet(this.#bullets[0], 0);
        }

        while(this.#battalions.length > 0){
            const battalion = this.#battalions[0];
            const enemies = battalion.getEnemies();
            while(enemies.length > 0){
                if(addScore){
                    const point = enemies[0].getPoint();
                    config.score += point;
                    config.scoreCombo += point;
                    this.#IHM.updateGameScore();
                }
                enemies[0].delete();
                enemies.splice(0, 1);    
            }
            this.deleteBattalion(battalion, 0);
        }
        this.setIsShooting(false);

    }

}

export { Army }