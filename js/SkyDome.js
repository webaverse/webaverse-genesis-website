import { ShaderMaterial, Mesh, SphereGeometry, BackSide } from "../../build/three.module";

export default class SkyDome extends Mesh {

    constructor( params ){
        super(
            new SphereGeometry( params.radius, params.segsW, params.segsH ), 
            new ShaderMaterial( {
                uniforms: params.uniforms,
                vertexShader: params.vertexShader,
                fragmentShader: params.fragmentShader,
                side: BackSide
            } )
        );
    }

}