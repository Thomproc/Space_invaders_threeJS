import * as THREE from 'three';

function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    });  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;
  return renderer;
}

export { createRenderer };
