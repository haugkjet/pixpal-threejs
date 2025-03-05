import * as THREE from 'three';

const loader = new THREE.TextureLoader();
const emissionloader = new THREE.TextureLoader();
const roughnessloader = new THREE.TextureLoader();

const texture = loader.load('./assets/Textures/ImphenziaPixPal_BaseColor.png');
const emissiontexture = emissionloader.load('./assets/Textures/ImphenziaPixPal_Emission.png');  
const metalnessRoughnessTexture = roughnessloader.load('./assets/Textures/ImphenziaPixPal_Attributes.png');    

texture.flipY = false;
texture.minFilter = THREE.NearestFilter;
texture.magFilter = THREE.NearestFilter;

emissiontexture.flipY = false;
emissiontexture.minFilter = THREE.NearestFilter;
emissiontexture.magFilter = THREE.NearestFilter;
    
metalnessRoughnessTexture.flipY=false;
metalnessRoughnessTexture.minFilter = THREE.NearestFilter;
metalnessRoughnessTexture.magFilter = THREE.NearestFilter;

const materialAtlas = new THREE.MeshStandardMaterial({
    map: texture,
    emissive: 0xffffff,
    emissiveMap: emissiontexture,
    emissiveIntensity: 5,

    roughnessMap: metalnessRoughnessTexture,
    roughness: 1.0, // Set to 1 to see full effect of the roughness map
    metalnessMap: metalnessRoughnessTexture,
    metalness: 1.0, // Set to 1 to see full effect of the roughness map
  });  

materialAtlas.onBeforeCompile = (shader) => {
console.log("onBeforeCompile called");
    // Add custom uniforms
    shader.uniforms.time = { value: 0.0 };
    
    shader.uniforms.yMin = { value: 0.2 }; // Start of the range
    shader.uniforms.yMax = { value: 0.8 }; // End of the range
    shader.uniforms.emissiveMap = { value: emissiontexture };

materialAtlas.userData.shader = shader; 

   // Add time uniform and vUv varying
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
    #include <common>
    uniform float time;
    varying vec2 vUv;
    `
  );

  // Modify UV coordinates in vertex shader
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
    #include <begin_vertex>
    vUv = uv;
    `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `
    #include <common>
    varying vec2 vUv;
    uniform float time;   
    `
  );  

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <metalnessmap_fragment>',
      `
      #include <metalnessmap_fragment>
      metalnessFactor = texture2D(metalnessMap, vMetalnessMapUv).r;
      `
    );
    
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <roughnessmap_fragment>',
      `
      #include <roughnessmap_fragment>
      roughnessFactor = 1.0 - texture2D(roughnessMap, vRoughnessMapUv).g;
      `
      
    );

    // Add color animation using the blue channel
    shader.fragmentShader = shader.fragmentShader.replace(
    '#include <color_fragment>',
    `
    #include <color_fragment>
    
    vec2 animatedUv = vUv;
    
    float textureSize = 128.0; // Size of your texture
    float loopDuration = 128.0; // The range we want to loop over
    float animationSpeed = 36.0; // Adjust this value to change the animation speed    

    // Create a looping time value from 1 to 36
    float loopedTime = mod(time * animationSpeed, loopDuration) + 1.0;

    // Calculate the UV offset based on the texture size
    float uvOffset = (loopedTime - 1.0) / textureSize;
  
    animatedUv.y +=  uvOffset * texture2D(metalnessMap, vMetalnessMapUv).b; // Use blue channel to control animation
  
    // Ensure the UV stays within [0, 1] range
    animatedUv.y = fract(animatedUv.y);
  
    vec3 animatedColor = texture2D(map, animatedUv).rgb;

    diffuseColor.rgb = mix(diffuseColor.rgb, animatedColor, 1.1);

    // Sample the emissive map
    vec3 emissiveColr = texture2D(emissiveMap, vUv).rgb;

    // Modulate emissive by animated color for consistency
    emissiveColr *=  animatedColor;

    // Set final emissive output
    #ifdef USE_EMISSIVEMAP
        totalEmissiveRadiance *= emissiveColr;
    #endif

    `
  );    
  };

  materialAtlas.needsUpdate = true
  metalnessRoughnessTexture.needsUpdate = true

  // When adding objects directly in threejs code, there is no colorpicker 
  // like in blender to set the color (adjust the uv to single pixel)
  // Open ImphenziaPixPal_BaseColor.png in a paint sofware like Gimp
  // and hover over the Pixel value desired.
  function adjustUVsToSinglePixel(geometry,pixelX,pixelY) {
    const uvs = geometry.attributes.uv;

    const atlasWidth = 128;
    const atlasHeight = 128;

    const u = pixelX / atlasWidth;
    const v = pixelY / atlasHeight; // Flip Y-axis

    for (let i = 0; i < uvs.count; i++) {
    uvs.setXY(i, u, v);
    }

  }
  
  export { materialAtlas , adjustUVsToSinglePixel};

