import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { config } from './config';

const PI = Math.PI;

// Cette classe sert de conteneur pour tous les modèles utiles au jeu ainsi que de leur méthodes associées.
class Models {
  #loader = new GLTFLoader();
  #environment = {
    "model": null,
    "size": null
  }
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
  //Contient les données nécessaires aux ennemis selon leur type
  #enemies = {
    "observer": {
      "datasGLTF": null,
      "model": null,
      "mixer": null,
      "size": null
    },
    "kamikaze": {
      "datasGLTF": null,
      "model": null,
      "mixer": null,
      "size": null
    }
  }

  async loadModels(){
    await this.loadEnvironment();
    await this.loadShip();
    await this.loadEnemies();
  }

  async loadEnvironment(){
    // Paramétrage du modèle 3D
    const envDatas = await this.#loader.loadAsync('src/assets/models/milkyway/scene.gltf');
    this.#environment.model = envDatas.scene;
    this.scaleModel(this.#environment.model, config.world.size.depth);
    this.#environment.size = this.getSize(this.#environment.model);
  }

  // Charge le modèle 3D du vaisseau et son animation associée
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

  // Charge les modèle 3D des ennemies
  async loadEnemies() {
    // Paramétrage du modèle 3D "observer"
    // const observerDatas = await this.#loader.loadAsync('src/assets/models/observer_guardian/scene.gltf');
    // this.#enemies.observer.datasGLTF = observerDatas;
    // this.#enemies.observer.model = observerDatas.scene;
    // this.scaleModel(this.#enemies.observer.model, 2);
    // this.#enemies.observer.model.rotation.y = PI;
    // this.#enemies.observer.size = this.getSize(this.#enemies.observer.model);

    // // Paramétrage du modèle 3D "kamikaze"
    // const kamikazeDatas = await this.#loader.loadAsync('src/assets/models/kamikaze_guardian/scene.gltf');
    // this.#enemies.kamikaze.datasGLTF = observerDatas;
    // this.#enemies.kamikaze.model = observerDatas.scene;
    // this.scaleModel(this.#enemies.observer.model, 2);
    // this.#enemies.observer.model.rotation.y = PI;
    // this.#enemies.observer.size = this.getSize(this.#enemies.observer.model);
    
    for (const enemyType of Object.keys(this.#enemies)) {
      const modelPath = "src/assets/models/" + enemyType + "_guardian/scene.gltf";
      const modelDatas = await this.#loader.loadAsync(modelPath);

      this.#enemies[enemyType].datasGLTF = modelDatas;
      this.#enemies[enemyType].model = this.#enemies[enemyType].datasGLTF.scene;
      this.#enemies[enemyType].model.rotation.y = PI;
      this.scaleModel(this.#enemies[enemyType].model, 2);
      this.#enemies[enemyType].size = this.getSize(this.#enemies[enemyType].model);
    }
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

  getEnvironment(){
    return this.#environment;
  }

  getShip(){
    return this.#ship;
  }
  
  //Les modèles et animation liés à chaque type d'ennemi doivent être clonés afin qu'ils soient tous indépendants 
  getEnemy(type){
    const enemy = this.#enemies[type];
    const clonedModel = enemy.model.clone();
    const clonedMixer = new THREE.AnimationMixer(clonedModel);
    const clonedClip = enemy.datasGLTF.animations[0].clone();
    const clonedAnimation = clonedMixer.clipAction(clonedClip);
    clonedAnimation.play();
    
    const clonedEnemy = {...enemy, model: clonedModel, mixer: clonedMixer};
    return clonedEnemy;
  }
}

export { Models }