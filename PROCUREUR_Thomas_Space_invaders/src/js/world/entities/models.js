import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Cette classe sert de conteneur pour tous les modèles utiles au jeu ainsi que de leur méthodes associées.
class Models {
  #loader = new GLTFLoader(); 
  #ship = {
    "model": null, 
    "size": null,
    "mixer" : null,
    "durations": null,
    "timeCodes": null,
    "animation": null,
    "animationSpeed" : 2,
    "reversedAnimation": null
  }
  #ennemies

  async loadModels(){
    await this.loadShip();
  }

  // Charge le modèle 3D et son animation associée
  async loadShip() { 
    // Paramétrage du modèle 3D
    const shipDatas = await this.#loader.loadAsync('src/assets/models/star_sparrow_modular_spaceship/scene.gltf');
    this.#ship.model = shipDatas.scene;
    this.scaleModel(this.#ship.model, 1);
    this.#ship.size = this.getSize(this.#ship.model);

    // Paramétrage de l'animation
    this.#ship.mixer = new THREE.AnimationMixer(this.#ship.model);
    const durations = { // Durée de l'animation en ms pour évoluer/uprgade (resp. rétrograder/downgrade) au niveau "key"
      "upgrade": {
        2: 2550,
        3: 2400
      },
      "downgrade": {
        2: 2550,
        1: 2400
      }
    }
    this.#ship.durations = durations;

    const timeCodes = {
      1: 10,
      2: 7.5,
      3: 5
    }
    this.#ship.timeCodes = timeCodes;

    const fullClip = shipDatas.animations[0];
    this.#ship.animation = this.#ship.mixer.clipAction(fullClip);
    this.#ship.animation.clampWhenFinished = true;
    
    this.#ship.animation.play();
    this.#ship.mixer.setTime(10); // Permet d'obtenir le 3ème vaisseau de l'animation dès le lancement du jeu
    this.#ship.animation.paused = true;
    
    return;
  }

  scaleModel(model, sizeMax){
    const modelSize = this.getSize(model);

    let ratioX = modelSize.x / modelSize.y;
    let ratioZ = modelSize.z / modelSize.y;

    model.scale.set(1 / modelSize.x * sizeMax * ratioX, 1 / modelSize.y * sizeMax, 1 / modelSize.z * ratioZ * sizeMax);

    return;
  }
  
  getSize(model){
    const box = new THREE.Box3();
    const modelSize = new THREE.Vector3();
    box.setFromObject(model);
    box.getSize(modelSize);
    return modelSize;
  }

  getShip(){
    return this.#ship;
  }
  
}

export { Models }