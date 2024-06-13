import * as THREE from 'three';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { config } from '../entities/config';

const pi = Math.PI;
function createLights(scene) {
  const col_light = 0xffffff;

  const ambientLight = new THREE.AmbientLight(0x0f4700, 0.7);

  let intensity = 2;
  let width = config.world.size.width;
  let height = config.world.size.depth;
  const upAreaLigh = new THREE.RectAreaLight(col_light, intensity, width, height);
  upAreaLigh.position.set(0, 5, config.world.size.depth / 2);
  upAreaLigh.rotation.x = - pi / 2;

  intensity = 7
  const backgroundAreaLight = new THREE.RectAreaLight(col_light, intensity, width, height / 2);
  backgroundAreaLight.position.set(10, height / 2, config.world.size.depth);
  backgroundAreaLight.rotation.x = pi + pi / 4;

  intensity = 2
  height = 10
  const frontAreaLight = new THREE.RectAreaLight(col_light, intensity, width, height);
  frontAreaLight.position.set(0, height / 2, -2);
  frontAreaLight.rotation.x = pi;

  intensity = 1
  const enemyLightLeft = new THREE.SpotLight(col_light, intensity, config.world.size.depth, pi / 3);
  enemyLightLeft.position.set(config.world.size.width / 2, 0, 0);
  enemyLightLeft.target.position.set(0, 0, config.world.size.depth);

  const enemyLightRight = new THREE.SpotLight(col_light, intensity, config.world.size.depth, pi / 3);
  enemyLightRight.position.set(-config.world.size.width / 2, 0, 0);
  enemyLightRight.target.position.set(0, 0, config.world.size.depth);

  scene.add(ambientLight, frontAreaLight, upAreaLigh, backgroundAreaLight, 
            enemyLightLeft, enemyLightLeft.target, enemyLightRight, enemyLightRight.target);

}

export { createLights };
