import * as THREE from 'three';
import { config } from '../entities/config';

function createLights(scene) {
  const col_light = 0xffffff;

  const light = new THREE.AmbientLight(0x41ff12, 0.5);

  const keyLight = new THREE.DirectionalLight(col_light, 0.8);
  keyLight.position.set(0, 10, 0);
  keyLight.target.position.set(0, 0, 0);
  
  const fillLight = new THREE.DirectionalLight(col_light, 0.3);
  fillLight.position.set(-config.world.size.width / 2, 0, 0);
  fillLight.target.position.set(0, 5, config.world.size.depth / 2);

  const backLight = new THREE.DirectionalLight(col_light, 0.3);
  backLight.position.set(config.world.size.width / 2, 0, 0);
  backLight.target.position.set(0, 5, config.world.size.depth / 2);

  const helperKey = new THREE.DirectionalLightHelper(keyLight, 1);
  const helperFill = new THREE.DirectionalLightHelper(fillLight, 1);
  const helperBack = new THREE.DirectionalLightHelper(backLight, 1);

  scene.add(light, keyLight, fillLight, backLight);// helperKey, helperFill, helperBack);

}

export { createLights };
