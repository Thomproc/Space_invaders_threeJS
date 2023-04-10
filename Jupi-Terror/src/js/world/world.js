import * as THREE from 'three';

//Composants du jeu
import { CamerasManager } from './components/camerasManager.js';
import { createScene } from './components/scene.js';
import { createLights } from './components/lights.js';

//Composants systèmes
import { createRenderer } from './systems/renderer.js';
import { Loop } from './systems/loop.js';
import { Resizer } from './systems/resizer';
import { createControls } from './systems/controls.js';
import { EntitiesManager } from './systems/entitiesManager.js';
import { LevelsManager } from './systems/levelsManager.js';
import { Models } from './entities/models.js';
import { Events } from './systems/events.js';
import { SoundManager } from './systems/soundManager.js';
import { Interface } from './systems/interface.js';

class World {

  #renderer
  #loop
  #resizer
  #events
  #scene
  #controls

  #camerasManager
  #soundManager
  #entitiesManager
  #levelsManager
  #models
  #IHM

  #gameIsOn

  constructor(container) {
    this.#scene = createScene();
    createLights(this.#scene);

    this.#renderer = createRenderer();
    container.append(this.#renderer.domElement);

    this.#events = new Events(container); // Permet d'ajouter des évènements sur le container
    this.#camerasManager = new CamerasManager();
    this.#soundManager = new SoundManager();
    this.#resizer = new Resizer(container, this.#events, this.#scene, this.#camerasManager, this.#renderer);
    this.#loop = new Loop(this.#camerasManager, this.#scene, this.#renderer);
    
    this.#models = new Models(); // Gère les modèles 3D à importer
    this.#IHM = new Interface();

    const callback_menu = () => this.menu();
    const callback_startGame = () => this.startGame();
    this.#entitiesManager = new EntitiesManager(this.#scene, this.#models, this.#soundManager, this.#IHM, this.#events, this.#loop, this.#camerasManager, callback_menu, callback_startGame); // Gère les entités du jeu
    this.#levelsManager = new LevelsManager(this.#scene, this.#loop, this.#entitiesManager);

    this.#events.addEvent(
      "keypress", 
      e => {
          if(this.#gameIsOn && (e.key === "0" || e.key === "1")) {
              this.#camerasManager.switchCamera(parseInt(e.key));
              this.#resizer.resize();
          }
          else if(e.key === "g"){
            this.startGame();
          }
      }
    );
    // createControls(this.#camerasManager.getCurrentCamera(), container);
    //ADD HELPERS
    // let size = 2 * 100;
    // let divisions = 10;
    // this.#scene.add(new THREE.GridHelper(size, divisions));
    // this.#scene.add(new THREE.AxesHelper(10));
  }

  async init() {
    await this.#models.loadModels();
    this.#entitiesManager.createEnvironment();
    this.#entitiesManager.createShip();
    this.#loop.start();
  }

  menu() {
    this.#gameIsOn = false;
    this.#IHM.showMenuInterface();
    this.#entitiesManager.createArmy(0);
    this.#camerasManager.switchCamera(0);
    this.#resizer.resize();
  }

  startGame(){
    this.#gameIsOn = true;
    this.#IHM.showGameInterface();
    this.#levelsManager.gameStart();
  }

  stop() {
    this.#loop.stop();
  }

  pause() {
    this.#loop.pause();
  }

  resume() {
    this.#loop.resume();
  }

  pauseResume() {
    this.#loop.pauseResume();
  }

}

export { World };
