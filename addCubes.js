import * as THREE from 'three';
import { PixPalMaterial, adjustUVsToSinglePixel}  from './PixPalMaterial.js'; 
function addCubes(scene) {

// Create a cube without uv adjustment
const geometry0 = new THREE.BoxGeometry(1, 1, 1);
const cube0 = new THREE.Mesh(geometry0, PixPalMaterial);
cube0.position.x=-2.2;
cube0.position.y=0.5;
cube0.rotation.z = Math.PI/2
scene.add(cube0);

// Create a standard cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const cube = new THREE.Mesh(geometry, PixPalMaterial);
adjustUVsToSinglePixel(geometry,  2, 8 );
cube.position.x=-1.1;
cube.position.y=0.5;
scene.add(cube);

// Create a Glowing / Emissive cube
const geometry2 = new THREE.BoxGeometry(1, 1, 1);
const cube2 = new THREE.Mesh(geometry2, PixPalMaterial);
adjustUVsToSinglePixel(geometry2,  52, 24 );
cube2.position.x=0;
cube2.position.y=0.5;
scene.add(cube2);

// Create a metallic cube
const geometry3 = new THREE.BoxGeometry(1, 1, 1);
const cube3 = new THREE.Mesh(geometry3, PixPalMaterial);
adjustUVsToSinglePixel(geometry3,  27, 103 );
cube3.position.x=1.1;
cube3.position.y=0.5;
scene.add(cube3);

// Create a plastic cube
const geometry5 = new THREE.BoxGeometry(1, 1, 1);
const cube5 = new THREE.Mesh(geometry5, PixPalMaterial);
adjustUVsToSinglePixel(geometry5,  80, 103 );
cube5.position.x=2.2;
cube5.position.y=0.5;
scene.add(cube5);


// Create a reflective cube
const geometry6 = new THREE.BoxGeometry(1, 1, 1);
const cube6 = new THREE.Mesh(geometry6, PixPalMaterial);
adjustUVsToSinglePixel(geometry6,  80, 73 );
cube6.position.x=3.3;
cube6.position.y=0.5;
scene.add(cube6);

// Create a shiny cube
const geometry7 = new THREE.BoxGeometry(1, 1, 1);
const cube7 = new THREE.Mesh(geometry7, PixPalMaterial);
adjustUVsToSinglePixel(geometry7,  54, 103 );
cube7.position.x=4.4;
cube7.position.y=0.5;
scene.add(cube7);


// Create a dull cube
const geometry8 = new THREE.BoxGeometry(1, 1, 1);
const cube8 = new THREE.Mesh(geometry8, PixPalMaterial);
adjustUVsToSinglePixel(geometry8,  2, 103 );
cube8.position.x=5.5;
cube8.position.y=0.5;
scene.add(cube8);


// Create a color animated cube
const geometry9 = new THREE.BoxGeometry(1, 1, 1);
const cube9 = new THREE.Mesh(geometry9, PixPalMaterial);
adjustUVsToSinglePixel(geometry9,  116, 10 );
cube9.position.x=6.8;
cube9.position.y=0.5;
scene.add(cube9);
}

export { addCubes };
