import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { config } from './config';

const pi = Math.PI;

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
    "reversedAnimation": null
  }

  #planet = {
      "model": null,
      "size": null,
      "mixer": null
  }
  
  // 1 bouclier selon les dégats qu'il a subi
  #shields = {
    0: {
      "model": null,
      "size": null
    },
    1: {
      "model": null,
      "size": null
    },
    2: {
      "model": null,
      "size": null
    }
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
    },
    "roller": {
      "datasGLTF": null,
      "model": null,
      "mixer": null,
      "size": null
    }
  }

  #enemyWidth = 2 // Tous les enemis font la même taille en largeur -> utile pour les re-scale

//// Chargement et paramétrage de tous les modèles
  async loadModels(){
    await this.loadShip();
    await this.loadPlanets();
    await this.loadShields();
    await this.loadEnemies();
  }

  // Charge le modèle 3D du vaisseau et on décompose l'animation associée
  async loadShip() {
    // Paramétrage du modèle 3D
    const shipDatas = await this.#loader.loadAsync('src/js/assets/models/star_sparrow_modular_spaceship/scene.gltf');
    this.#ship.model = shipDatas.scene;
    this.scaleModel(this.#ship.model, 6);
    this.#ship.size = this.getSize(this.#ship.model);

    // Paramétrage de l'animation
    const animationSpeed = 2; //On souhaite que l'animation soit 2 fois plus rapide
    this.#ship.mixer = new THREE.AnimationMixer(this.#ship.model);
    const durations = { // Durée de l'animation en ms pour évoluer/uprgade (resp. rétrograder/downgrade) au niveau "key"
      "upgrade": {
        2: 2550/animationSpeed,
        3: 2400/animationSpeed
      },
      "downgrade": {
        2: 2550/animationSpeed,
        1: 2400/animationSpeed
      }
    }
    this.#ship.durations = durations;

    const timeCodes = {
      1: 10/animationSpeed,
      2: 7.5/animationSpeed,
      3: 5/animationSpeed
    }
    this.#ship.timeCodes = timeCodes;

    const fullClip = shipDatas.animations[0];
    this.#ship.animation = this.#ship.mixer.clipAction(fullClip);
    this.#ship.animation.clampWhenFinished = true;
    
    this.#ship.animation.play();
    this.#ship.animation.timeScale = animationSpeed;
    this.#ship.mixer.setTime(timeCodes[1]); // Permet d'obtenir le i ème vaisseau de l'animation dès le lancement du jeu
    this.#ship.animation.paused = true;
    return;
  }

  async loadPlanets() {
    const planetDatas = await this.#loader.loadAsync("src/js/assets/models/jupiter.glb");
    this.#planet.model = planetDatas.scene;
    this.scaleModel(this.#planet.model, 40);
    this.#planet.size = this.getSize(this.#planet.model);

    const mixer = new THREE.AnimationMixer(this.#planet.model);
    const fullClip = planetDatas.animations[0];
    const animation = mixer.clipAction(fullClip);
    animation.play();
    
    this.#planet.mixer = mixer;

  }

  async loadShields(){
    for (const i of Object.keys(this.#shields)) {
      const shieldDatas = await this.#loader.loadAsync("src/js/assets/models/shieldHit" + i.toString() + ".glb");
      this.#shields[i].model = shieldDatas.scene;
      this.scaleModel(this.#shields[i].model, config.shield.radius);
      this.#shields[i].size = this.getSize(this.#shields[i].model);
    }
  }

  // Charge et re-taille les modèle 3D des ennemies
  async loadEnemies() {
    for (const enemyType of Object.keys(this.#enemies)) {
      const modelPath = "src/js/assets/models/" + enemyType + "_guardian.glb";
      const modelDatas = await this.#loader.loadAsync(modelPath);
      this.#enemies[enemyType].datasGLTF = modelDatas;
      this.#enemies[enemyType].model = this.#enemies[enemyType].datasGLTF.scene;
      this.#enemies[enemyType].model.rotation.y = pi;
      this.scaleModel(this.#enemies[enemyType].model, this.#enemyWidth);
      this.#enemies[enemyType].size = this.getSize(this.#enemies[enemyType].model);
    }
  }

  scaleModel(model, sizeMax){
    const modelSize = this.getSize(model);

    const ratioZ = modelSize.z / modelSize.x;
    const ratioY = modelSize.y / modelSize.x;

    model.scale.set(1 / modelSize.x * sizeMax, 1 / modelSize.y *  ratioY * sizeMax, 1 / modelSize.z * ratioZ * sizeMax);
    return;
  }

//// Getters
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

  getPlanets(){
    return this.#planet;
  }

  getShields(){
    const clonedShields = {};
    for (const i of Object.keys(this.#shields)) {
      const shield = this.#shields[i];
      const clonedModel = shield.model.clone();
      const clonedShield = {...shield, model: clonedModel};
      clonedShields[i] = clonedShield;
    }
    return clonedShields;
  }

  //Les modèles et animation liés à chaque type d'ennemi doivent être clonés afin qu'ils soient tous indépendants 
  getEnemy(type){
    const enemy = this.#enemies[type];
    const clonedModel = enemy.model.clone();
    const clonedMixer = new THREE.AnimationMixer(clonedModel);
    const clonedClip = enemy.datasGLTF.animations[enemy.datasGLTF.animations.length - 1].clone();
    const clonedAnimation = clonedMixer.clipAction(clonedClip);
    clonedAnimation.play();
    clonedMixer.setTime(Math.random() * clonedClip.duration);
    const clonedEnemy = {...enemy, model: clonedModel, mixer: clonedMixer};
    return clonedEnemy;
  }

  getRandomEnemy(){
    const enemiesTypes =  Object.keys(this.#enemies);
    const randomType = parseInt(Math.random() * enemiesTypes.length );
    const enemyType = enemiesTypes[randomType];
    const enemy = this.getEnemy(enemyType);
    return enemy;
  }

  getEnemySize(){
    return this.#enemyWidth;
  }
}

export { Models }