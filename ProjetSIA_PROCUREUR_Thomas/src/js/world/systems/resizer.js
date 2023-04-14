class Resizer {
  #container
  #events
  #scene
  #cameraManager
  #renderer

  constructor(container, events, scene, cameraManager, renderer) {
    this.#container = container;
    this.#events = events;
    this.#scene = scene;
    this.#cameraManager = cameraManager;
    this.#renderer = renderer;

    // set initial size
    this.resize();
    
    window.addEventListener('resize', () => {
      // set the size again if a resize occurs
      this.resize();
      // perform any custom actions
      this.#onResize();
    });
  }

  resize() {
      // launched with a delay letting the layout to resize
      const delay = 1; // milliseconds
      setTimeout(() => {
        let currentCamera = this.#cameraManager.getCurrentCamera();
        currentCamera.aspect = this.#container.clientWidth / this.#container.clientHeight;
        currentCamera.updateProjectionMatrix();
  
        this.#renderer.setSize(this.#container.clientWidth, this.#container.clientHeight);
        this.#renderer.setPixelRatio(window.devicePixelRatio);
        this.#renderer.render(this.#scene, currentCamera);
      }, delay);
  }

  #onResize() {  }
}

export { Resizer };
