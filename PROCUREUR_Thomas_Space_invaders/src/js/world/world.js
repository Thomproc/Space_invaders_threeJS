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

class World {

  #camerasManager
  #controls
  #renderer
  #scene
  #loop
  #resizer
  #models
  #events
  #entitiesManager
  #levelsManager

  constructor(container) {
    this.#scene = createScene();
    createLights(this.#scene);

    this.#renderer = createRenderer();
    container.append(this.#renderer.domElement);

    this.#events = new Events(container); // Permet d'ajouter des évènements sur le container
    this.#camerasManager = new CamerasManager();
    this.#resizer = new Resizer(container, this.#events, this.#scene, this.#camerasManager, this.#renderer);
    this.#loop = new Loop(this.#camerasManager, this.#scene, this.#renderer);
    
    this.#models = new Models(); // Gère les modèles 3D à importer
    this.#entitiesManager = new EntitiesManager(this.#scene, this.#models, this.#events, this.#loop, this.#camerasManager); // Gère les entités du jeu
    this.#levelsManager = new LevelsManager(this.#scene, this.#loop, this.#entitiesManager);

    this.#events.addEvent(
      "keypress", 
      e => {
          if(e.key === "c") {
              this.#camerasManager.switchCamera();
              this.#resizer.resize();
          }
      }
    );
    createControls(this.#camerasManager.getCurrentCamera(), container);
    //ADD HELPERS
    let size = 50;
    let divisions = 15;
    this.#scene.add(new THREE.GridHelper(size, divisions));
    this.#scene.add(new THREE.AxesHelper(10));
  }

  async init() {
    await this.#models.loadModels();
    this.#levelsManager.gameStart();
  }

  start() {
    this.#loop.start();
  }

  // stop() {
  //   this.#loop.stop();
  // }

  // pause() {
  //   this.#loop.pause();
  // }

  // resume() {
  //   this.#loop.resume();
  // }

  // pauseResume() {
  //   this.#loop.pauseResume();
  // }

  getScene() {
    return this.#scene;
  }

  // resize() {
  //   this.#resizer.resize();
  // }
  
  // toggleHelpers() {
  //   this.#camera.layers.toggle(this.#helpersLayer);
  // }
}

export { World };
