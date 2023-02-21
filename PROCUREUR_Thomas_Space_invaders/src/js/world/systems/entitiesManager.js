import { Vector3 } from "three";
import { Ship } from "../entities/ship";

//Permet de gérer les entités présentes dans le jeu. 
//Il fait le lien entre les composants sytèmes et les entités

class EntitiesManager {
    #scene
    #models
    #events
    #loop
    #cameraManager

    #ship

    constructor(scene, models, events, loop, cameraManager){
        this.#scene = scene;
        this.#models = models;
        this.#events = events;
        this.#loop = loop;
        this.#cameraManager = cameraManager;
    }

    createShip() {
        const shipDatas = this.#models.getShip();
        const shipOffsetCamera = new Vector3(0, 2, -12);
        const shipCamera = this.#cameraManager.createCamera(shipOffsetCamera, new Vector3(0, 0, 100));
        const shipCameraIndex = this.#cameraManager.addCamera(shipCamera);
        const shipCameraDatas = {
                                    "camera": shipCamera, 
                                    "index": shipCameraIndex,
                                    "offset" : shipOffsetCamera,
                                    "updateCameraPosition": (indexCamera, position) => this.#cameraManager.updateCameraPosition(indexCamera, position)
                                };
        this.#ship = new Ship(this.#scene, this.#loop, shipDatas, shipCameraDatas, "ship");
        this.addShipControls(this.#ship, "ArrowLeft", "ArrowRight", "ArrowUp");
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
}

export { EntitiesManager }