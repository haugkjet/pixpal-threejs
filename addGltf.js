import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { materialAtlas}  from './PixPalMaterial.js'; 

function addGltf(scene,positionX,positionY, positionZ, modelname) {

const gltfloader = new GLTFLoader();

gltfloader.load(
    modelname,
    function (gltf) {

        gltf.scene.traverse((child) => {
            if (child.isMesh) {
              child.material = materialAtlas;
            }
          });
      // Model loaded successfully
      gltf.scene.position.set(positionX,positionY,positionZ);
      scene.add(gltf.scene);
      
    },
    function (xhr) {
      // Loading progress
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      // Error occurred
      console.error('An error happened', error);
    }
  );
}

export { addGltf};