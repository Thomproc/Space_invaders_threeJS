import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function createControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas);

  controls.enableDamping = false;
  controls.target = new THREE.Vector3(0, 0, 7);  // replace camera.lookAt
  controls.update();
  

  return controls;
}

export { createControls };
