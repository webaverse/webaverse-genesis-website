import { Group, Mesh, PlaneBufferGeometry, Vector3, MeshBasicMaterial, FrontSide } from '../build/three.module';
//import SimplexNoise from 'simplex-noise';

export default class Fireflies extends Group {

    constructor( params ){
        
        super();
        
        console.log( 'FirefliesManager num: ' + params.num );
        this.numFlies = params.num;
        this.radius = params.radius;
        this.camera = params.camera;
        this.col = params.col;
        this.txt1 = params.txt1;
        this.txt2 = params.txt2;
        this.flyScale = params.scale;

        this.mat = new MeshBasicMaterial( { 
            //color: 0xffff00,
            transparent: true, 
            map: this.txt1,  
            side: FrontSide, 
            fog: false 
        });
        this.geom = new PlaneBufferGeometry( 10, 10, 1, 1 );
        this.mesh = new Mesh();
        this.fliesArr = [];
        this.createFlies();
    }

    createFlies(){

        for( let i = 0; i< this.numFlies; i++ ){
            let fly = this.mesh.clone();
            let flyScale = this.flyScale + Math.random() * this.flyScale;
            fly.geometry = this.geom.clone();
            fly.material = this.mat.clone();
            fly.glowSpeed = 0.025 + Math.random()*0.025;
            fly.glowCtr = Math.random()*100;
            fly.flySpeed = { x: Math.random() * 0.3, y: Math.random() *0.3, z: Math.random() *0.3 };
            fly.radius = ( this.radius * 0.4 ) + Math.random() * ( this.radius * 0.4 )
            fly.scale.set( flyScale, flyScale, flyScale );
            fly.startPos = new Vector3( this.radius - ( Math.random() * ( this.radius * 2 ) ), this.radius - ( Math.random() * ( this.radius * 2 ) ), this.radius - ( Math.random() * ( this.radius * 2 ) ));
            fly.position.set( fly.startPos.x, fly.startPos.y, fly.startPos.z );
            this.fliesArr.push( fly );
            fly.lookAt( this.camera.position );
            this.add( fly );
        }

        this.update();

    }

    update( t ){
        
        for( let i = 0; i<this.fliesArr.length; i++ ){
            let fly = this.fliesArr[ i ]
            //fly.lookAt( this.camera.position );
            fly.glowCtr += fly.glowSpeed
            fly.material.opacity = -( 1 - ( ( 0.5 + ( Math.sin( fly.glowCtr ) * 0.5 ) * 3 ) ) );

            fly.position.set( 
                fly.startPos.x + Math.sin( fly.glowCtr * fly.flySpeed.x ) * fly.radius, 
                fly.startPos.y + Math.cos( -fly.glowCtr * fly.flySpeed.y ) * fly.radius, 
                fly.startPos.z + Math.sin( fly.glowCtr * fly.flySpeed.z ) * fly.radius
            );
            
        }
    }
    
}

