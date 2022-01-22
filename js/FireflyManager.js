import * as THREE from '../build/three.module';
import { GLTFLoader } from '../examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from '../examples/jsm/loaders/DRACOLoader';
import { TweenLite, Power1, Power2, Bounce } from 'gsap';
import gsap from 'gsap';
import MotionPathPlugin from 'gsap/dist/MotionPathPlugin';
import AudioManager from './AudioManager';
import UI from './UI';

let modelGroup;
let scene;
let model;
let modelLoaded = false;
let firefly;
let flySpeedMult = 10; 

let hoverXController = 0;
let hoverYController = 0;
let hoverCtrX = 0;

let hoverRateX = 0.06;
let hoverRangeX = 0.5;
let hoverCtrY = 0;
let hoverRateY = 0.06;
let hoverRangeY = 0.5;
let flyGroup;

let glowValue = -0.5;
let glowAmount = 2;
let glowCtr = 0;
let glowSpeed = 0.08;
let glowSpeedAni = { perc: 1, base: 0.08 };

let headSphere;
let headGlowColors = { on: new THREE.Color( 0xddff00 ), off: new THREE.Color( 0x000000 ) };
let topWingGlowColors = { on: new THREE.Color( 0x15ffff ), off: new THREE.Color( 0x000000 ) };
let botWingGlowColors = { on: new THREE.Color( 0xe900e6 ), off: new THREE.Color( 0x000000 ) };

let tlWing = { mesh: null, 

    startAngleX: 45 * Math.PI/180,  
    distX: 0.5, 
    aniCtrX: 0, 
    speedX: 0.1 * flySpeedMult, 

    startAngleY: -30 * Math.PI/180,  
    distY: 0.5, 
    aniCtrY: 0, 
    speedY: 0.1 * flySpeedMult, 

    startAngleZ: -10 * Math.PI/180,  
    distZ: 0.5, 
    aniCtrZ: 0, 
    speedZ: 0.1 * flySpeedMult, 

};

let trWing = { mesh: null, 

    startAngleX: 45 * Math.PI/180,  
    distX: 0.5, 
    aniCtrX: 0, 
    speedX: 0.1 * flySpeedMult, 

    startAngleY: 30 * Math.PI/180,  
    distY: 0.5, 
    aniCtrY: 0, 
    speedY: 0.1 * flySpeedMult, 

    startAngleZ: 10 * Math.PI/180,  
    distZ: 0.5, 
    aniCtrZ: 0, 
    speedZ: 0.1 * flySpeedMult, 

};

let blWing = { mesh: null, 

    startAngleX: -10 * Math.PI/180,  
    distX: 0.2, 
    aniCtrX: 0, 
    speedX: 0.15 * flySpeedMult, 

    startAngleY: 30 * Math.PI/180,  
    distY: 0.5, 
    aniCtrY: 0, 
    speedY: 0.1 * flySpeedMult, 

    startAngleZ: 10 * Math.PI/180,  
    distZ: 0.5, 
    aniCtrZ: 0, 
    speedZ: 0.1 * flySpeedMult, 

};

let brWing = { mesh: null, 

    startAngleX: -10 * Math.PI/180,  
    distX: 0.2, 
    aniCtrX: 0, 
    speedX: 0.15 * flySpeedMult, 

    startAngleY: 30 * Math.PI/180,  
    distY: 0.5, 
    aniCtrY: 0, 
    speedY: 0.1 * flySpeedMult, 

    startAngleZ: 10 * Math.PI/180,  
    distZ: 0.5, 
    aniCtrZ: 0, 
    speedZ: 0.1 * flySpeedMult, 

};

let glowText;
let glowPlane;
let glowColorLerp = 0;
let raycaster, raycastPlane, raycastTarget, mouse, camera;
let allowFollow = true;
let customPositionPoint = new THREE.Vector2( 0, 0 );
let dynamicMouse;
let fireflyTimeout;
let currentMouseSpeed = 0.2;
let nativScale = 0.5;
let flyToPos;
//const ambientSoundObj = { vol: 1.0, perc: 0.0 };
const bugSoundObj = { vol: 0.5, perc: 0.0 };
const sparkSoundObj = { vol: 1.0, perc: 0.0 };
let flyToNavItem
let flyAtNav = false;


const init = ( params ) => {
    gsap.registerPlugin( MotionPathPlugin );
    scene = params.scene;
    model = params.model;
    raycaster = params.raycaster;
    raycastPlane = params.raycastPlane;
    raycastTarget = params.raycastTarget;
    mouse = params.mouse;
    dynamicMouse = params.mouse;
    camera = params.camera;

    /* raycastPlane.visible = true;
    raycastTarget.visible = true; */

    flyGroup = new THREE.Group();
    flyGroup.visible = false;
    
    glowText = new THREE.TextureLoader().load( './assets/textures/firefly/firefly-1.png' );

    scene.add( flyGroup );
    flyToNavItem = document.querySelector( '.nav-alpha-item' );


    loadModel().then(
        result => {
            //console.log( 'bug loaded ' , result )
            UI.updatePreload( 0.3 );
            modelLoaded = true;
            //console.log( 'FIREFLY MODEL LOADED ' + modelLoaded )
            flyGroup.add( result );
            startFlyBehavior();
            
        }
    );


    
    
}

const offset = ( el ) => {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

const startFlyBehavior = () => {

    let flyToVec;

    if( window.innerWidth < 640 ){

    } else if( window.innerWidth < 640 && window.innerWidth > 640 ){

    } else if( window.innerWidth < 640 && window.innerWidth > 640 ){

    } else if( window.innerWidth < 640 && window.innerWidth > 640 ){

    }


    /* flyTo2DPoint( { x: 0, y: window.innerHeight - 30 }, 9 );
    returnToMouse( 17 );
    flyTo2DPoint( { x: flyToPos.left, y: window.innerHeight - 30 }, 25 );
    returnToMouse( 32 );
    flyTo2DPoint( { x: flyToPos.left, y: window.innerHeight - 30 }, 53 );
    returnToMouse( 47 ); */

    setTimeout( flyTo2DPoint, 10000 );

}

function flyTo2DPoint( point, delay ){

    //console.log( 'flyTo2DPoint()' );
        flyAtNav = true;
/*     fireflyTimeout = setTimeout( function(){ */

        flyToPos = offset( flyToNavItem );
        //console.log( 'FLY OFFSET POSITION TO ', flyToPos.left, flyToPos.top);

        console.log( '******* FLY TO THIS POINT ' + flyToPos.left )
        
        let newMousePoint = translate2DPoint( { x: flyToPos.left, y: window.innerHeight - 35 } );
        let currentMousePoint = new THREE.Vector2( dynamicMouse.x, dynamicMouse.y );

        let lerpPoint = new THREE.Vector2().lerpVectors( newMousePoint, currentMousePoint, 0.5 );
        let bezierAmount = 0.15 + Math.random() * 0.15;

       /*  console.log( 'currentMousePoint ', currentMousePoint )
        console.log( 'newMousePoint ', newMousePoint)

        console.log( 'lerpPoint ', lerpPoint) */

        
        TweenLite.to( glowSpeedAni, 0.6, { perc: 5, ease: Power1.easeIn, onUpdate: function(){
            glowSpeed = glowSpeedAni.perc * glowSpeedAni.base;
        }, onComplete: function(){
            //currentMouseSpeed = 1;
        } })

        TweenLite.to( sparkSoundObj, 1, { perc: 0.1, ease: Power1.easeInOut, delay: 0, onUpdate: function(){
            AudioManager.fadeVolume( 'spark', sparkSoundObj.vol * sparkSoundObj.perc );
        }});
        

        TweenLite.to( currentMousePoint, 0.6, { onStart: function(){ newMousePoint = translate2DPoint( { x: window.innerWidth - 320, y: window.innerHeight - 30 } ) }.bind( this ), motionPath: [ { x: lerpPoint.x + ( bezierAmount - ( Math.random() * bezierAmount * 2 ) ), y: lerpPoint.y + ( bezierAmount - ( Math.random() * bezierAmount * 2 ) ) }, { x: newMousePoint.x, y: newMousePoint.y } ], ease: Power1.easeInOut, onUpdate: function(){
            dynamicMouse = new THREE.Vector2( currentMousePoint.x, currentMousePoint.y );
        }, onComplete: function(){ 
            setTimeout( returnToMouse, 5000 );
        }.bind( this ) });
   // }, delay * 1000 );
}

function returnToMouse( delay ){
    //console.log( 'returnToMouse()' );
    //fireflyTimeout = setTimeout( function(){
        flyAtNav = false;
        allowFollow = true;
        let newMousePoint = mouse;
        let currentMousePoint = new THREE.Vector2( dynamicMouse.x, dynamicMouse.y );
        //currentMouseSpeed = 1;
        dynamicMouse = mouse;
        TweenLite.to( glowSpeedAni, 1, { perc: 1, ease: Power1.easeIn, onUpdate: function(){
            glowSpeed = glowSpeedAni.perc * glowSpeedAni.base;
            //currentMouseSpeed = 0.2;
        } })

        TweenLite.to( flyGroup.scale, 0.6, { x: nativScale, y: nativScale, z: nativScale, ease:Power2.easeIn })

        TweenLite.to( sparkSoundObj, 0.6, { perc: 0.0, ease: Power1.easeInOut, delay: 0, onUpdate: function(){
            AudioManager.fadeVolume( 'spark', sparkSoundObj.vol * sparkSoundObj.perc );
        }, onComplete: function(){
            setTimeout( flyTo2DPoint, 10000 );
        }.bind( this )});
        
        /* TweenLite.to( currentMousePoint, 1, { x: newMousePoint.x, y: newMousePoint.y, ease: Power1.easeInOut, onUpdate: function(){
            currentMousePoint = new THREE.Vector2( dynamicMouse.x, dynamicMouse.y );
            dynamicMouse = new THREE.Vector2( currentMousePoint.x, currentMousePoint.y );
        }, onComplete: function(){
            dynamicMouse = mouse;
        } });
         */
    //}, delay * 1000 ); 
}

function flyTo3DPoint( point, delay ){

    //allowFollow = false;
    
    fireflyTimeout = setTimeout( function(){
        allowFollow = false;

        /* let newMousePoint = point;//vec3
        let currentMousePoint = new THREE.Vector2( dynamicMouse.x, dynamicMouse.y );

        let lerpPoint = new THREE.Vector2().lerpVectors( newMousePoint, currentMousePoint, 0.5 );
        let bezierAmount = 0.5 + Math.random() * 0.5; */

        //{ x: lerpPoint.x + ( bezierAmount - Math.random()*bezierAmount*2 ), y: lerpPoint.y + ( bezierAmount - Math.random()*bezierAmount*2 ) }, { x: newMousePoint.x, y: newMousePoint.y } ]
        TweenLite.to( raycastTarget.position, 0.6, { x: point.x, y: point.y, z: point.z, ease: Power1.easeInOut, onUpdate: function(){
            flyGroup.lookAt( raycastTarget.position );
            TweenLite.to( flyGroup.position, currentMouseSpeed, { x: raycastTarget.position.x, y: raycastTarget.position.y, z: raycastTarget.position.z-0.3, ease: Bounce.easeOut });
        } });

        TweenLite.to( flyGroup.scale, 0.6, { x: 0, y: 0, z: 0, ease:Power2.easeIn })

        TweenLite.to( bugSoundObj, 1, { perc: 0.0, ease: Power1.easeInOut, delay: 0, onUpdate: function(){
            AudioManager.fadeVolume( 'bug-flap', bugSoundObj.vol * bugSoundObj.perc );
        }});


    }, delay * 1000 );


}


/* 
function flyTo(){
    //setTimeout( function(){
        
        let randDelay = 4 + Math.random()*4;
        let newMousePoint = translate2DPoint( { x: window.innerWidth - 320, y: window.innerHeight - 30 } );
        let currentMousePoint = new THREE.Vector2( houseMouse.x, houseMouse.y );
        
        TweenLite.to( glowSpeedAni, 1, { perc: 5, ease: Power1.easeIn, delay: randDelay, onUpdate: function(){
            glowSpeed = glowSpeedAni.perc * glowSpeedAni.base;
        } })
        
        TweenLite.to( currentMousePoint, 1, { x: newMousePoint.x, y: newMousePoint.y, delay: randDelay, ease: Power1.easeInOut, onUpdate: function(){
            houseMouse = new THREE.Vector2( currentMousePoint.x, currentMousePoint.y );
            //glowSpeed+= 0.01;
            
        }, onComplete: flyBack });
        //
    //}, 4000 + Math.random()* 4000 );



    //
}

function flyBack(){
    let randDelay = 4 + Math.random()*4;
    let newMousePoint = mouse;
    let currentMousePoint = new THREE.Vector2( houseMouse.x, houseMouse.y );
    TweenLite.to( glowSpeedAni, 1, { perc: 0.6, ease: Power1.easeIn, delay: randDelay, onUpdate: function(){
        glowSpeed = glowSpeedAni.perc * glowSpeedAni.base;
    } })
    TweenLite.to( currentMousePoint, 0.6, { x: newMousePoint.x, y: newMousePoint.y, delay: randDelay, ease: Power1.easeInOut, onUpdate: function(){
        houseMouse = new THREE.Vector2( currentMousePoint.x, currentMousePoint.y );
        //glowSpeed-= 0.01;
    }, onComplete: function(){
        houseMouse = mouse;
        flyTo();
    } });
} */




const loadModel = () => {
    return new Promise( ( resolve, reject ) => {
        
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( "./assets/models/draco/gltf/" );
        loader.setDRACOLoader( dracoLoader );
        
        loader.load( model, function( gltf ) {

            let numVerts = 0;

            gltf.scene.traverse( function ( child ) {
    
                if ( child.isMesh ) {

                    if( child.name == "Sphere_1" ){
                        headSphere = child;
                        child.material = new THREE.MeshBasicMaterial( { color: headGlowColors.on })
                    }

                    if( child.name == "Sphere" ){
                        child.material = new THREE.MeshBasicMaterial( { color: 0x000000 })
                    }

                    if( child.name == "Top_Wing_L001" ){
                        tlWing.mesh = child;
                        child.material = new THREE.MeshBasicMaterial( { color: topWingGlowColors.on, side: THREE.DoubleSide })
                    }
                    
                    if( child.name == "Top_Wing_R001" ){
                        trWing.mesh = child;
                        child.material = new THREE.MeshBasicMaterial( { color: topWingGlowColors.on, side: THREE.DoubleSide })
                    }
                    
                    if( child.name == "Bot_Wing_L001" ){
                        blWing.mesh = child;
                        child.material = new THREE.MeshBasicMaterial( { color: botWingGlowColors.on, side: THREE.DoubleSide })
                    }
                    
                    if( child.name == "Bot_Wing_R001" ){
                        brWing.mesh = child;
                        child.material = new THREE.MeshBasicMaterial( { color: botWingGlowColors.on, side: THREE.DoubleSide })
                    }

                    numVerts += child.geometry.index.count / 3;  
                }   
            });

            console.log( 'firefly num verts ' + numVerts );
            firefly = gltf.scene;;
            flyGroup.scale.set( 0.5, 0.5, 0.5 );
            flyGroup.position.set( 0, 0, 0 );
            //fireGroup.rotation.set( -10 * Math.PI / 180, -90 * Math.PI / 180, 0 );

            resolve( firefly ); 
        });
    })
}

const goToPoint = ( point ) => {
    customPositionPoint = translate2DPoint( point );
    raycastTarget.position.x = customPositionPoint.x;
    raycastTarget.position.y = customPositionPoint.y;
    raycastTarget.position.z = raycastPlane.position.z;

    //TweenLite.to( flyGroup.position, 0.2, { x: customPositionPoint.x, y: customPositionPoint.y, z: raycastPlane.position.z, ease: Bounce.easeOut })
}

const update = ( ) => {

    //return;

    //console.log( 'updating firefly ')

    //firefly.rotation.y += 0.01

    // TL

    tlWing.aniCtrX += tlWing.speedX;
    tlWing.aniCtrY += tlWing.speedY;
    //tlWing.aniCtrZ -= tlWing.speedZ;

    tlWing.mesh.rotation.set( 
        tlWing.startAngleX + ( Math.sin( tlWing.aniCtrX ) * tlWing.distX ),
        tlWing.startAngleY + ( Math.cos( tlWing.aniCtrY ) * tlWing.distY ),
        0,//tlWing.startAngleZ + ( Math.cos( tlWing.aniCtrZ ) * tlWing.distZ ),
    )

    // TR

    trWing.aniCtrX += trWing.speedX;
    trWing.aniCtrY += trWing.speedY;
    //trWing.aniCtrZ -= trWing.speedZ;

    trWing.mesh.rotation.set( 
        trWing.startAngleX + ( Math.sin( trWing.aniCtrX ) * trWing.distX ),
        trWing.startAngleY - ( Math.cos( trWing.aniCtrY ) * trWing.distY ),
        0,//trWing.startAngleZ + ( Math.cos( trWing.aniCtrZ ) * trWing.distZ ),
    )

    // BL

    blWing.aniCtrX += blWing.speedX;
    //blWing.aniCtrY += blWing.speedY;
    //trWing.aniCtrZ -= trWing.speedZ;

    blWing.mesh.rotation.set( 
        blWing.startAngleX - ( Math.sin( blWing.aniCtrX ) * blWing.distX ),
        0,//brWing.startAngleY - ( Math.cos( brWing.aniCtrY ) * brWing.distY ),
        0,//trWing.startAngleZ + ( Math.cos( trWing.aniCtrZ ) * trWing.distZ ),
    )

    // BR

    brWing.aniCtrX += brWing.speedX;
    //brWing.aniCtrY += brWing.speedY;
    //trWing.aniCtrZ -= trWing.speedZ;

    brWing.mesh.rotation.set( 
        brWing.startAngleX - ( Math.sin( brWing.aniCtrX ) * brWing.distX ),
        0,//brWing.startAngleY - ( Math.cos( brWing.aniCtrY ) * brWing.distY ),
        0,//trWing.startAngleZ + ( Math.cos( trWing.aniCtrZ ) * trWing.distZ ),
    )

    

    /* hoverXController += 0.0005
    hoverRateX = Math.sin( hoverXController );
    hoverCtrX += hoverRateX;
    firefly.position.x = ( Math.sin( hoverCtrX ) * hoverRangeX ); */
    hoverCtrY += hoverRateY;
    //firefly.position.y = ( Math.cos( hoverCtrY ) * hoverRangeY );
    //firefly.position.copy( params.mouseTarget );

    /* let glowValue = -2;
    let glowAmount = 3;
    let glowCtr = 0;
    let glowSpeed = 0.1; */

    /* glowCtr += glowSpeed;

    let norm = 0.5 + Math.sin( glowCtr ) * 0.5;
    //console.log( 'normalised ' + norm )
    
    glowColorLerp = glowValue + ( norm * glowAmount ) ;
    //console.log( 'glowLerp ' + glowColorLerp );

    headSphere.material.color.lerpColors( headGlowColors.off, headGlowColors.on, glowColorLerp );
    trWing.mesh.material.color.lerpColors( topWingGlowColors.off, topWingGlowColors.on, glowColorLerp );
    tlWing.mesh.material.color.lerpColors( topWingGlowColors.off, topWingGlowColors.on, glowColorLerp );
    brWing.mesh.material.color.lerpColors( botWingGlowColors.off, botWingGlowColors.on, glowColorLerp );
    blWing.mesh.material.color.lerpColors( botWingGlowColors.off, botWingGlowColors.on, glowColorLerp );
 */

    if( allowFollow ) { 
        updateRaycaster();
        flyGroup.lookAt( raycastTarget.position );
        //TweenLite.to( flyGroup.position, currentMouseSpeed, { x: params.mouseTarget.x, y: params.mouseTarget.y, z: params.mouseTarget.z-0.3, ease: Bounce.easeOut });
        TweenLite.to( flyGroup.position, currentMouseSpeed, { x: raycastTarget.position.x, y: raycastTarget.position.y, z: raycastTarget.position.z-0.3, ease: Bounce.easeOut });

    }

}

const updateRaycaster = () => {
    raycaster.setFromCamera( dynamicMouse, camera );

	const intersects = raycaster.intersectObjects( [ raycastPlane ] );

    raycastPlane.lookAt( camera.position )
	
    //raycastTarget.position.copy( intersects[ 0 ].position );
    raycastTarget.position.copy( intersects[0].point.add( new THREE.Vector3( 0, 0, 0 ) ) );

}

const translate2DPoint = ( point ) => {
    
    /* customPositionPoint.x = ;
    customPositionPoint.y = ; */

    return new THREE.Vector2( ( point.x / window.innerWidth ) * 2 - 1, - ( point.y / window.innerHeight ) * 2 + 1 );
}

const getModelLoaded = () => {
    return modelLoaded;
}

const resize = ( windowWidth, windowHeight ) => {
    
    if( flyAtNav ){
        
        flyToPos = offset( flyToNavItem );

        
        let newMousePoint = translate2DPoint( { x: flyToPos.left, y: window.innerHeight - 35 } );
        let currentMousePoint = new THREE.Vector2( dynamicMouse.x, dynamicMouse.y );

        let lerpPoint = new THREE.Vector2().lerpVectors( newMousePoint, currentMousePoint, 0.5 );
        let bezierAmount = 0.15 + Math.random() * 0.15;
        
        TweenLite.to( glowSpeedAni, 0.0, { perc: 5, ease: Power1.easeIn, onUpdate: function(){
            glowSpeed = glowSpeedAni.perc * glowSpeedAni.base;
        }, onComplete: function(){
            //currentMouseSpeed = 1;
        } })

        TweenLite.to( sparkSoundObj, 0, { perc: 0.1, ease: Power1.easeInOut, delay: 0, onUpdate: function(){
            AudioManager.fadeVolume( 'spark', sparkSoundObj.vol * sparkSoundObj.perc );
        }});
        

        TweenLite.to( currentMousePoint, 0.0, { onStart: function(){ newMousePoint = translate2DPoint( { x: window.innerWidth - 320, y: window.innerHeight - 30 } ) }.bind( this ), ease: Power1.easeInOut, onUpdate: function(){
            dynamicMouse = new THREE.Vector2( currentMousePoint.x, currentMousePoint.y );
        }, onComplete: function(){ 
          
        }.bind( this ) });
    }
}

const FireflyManager = {
    init,
    update,
    getModelLoaded,
    startFlyBehavior,
    resize
};

export default FireflyManager;

