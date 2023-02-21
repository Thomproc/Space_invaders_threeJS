import { Clock } from 'three';

class Loop {

  #cameraManager
  #scene
  #renderer
  #paused
  #updatables
  #clock

  constructor(cameraManager, scene, renderer) {
    this.#cameraManager = cameraManager;
    this.#scene = scene;
    this.#renderer = renderer;
    this.#updatables = [];
    this.#paused = false;
    this.#clock = new Clock();
  }

  start() {
    this.#renderer.setAnimationLoop(() => {
      // tell every animated object to tick forward one frame
      this.tick();

      // render a frame
      this.#renderer.render(this.#scene, this.#cameraManager.getCurrentCamera());
    });
  }

  stop() {
    this.#renderer.setAnimationLoop(null);
  }

  pause() {
    this.#paused = true;
  }
  
  resume() {
    this.#paused = false;
    this.#clock.getDelta();
  }
  
  pauseResume() {
    this.#paused ? this.resume() : this.pause();
  }
  
  addUpdatable(...objects3d) {
    this.#updatables.push(...objects3d);
    this.#updatables = [...new Set(this.#updatables)]; // remove duplicate objects
  }
  
  removeUpdatable(index){
    this.#updatables.splice(index, 1);
  }

  tick() {
    if (this.#paused) return;
    
    // only call the getDelta function once per frame!
    const delta = this.#clock.getDelta(); 

    // console.log(
    //   `The last frame rendered in ${delta * 1000} milliseconds`,
    // );

    
    this.#updatables.forEach((object, index) => {
      object.tick(index);
    });
  }
}

export { Loop };
