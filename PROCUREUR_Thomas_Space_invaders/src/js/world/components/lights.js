import * as THREE from 'three';

function createLights(scene) {
  const col_light = 0xffffff;

  const light = new THREE.AmbientLight(col_light, 0.6);

  const keyLight = new THREE.DirectionalLight(col_light, 0.4);
  keyLight.position.set(0, 50, -10);
  keyLight.target.position.set(0, 0, 30);
  
  const fillLight = new THREE.DirectionalLight(col_light, 0.5);
  fillLight.position.set(-80, 20, 80);
  fillLight.target.position.set(0, 0, 30);

  const backLight = new THREE.DirectionalLight(col_light, 0.5);
  backLight.position.set(80, 20, 80);
  backLight.target.position.set(0, 0, 30);


  const helperKey = new THREE.DirectionalLightHelper(keyLight, 1);
  const helperFill = new THREE.DirectionalLightHelper(fillLight, 1);
  const helperBack = new THREE.DirectionalLightHelper(backLight, 1);

  scene.add(light, keyLight, fillLight, backLight);//, helperKey, helperFill, helperBack);

}

export { createLights };
