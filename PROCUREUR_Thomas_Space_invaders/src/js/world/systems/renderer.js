import * as THREE from 'three';

function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    });
    
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;
  //renderer.physicallyCorrectLights = true;
  return renderer;
}

export { createRenderer };
