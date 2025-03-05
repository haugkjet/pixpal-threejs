# pixpal-threejs
Imphenzia PixPal Palette Texture support for Threejs

How to run the example locally

1. Clone the repo
2. cd pixpal-threejs
3. npm install
4. npm run dev


How to use the pixpal palette in your own project.
main.js is should be pretty self explanatory but here are the main points:

1. Copy PixPalMaterial.js into your own project.
2. Download Pixpal textures to folder of your choice.
3. Update load paths in PixPalMaterial.js if necessary ("./assets/Textures/" by default)
        const texture = loader.load('./assets/Textures/ImphenziaPixPal_BaseColor.png');
        const emissiontexture = emissionloader.load('./assets/Textures/ImphenziaPixPal_Emission.png');  
        const metalnessRoughnessTexture = roughnessloader.load('./assets/Textures/ImphenziaPixPal_Attributes.png');  
3. For objects made directly in threejs. Need to adjust uv to single pixel. 

    import { PixPalMaterial, adjustUVsToSinglePixel}  from './PixPalMaterial.js'; 

    const plane = new THREE.Mesh(geometryPlane, PixPalMaterial);
    adjustUVsToSinglePixel(geometryPlane,  49,45); // No colorpicker, open ImphenziaPixPal_BaseColor.jpg in Gimp or similar to access pixel for desired workflow

4. For objects made in blender following Imphenzia workflow you just set the material directly when loading the model. See addGltf.js
    gltf.scene.traverse((child) => {
            if (child.isMesh) {
              child.material = PixPalMaterial;
            }
          });

5. For proper metal and mirror reflection make sure to use cubemap or hdri in your scene.

Todo:
 - Improve demosscene showcasing glow/bloom for emission material
 - Some subtle issues with color animation
 - For cloud deployment make sure to place assets under public

npm init -y
npm install vite --save-dev
npm install three
npm install three-perf

Add the following line to the scripts section of
package.json

"dev": "vite"


