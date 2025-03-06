import * as THREE from 'three';
import { ThreePerf } from 'three-perf'
import GUI from 'lil-gui';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import { PixPalMaterial, adjustUVsToSinglePixel}  from './PixPalMaterial.js'; 
import { addCubes}  from './addCubes.js'; 
import { addGltf } from './addGltf.js';

import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

import { ShaderMaterial, Vector2, Vector3 } from "three";

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
  
// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
THREE.ColorManagement.enabled = true;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0; 
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () =>
    {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight
    
        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()
    
        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
    })

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomparams = {
    enableBloom: true,
    bloomStrength: 0.162,
    bloomRadius: 0.4,
    bloomThreshold: 0.496
  };

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.162,
    0.4,
    0.496
  );
  composer.addPass(bloomPass);

  const gui = new GUI();
gui.add( document, 'title' );

  
  gui.add(bloomparams, 'enableBloom').name('Enable Bloom').onChange(toggleBloom);
  gui.add(bloomparams, 'bloomStrength', 0, 3).onChange(updateBloomPass);
  gui.add(bloomparams, 'bloomRadius', 0, 1).onChange(updateBloomPass);
  gui.add(bloomparams, 'bloomThreshold', 0, 1).onChange(updateBloomPass);  

  function toggleBloom(value) {
    bloomPass.enabled = value;
  }

  function updateBloomPass() {
    bloomPass.strength = bloomparams.bloomStrength;
    bloomPass.radius = bloomparams.bloomRadius;
    bloomPass.threshold = bloomparams.bloomThreshold;
  }

  const params = {
    showPerf: true,
    roomenv: true,
    roombackground: false
  };

  const SKY_COLOR = 0x6ac5fe ;
  const GROUND_COLOR = 0xdaf0ff;
  const SKY_SIZE = 100;
  
  const vertexShader = `
        varying vec3 vWorldPosition;
              void main() {
                  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
                  vWorldPosition = worldPosition.xyz;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
              }`;
  const fragmentShader = `
        uniform vec3 topColor;
              uniform vec3 bottomColor;
              varying vec3 vWorldPosition;
              void main() {
                  float h = normalize( vWorldPosition).y;
                  gl_FragColor = vec4( mix( bottomColor, topColor, max( h, 0.0 ) ), 1.0 );
              }`;
  const uniforms = {
    topColor: { value: new THREE.Color(SKY_COLOR) },
    bottomColor: { value: new THREE.Color(GROUND_COLOR) },
  };
  const skyGeo = new THREE.SphereGeometry(SKY_SIZE, 32, 15);
  const skyMat = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    side: THREE.BackSide,
  });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);

  const skyRenderTarget = new THREE.WebGLCubeRenderTarget(1024);
  const skyCamera = new THREE.CubeCamera(0.1, 1000, skyRenderTarget);
  
  const skyShader = new THREE.ShaderMaterial({
    uniforms: {
      topColor: { value: new THREE.Color(SKY_COLOR) },
      bottomColor: { value: new THREE.Color(GROUND_COLOR) }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.BackSide
  });
  
  const skyMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), skyShader);

  function updateSky() {
    skyMesh.visible = true;
    skyCamera.update(renderer, scene);
    skyMesh.visible = false;
  }

  scene.environment = skyRenderTarget.texture;




// Create and apply RoomEnvironment
const pmremGenerator = new THREE.PMREMGenerator(renderer);
const roomEnvironment = new RoomEnvironment();
const roomEnvironmentMap = pmremGenerator.fromScene(roomEnvironment).texture;
scene.environment = roomEnvironmentMap;
scene.background = params.roombackground;

const controls = new OrbitControls(camera, renderer.domElement);

// Initialize three-perf
const perf = new ThreePerf({
    anchorX: 'left',
    anchorY: 'top',
    domElement: document.body, // or other canvas rendering wrapper
    renderer: renderer // three js renderer instance you use for rendering
});




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


camera.position.z = 15;
camera.position.y = 5;
camera.position.x = -2;

const geometryPlane = new THREE.PlaneGeometry(20, 20)
const plane = new THREE.Mesh(geometryPlane, PixPalMaterial);
adjustUVsToSinglePixel(geometryPlane,  49,35); // No colorpicker 
scene.add(plane);
plane.rotation.x = -Math.PI/2
plane.position.y = 0



addCubes(scene); // Use pixpal directly in threejs
addGltf (scene, 0,0,-5,'./assets/madeinblender.glb')

//addGltf (scene, 0,0,0,'./assets/Imphenzia-PixPal.glb')


const clock = new THREE.Clock();

// Animation function
function animate() {
   
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    if (PixPalMaterial.userData.shader) {
        PixPalMaterial.userData.shader.uniforms.time.value = elapsedTime;
    //console.log("Time value:", elapsedTime); // Add this line for debugging
  }

  //renderer.render(scene, camera);
  composer.render();
  perf.end();
}

animate();