import * as THREE from 'three';

function createLights(scene) {
  const col_light = 0xffffff;

  const light = new THREE.AmbientLight(col_light, 0.6);

  const keyLight = new THREE.DirectionalLight(col_light, 0.4);
  keyLight.position.set(0, 5, -1);
  keyLight.target.position.set(0, 0, 3);
  
  const fillLight = new THREE.DirectionalLight(col_light, 0.5);
  fillLight.position.set(-8, 2, 8);
  fillLight.target.position.set(0, 0, 3);

  const backLight = new THREE.DirectionalLight(col_light, 0.5);
  backLight.position.set(8, 2, 8);
  backLight.target.position.set(0, 0, 3);


  const helperKey = new THREE.DirectionalLightHelper(keyLight, 1);
  const helperFill = new THREE.DirectionalLightHelper(fillLight, 1);
  const helperBack = new THREE.DirectionalLightHelper(backLight, 1);

  scene.add(light, keyLight, fillLight, backLight);//, helperKey, helperFill, helperBack);

}

export { createLights };
