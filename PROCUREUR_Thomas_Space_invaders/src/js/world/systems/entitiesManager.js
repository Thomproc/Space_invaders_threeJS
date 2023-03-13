// import { Vector3 } from "three";
import * as THREE from "three";
import { Ship } from "../entities/ship";
import { Environment } from "../entities/environment";
import { Army } from "../entities/army";

//Permet de gérer les entités présentes dans le jeu. 
//Il fait le lien entre les composants sytèmes et les entités

class EntitiesManager {
    #scene
    #models
    #events
    #loop
    #camerasManager

    #environment
    #ship
    #army

    constructor(scene, models, events, loop, camerasManager){
        this.#scene = scene;
        this.#models = models;
        this.#events = events;
        this.#loop = loop;
        this.#camerasManager = camerasManager;

        this.#loop.addUpdatable(this);
    }

    createEnvironment(){
        const environmentDatas = this.#models.getEnvironment();
        this.#environment = new Environment(this.#scene, this.#loop, environmentDatas);
    }

    createShip() {
        const shipDatas = this.#models.getShip();
        const shipOffsetCamera = new THREE.Vector3(0, 2, -12);
        const shipTargetCamera = new THREE.Vector3(0, 0, 100);
        const shipCamera = this.#camerasManager.createCamera(shipOffsetCamera, shipTargetCamera);
        const shipCameraIndex = this.#camerasManager.addCamera(shipCamera);
        const shipCameraDatas = {
                                    "camera": shipCamera, 
                                    "index": shipCameraIndex,
                                    "offset" : shipOffsetCamera,
                                    "updateCameraPosition": (indexCamera, position) => this.#camerasManager.updateCameraPosition(indexCamera, position)
                                };
        const collisionDetection = (bullet) => this.collision(bullet);

        this.#ship = new Ship(this.#scene, shipDatas, shipCameraDatas, collisionDetection, "ship");
        this.addShipControls(this.#ship, "ArrowLeft", "ArrowRight", "ArrowUp");
    }

    createArmy(level){
        this.#army = new Army(this.#scene, this.#models);
        this.#army.buildLevel(level);
    }

    // Ajouter les commandes qui vont manipuler un vaisseau
    addShipControls(ship, keyLeft, keyRight, keyShoot){
        this.#events.addEvent(
            "keydown",
            e => {
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

    collision(bullet){
        const bulletMesh = bullet.getMesh();
        const sphere = new THREE.Sphere(bulletMesh.position, bulletMesh.geometry.parameters.radius);
        return this.#army.collisionWithEnemy(sphere, bullet.getDamage());
        // const enemies = this.#army.getEnemies();
        // return enemies.some((enemy, index) => {
        //     boxEnemy.setFromObject(enemy.getModel());
        //     if(boxEnemy.intersectsSphere(sphere)){
        //         enemy.hit(bullet.getDamage());
        //         console.log(enemy.getHealth())
        //         if(enemy.getHealth() <= 0){
        //             this.#army.deleteEnemy(index);
        //         }
        //         return true;
        //     }
        // });
    }

    tick(delta){
        this.#ship.tick(delta);
        this.#army.tick(delta);
    }

    enemiesDied(){
        return this.#army.enemiesDied();
    }

    shipDied(){
        return this.#ship.getHealth() == 0;
    }
}

export { EntitiesManager }