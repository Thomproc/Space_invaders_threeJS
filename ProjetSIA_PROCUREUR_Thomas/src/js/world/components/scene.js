import { Scene, Color } from 'three';

function createScene() {
  const scene = new Scene();
  scene.background = new Color(0x000412);
  return scene;
}

export { createScene };
