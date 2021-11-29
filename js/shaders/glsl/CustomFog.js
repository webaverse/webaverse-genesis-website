import * as THREE from '../../../../build/three.module';
import snoise from './snoise';


exports.init = () => {
    
    THREE.ShaderChunk.fog_fragment = `
    #ifdef USE_FOG
      vec3 fogOrigin = cameraPosition;
      vec3 fogDirection = normalize(vWorldPosition - fogOrigin);
      float fogDepth = distance(vWorldPosition, fogOrigin);
      // f(p) = fbm( p + fbm( p ) )
      vec3 noiseSampleCoord = vWorldPosition * 0.00025 + vec3(0.0, 0.0, fogTime * 0.025);
      float noiseSample = FBM(noiseSampleCoord + FBM(noiseSampleCoord)) * 0.5 + 0.5;
      fogDepth *= mix(noiseSample, 0.5, saturate((fogDepth - 500.0) / 500.0));
      fogDepth *= fogDepth;
      float heightFactor = 0.005;
      float fogFactor = heightFactor * exp(-fogOrigin.y * fogDensity) * (
          1.0 - exp(-fogDepth * fogDirection.y * fogDensity)) / fogDirection.y;
      fogFactor = saturate(fogFactor);
      gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
    #endif`;
    
    THREE.ShaderChunk.fog_pars_fragment = snoise + `
    #ifdef USE_FOG
      uniform float fogTime;
      uniform vec3 fogColor;
      varying vec3 vWorldPosition;
      #ifdef FOG_EXP2
        uniform float fogDensity;
      #else
        uniform float fogNear;
        uniform float fogFar;
      #endif
    #endif`;
    
    THREE.ShaderChunk.fog_vertex = `
    #ifdef USE_FOG
      vWorldPosition = worldPosition.xyz * 1.0;
    #endif`;
    
    THREE.ShaderChunk.fog_pars_vertex = `
    #ifdef USE_FOG
      varying vec3 vWorldPosition;
    #endif`;
}


