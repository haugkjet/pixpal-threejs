import * as THREE from 'three';
import { ThreePerf } from 'three-perf'
import GUI from 'lil-gui';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { PixPalMaterial, adjustUVsToSinglePixel}  from './PixPalMaterial.js'; 
import { addCubes}  from './addCubes.js'; 
import { addGltf } from './addGltf.js';

import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
  
// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1; 
THREE.ColorManagement.enabled = true;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
document.body.appendChild(renderer.domElement);

// Create and apply RoomEnvironment
const pmremGenerator = new THREE.PMREMGenerator(renderer);
const roomEnvironment = new RoomEnvironment();
const roomEnvironmentMap = pmremGenerator.fromScene(roomEnvironment).texture;
scene.environment = roomEnvironmentMap;
scene.background = roomEnvironmentMap;

const controls = new OrbitControls(camera, renderer.domElement);

// Initialize three-perf
const perf = new ThreePerf({
    anchorX: 'left',
    anchorY: 'top',
    domElement: document.body, // or other canvas rendering wrapper
    renderer: renderer // three js renderer instance you use for rendering
});

const gui = new GUI();
gui.add( document, 'title' );

const params = {
    showPerf: true,
    roomenv: true,
    roombackground: true
  };

  gui.add(params, 'showPerf').name('Show Performance').onChange((value) => {
    if (value) {
      perf.visible = true;
    } else {
      perf.visible =false;
    }
  });  
  gui.add(params, 'roomenv').name('Room Env').onChange((value) => {
    if (value) {
        scene.environment = roomEnvironmentMap;
    } else {
        scene.environment = null
    }
  });  
  gui.add(params, 'roombackground').name('Room Background').onChange((value) => {
    if (value) {
        scene.background = roomEnvironmentMap;
    } else {
        scene.background = null
    }
  });  


camera.position.z = 7;
camera.position.y = 2;

const geometryPlane = new THREE.PlaneGeometry(20, 20)
const plane = new THREE.Mesh(geometryPlane, PixPalMaterial);
adjustUVsToSinglePixel(geometryPlane,  49,45); // No colorpicker 
scene.add(plane);
plane.rotation.x = -Math.PI/2
plane.position.y = 0



addCubes(scene); // Use pixpal directly in threejs
addGltf (scene, 0,0,-5,'./assets/madeinblender.glb')

const clock = new THREE.Clock();

// Animation function
function animate() {
   
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    if (PixPalMaterial.userData.shader) {
        PixPalMaterial.userData.shader.uniforms.time.value = elapsedTime;
    //console.log("Time value:", elapsedTime); // Add this line for debugging
  }

  renderer.render(scene, camera);
  perf.end();
}

animate();