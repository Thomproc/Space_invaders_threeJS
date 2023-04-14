import { Clock } from 'three';

class Loop {

  #cameraManager
  #scene
  #renderer
  #composer
  #paused
  #updatables
  #clock

  #glitchWild = false

  constructor(cameraManager, scene, renderer, composer) {
    this.#cameraManager = cameraManager;
    this.#scene = scene;
    this.#renderer = renderer;
    this.#composer = composer;
    this.#updatables = [];
    this.#paused = true;
    this.#clock = new Clock();
  }

  start() {
    this.#renderer.setAnimationLoop(() => {
      // tell every animated object to tick forward one frame
      this.tick();

      // render a frame
      if(this.#glitchWild){
        this.#composer.render(true);
      }
      else {
        this.#renderer.render(this.#scene, this.#cameraManager.getCurrentCamera());
      }

    });
  }

  stop() {
    this.#renderer.setAnimationLoop(null);
  }

  pause() {
    this.#paused = true;
  }

  isPaused(){
    return this.#paused;
  }
  
  resume() {
    this.#paused = false;
    this.#clock.getDelta();
  }
  
  pauseResume() {
    console.log(this.#updatables);
    this.#paused ? this.resume() : this.pause();
  }
  
  addUpdatable(...objects3d) {
    this.#updatables.push(...objects3d);
    this.#updatables = [...new Set(this.#updatables)]; // remove duplicate objects
  }

  tick() {
    if (this.#paused) return;
    
    // only call the getDelta function once per frame!
    const delta = this.#clock.getDelta(); 

    
    this.#updatables.forEach((object) => {
      object.tick(delta);
    });
  }

  displayGlitchEffect(){
    this.#glitchWild = true;
    setTimeout(() => {
      this.#glitchWild = false;
    }, 500);
  }
}

export { Loop };
