// import { Vector3 } from "three";
import * as THREE from "three";
import { config } from "../entities/config";
import { Ship } from "../entities/ship";
import { Environment } from "../entities/environment";
import { Army } from "../entities/army";
import { Shield } from "../entities/shield";

//Permet de gérer les entités présentes dans le jeu. 
//Il fait le lien entre les composants sytèmes et les entités voire même entre différentes entités

class EntitiesManager {
    #scene
    #models
    #sounds
    #events
    #loop
    #camerasManager
    #IHM

    #gameIsOn

    #callback_startGame

    #environment
    #ship
    #shields = []
    #army

    constructor(scene, models, sounds, IHM, events, loop, camerasManager, callback_startGame){
        this.#scene = scene;
        this.#models = models;
        this.#sounds = sounds;
        this.#IHM = IHM;
        this.#events = events;
        this.#loop = loop;
        this.#camerasManager = camerasManager;
        this.#callback_startGame = callback_startGame;
        
        this.#loop.addUpdatable(this);
    }

    gameStart(){
        this.#ship.resetHealth();
    }

    gameWin(){
        this.deleteShields();
        this.#ship.deleteBullets();
        this.#ship.setIsShooting(false);
        config.score > config.highScore ? config.highScore = config.score : null;
        this.#sounds.ambienceMusic(false);
        this.#IHM.showVictory();

        this.#environment.switchToVictory()
    }
    
    gameOver(){
        this.deleteShields();
        this.#army.delete(false);
        this.#ship.deleteBullets();
        this.#ship.setIsShooting(false);
        config.score > config.highScore ? config.highScore = config.score : null;
        this.#IHM.showGameOver();
        this.#sounds.gameOverSound();
        this.#sounds.ambienceMusic(false);
    }

//// Création des entités
    createEnvironment(){
        this.#environment = new Environment(this.#scene, this.#loop, this.#models);
    }

    createShip() {
        const shipDatas = this.#models.getShip();
        const shipOffsetCamera = new THREE.Vector3(0, 2.5, -20);
        const shipTargetCamera = new THREE.Vector3(0, 0, config.world.size.depth / 2);
        const shipCamera = this.#camerasManager.createCamera(shipOffsetCamera, shipTargetCamera);
        const shipCameraIndex = this.#camerasManager.addCamera(shipCamera);
        const shipCameraDatas = {
                                    "camera": shipCamera, 
                                    "index": shipCameraIndex,
                                    "offset" : shipOffsetCamera,
                                    "updateCameraPosition": (indexCamera, position) => this.#camerasManager.updateCameraPosition(indexCamera, position)
                                };
        const collisionDetection = (bullet) => this.collision_ShipBullet(bullet);

        this.#ship = new Ship(this.#scene, this.#sounds, this.#IHM, this.#loop, shipDatas, shipCameraDatas, collisionDetection, "ship");
        this.addShipControls(this.#ship, "ArrowLeft", "ArrowRight", "ArrowUp");
    }

    createShields(){
        const nbShields = config.shield.number;
        const shieldsSpacingWidth = (config.world.size.width - nbShields * config.shield.radius) / (nbShields + 1);

        // Si on n'a créé aucune protection => on les construit
        if(this.#shields.length == 0){
            const shieldPosition = new THREE.Vector3();
            for (let i = 0; i < nbShields; i++) {
                const shieldsDatas = this.#models.getShields();
                const newShield = new Shield(this.#scene, this.#loop, shieldsDatas);
                const shieldPositionX = config.shield.radius / 2 + shieldsSpacingWidth + i * (shieldsSpacingWidth + config.shield.radius) - config.world.size.width / 2;
                shieldPosition.set(shieldPositionX, 0, 10);
                newShield.setPosition(shieldPosition);
                this.#shields.push(newShield);
            }
        }
        // Sinon on met à jour la vie et la visibilité des protections
        else {
            for (let i = 0; i < this.#shields.length; i++) {
                const shield = this.#shields[i];
                shield.reset();
            }
        }
    }

    deleteShields(){
        this.#shields.forEach(shield => {
            shield.destroy();
        });
    }

    createArmy(level){
        this.#gameIsOn = level != 0;
        if(this.#army == null){
            const collisionDetection = (bullet) => this.collision_EnemyBullet(bullet);
            this.#army = new Army(this.#scene, this.#models, this.#sounds, this.#IHM, collisionDetection);
        }
        this.#army.delete();
        this.#army.buildLevel(level);
        if(this.#gameIsOn){
            this.#ship.deleteBullets();
        }
        else {
            this.#environment.switchToGame();
        }
    }

//// Ajouter les commandes qui vont manipuler un vaisseau
    addShipControls(ship, keyLeft, keyRight, keyShoot){
        this.#events.addEvent(
            "keydown",
            e => {
                if (this.#loop.isPaused()) return;
                switch (e.key) {
                    case keyLeft:
                        ship.moveLeft(true);
                        break;
                    case keyRight:
                        ship.moveRight(true);
                        break;
                    case keyShoot:
                        ship.setIsShooting(true);
                        break;
                    case 'u':
                        ship.upgrade();
                        break;
                    case 'd':
                        ship.downgrade();
                        break;
                    case 'i':
                        ship.switchInvicibleMode();
                        this.#ship.isInvicible() ? this.#IHM.showPopup("Mode invincible activé")
                                                 : this.#IHM.showPopup("Mode invincible désactivé");
                        break;
                    case 'k':
                        if(this.#gameIsOn) this.#army.delete(true);
                    default:
                        break;
                }
            }
        );
        this.#events.addEvent(
            "keyup",
            e => {
                switch (e.key) {
                    case keyLeft:
                        ship.moveLeft(false);
                        break;
                    case keyRight:
                        ship.moveRight(false);
                        break;
                    case keyShoot:
                        ship.setIsShooting(false);
                        break;
                    default:
                        break;
                }
            }
        );
    }

//// Détecteurs de collision
    collision_ShipBullet(bullet){
        const bulletBox = bullet.getBox();

        if(this.hitShield(bulletBox)){
            this.#sounds.shipShotSound(false);
            return true;
        }
        // Collision avec un ennemi
        if(this.#army.collisionWithEnemy(bulletBox, bullet.getDamage())){
            if(!this.#gameIsOn){
                this.#loop.pause();
                this.#army.delete(false);
                this.#ship.resetUpgrade();
                this.#callback_startGame();
            }
            return true;
        }
        return false;
    }

    collision_EnemyBullet(bullet){
        const bulletBox = bullet.getBox();

        if(this.hitShield(bulletBox)){
            this.#sounds.enemyShotSound(false);
            return true;
        }
        
        // Collision avec le vaisseau 
        if(this.#ship.getBox().intersectsBox(bullet.getBox())){
            this.#ship.hit(bullet.getDamage());
            return true;
        }
    }

    collision_ShieldAndEnemy(){
        for (let index = 0; index < this.#shields.length; index++){
            const shield = this.#shields[index];
            if (shield.isDead()){
                continue;
            }
            const shieldSphere = shield.getSphere();
            if(this.#army.collisionWithEnemy(shieldSphere, "all")){
                this.#sounds.metalSound();
                shield.destroy();
            }
        }
    }

    hitShield(bulletBox){
        for (let index = 0; index < this.#shields.length; index++){
            const shield = this.#shields[index];
            if (shield.isDead()){
                continue;
            }
            const shieldSphere = shield.getSphere();
            if (bulletBox.intersectsSphere(shieldSphere)){
                shield.hit();
                this.#sounds.metalSound();
                return true;
            }
        }
        return false;
    }

    
    tick(delta){
        this.#ship.tick(delta);
        if(this.#ship.isOnAnimation()){
            delta /= this.#ship.getSlowFactor();
        }
    
        this.#army.tick(delta);

        this.#shields.forEach(shield => {
            shield.tick(delta);
            this.collision_ShieldAndEnemy();
        });
    }

    setArmyShot(){
        this.#army.setIsShooting(true);
    }

//// Méthodes pour connaitre l'état des entités
    shipDied(){
        if(this.#ship.getHealth() <= 0 || this.#army.tooCloseToShip(this.#ship.getBox())){
            this.gameOver();
            return true;
        }
        return false;
    }

    enemiesDied(){
        return this.#army.enemiesDied();
    }
}

export { EntitiesManager }