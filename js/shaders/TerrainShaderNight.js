const TerrainShaderNight = {

    vertexShader: `
    // Uniforms are data that are shared between shaders
    // The contain data that are uniform across the entire frame.
    // The heightmap and scaling constant for each point are uniforms in this respect.
    
    // A uniform to contain the heightmap image
    uniform sampler2D bumpTexture;
    // A uniform to contain the scaling constant
    uniform float bumpScale;
    
    // Varyings are variables whose values are decided in the vertext shader
    // But whose values are then needed in the fragment shader
    
    // A variable to store the height of the point
    varying float vAmount;
    // The UV mapping coordinates of a vertex
    varying vec2 vUv;
    
    void main()
    {
        // The "coordinates" in UV mapping representation
        vUv = uv;
    
        // The heightmap data at those coordinates
        vec4 bumpData = texture2D(bumpTexture, uv);
    
        // height map is grayscale, so it doesn't matter if you use r, g, or b.
        vAmount = bumpData.r;
    
        // move the position along the normal
        vec3 newPosition = position + normal * bumpScale * vAmount;
    
        // Compute the position of the vertex using a standard formula
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  
    `,
  
    fragmentShader: `

    uniform sampler2D terrainTexture;
    varying vec2 vUv;
    varying float vAmount;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;
    uniform float uDayAlpha;
    
    void main()
    {
        // Get the color of the fragment from the texture map
        // at that coordinate in the UV mapping

        vec4 txt = texture2D(terrainTexture, vUv);
        
        gl_FragColor = vec4( txt.rgb, uDayAlpha );
        
        #ifdef USE_FOG
          #ifdef USE_LOGDEPTHBUF_EXT
              float depth = gl_FragDepthEXT / gl_FragCoord.w;
          #else
              float depth = gl_FragCoord.z / gl_FragCoord.w;
          #endif
          float fogFactor = smoothstep( fogNear, fogFar, depth );
          gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
      #endif
    }
    `,
   
};

export default TerrainShaderNight;