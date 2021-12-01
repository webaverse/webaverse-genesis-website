import 'regenerator-runtime/runtime';
import * as THREE from '../../build/three.module';
import { OrbitControls } from '../../examples/jsm/controls/OrbitControls';
import { GLTFLoader } from '../../examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from '../../examples/jsm/loaders/DRACOLoader';

import { TweenLite, Power1, Power4, Linear } from 'gsap';
import StarryNightShader from './shaders/StarryNightShader';

import Fireflies from './FireFlies';
import TreesManager from './TreesManager';
import MistShader from './shaders/MistShader';
import SimplexNoise from 'simplex-noise';
import FireflyManager from './FireflyManager';
import EventDispatcher from './EventDispatcher';
import AudioManager from './AudioManager';
import UI from './UI';

import { Bend, ModifierStack } from './modifiers.min';



const allowControls = false;
let modelLoaded = false;
let dispatcher = new EventDispatcher();

let allowUpdate = true;

let windowWidth, windowHeight, clock, controls;
let renderer, scene, camera, cube, plane;

let nightSkydome;
let dayCols = { col1: new THREE.Color( 0xd0e8f9 ), col2: new THREE.Color( 0x85afd9 ), fog: new THREE.Color( 0x77b8d9 ) };
let nightCols = { col1: new THREE.Color( 0x0d1a2f ), col2: new THREE.Color( 0x1e3f3b ), fog: new THREE.Color( 0x0d1a2f ) };

let modelFogCol = new THREE.Color( 0x77b8d9 );
let terrainMeshDay, terrainMeshNight, terrainMesh, testTerrrainMeshDay, terrainMaterialDay, terrainMaterialNight;
let alphaMap;
let cloudsShaderMaterial, skyCloudsUniforms, cloudsSkydome;
let dayLight, ambientLight, hemiLight, dayLight2, ambientLight2, hemiLight2;
let nightLight, streetLight1, streetLight2, nightAmbientLight, nightModelAmbientLight;
let homeLight;
let moonLightCol = new THREE.Color( 0x9dd3d4 );
let shaders = [];
let params;
let prevLoopCtr = null;
let totalTime = 0.0;
let worldTime = 1;
const cameraOscillorParams = { origin: null, x: 0, y:0, radX: 25, radY: 10};
let paralaxVals = { x: 0, y: 0 };
let model; 
let scene2;

let shootingStarMesh, shootingStarMat;
let homeLightCols = { start: new THREE.Color( 0x18f1ff ), mid: new THREE.Color( 0xe5ca5f ), end: new THREE.Color( 0x7eff00 )}

let bendModifiersArr = [];

const leavesArr = [];
const fireflyGroups = [];

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;
let modelGroup;
let paraAmount = { x: 0, y: 0 };
let modelYCtr = Math.random()*360;

let waveMaterial, wavePlane;

let waveSimplex = new SimplexNoise();

let wavePositionAttribute;
let waveGeom;
let isMobile = false;

const ambientSoundObj = { vol: 1.0, perc: 0.0 };
const bugSoundObj = { vol: 0.5, perc: 0.0 };
const sparkSoundObj = { vol: 1.0, perc: 0.0 };


// RAYCASTER

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const nativeMouse = new THREE.Vector2();
let raycastPlane;
let raycastTarget;


function init( sceneParams ){

    console.log( 'WebaWorld.init()')

    params = sceneParams;
    isMobile = params.isMobile;
    clock = new THREE.Clock();
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );
    scene.fog = new THREE.Fog( nightCols.fog, 0, 45 );
    scene2 = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 9;
    cameraOscillorParams.origin = { x: camera.position.x, y: camera.position.y, z: camera.position.z }; 
    
    renderer = new THREE.WebGLRenderer( { antialias: true, powerPreference: "high-performance", stencil: true, alpha: true } );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.autoClear = false;

    
    params.container.appendChild( renderer.domElement );

    /* renderer.domElement.addEventListener( 'click', function(){
        console.log( 'renderer clicked ' );
    }) */
    
    if( allowControls ) controls = new OrbitControls( camera, renderer.domElement )

    let rayMat = new THREE.MeshNormalMaterial( { wireframe: true } )
    raycastPlane = new THREE.Mesh( new THREE.PlaneBufferGeometry( 100, 100, 1, 1 ), rayMat );
    raycastPlane.position.z = camera.position.z * 0.5;
    raycastPlane.visible = false;
    raycastTarget = new THREE.Mesh( new THREE.SphereBufferGeometry( 0.05, 4, 4 ), rayMat )
    raycastTarget.visible = false;
    scene2.add( raycastPlane, raycastTarget );

    addSkies();
    createTerrain();
    addLights();
    addMist();
    initAudio();
    
    
    loadModel().then(
        result => {

            
            UI.updatePreload( 0.7 );
            dispatcher.dispatchEvent( 'modelLoaded' );
            model = result;
            scene2.add( result );
            modelLoaded = true;
            addShootingStar();
            addFireflies();
            addHomeLight( result );
            FireflyManager.init( { scene: scene2, 
                model: "./assets/models/firefly/Fairy_LP_V7_galad.glb", 
                raycaster: raycaster,
                raycastPlane: raycastPlane,
                raycastTarget: raycastTarget,
                mouse: mouse,
                camera: camera
              });

        }
    );

    window.addEventListener("beforeunload", function(){
        if( AudioManager ) AudioManager.stopAll();
    });

    document.addEventListener("visibilitychange", handleVisibilityChange, false);
    
}


function handleVisibilityChange() {
    if (document.hidden){
        AudioManager.stopAll();
    }else{
        //playAllSounds();
    }
}


const addMist = () => {

    const texture = new THREE.TextureLoader().load( './assets/textures/mist/mist-mix.jpg' );

    waveMaterial = new THREE.ShaderMaterial( {
        uniforms: {
            uTime: { value: 0.0 },
            uTexture: { value: texture }
        },
        wireframe: false,
        side: THREE.FrontSide,
        vertexShader: MistShader.fragmentShader,
        fragmentShader: MistShader.vertexShader,
        transparent: true, 
        //alphaTest: true, 
        blending: THREE.AdditiveBlending,
    

    });
    

    waveMaterial.uniforms.uTexture.value.wrapS = THREE.RepeatWrapping;
    waveMaterial.uniforms.uTexture.value.wrapT = THREE.RepeatWrapping;

    waveGeom = new THREE.PlaneBufferGeometry( 20, 20, 128, 128 )

    wavePlane = new THREE.Mesh( waveGeom, waveMaterial );
    wavePlane.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), -90 * Math.PI / 180 );
    wavePlane.position.y = -1;
    scene.add( wavePlane );
}


const addHomeLight = ( sc ) => {

    homeLight = new THREE.SpotLight( homeLightCols.mid, 20 );//warm
    homeLight.position.set( 23.6, 3, 0 );
    homeLight.target.position.set( -1, 0.5, 0.5 )  
    homeLight.target.updateMatrixWorld();
    homeLight.distance = 0;
    homeLight.decay = 2;
    homeLight.penumbra = 0.5;
    homeLight.angle = 80 * Math.PI / 180;
   
    homeLight.castShadow = true;

    sc.add( homeLight );

}


const addLights = () => {

    
    ambientLight2 = new THREE.AmbientLight( 0xffffff, 0.1 );
    scene2.add( ambientLight2 );
    
    hemiLight2 = new THREE.HemisphereLight( 0x000000, 0xcccccc, 0 );
    scene2.add( hemiLight2 );


    // NIGHT 

    nightLight = new THREE.DirectionalLight( moonLightCol, 0.6 );
    nightLight.position.set( -10, 100, 0 ); 
    nightLight.castShadow = true; 
    nightLight.shadow.bias = -0.001;

    nightLight.shadow.mapSize.width = 1024;
    nightLight.shadow.mapSize.height = 1024;
    nightLight.shadow.camera.near = 0.5; 
    nightLight.shadow.camera.far = 50; 
    scene2.add( nightLight );

    let helper = new THREE.DirectionalLightHelper( nightLight, 1 );

    nightAmbientLight = new THREE.AmbientLight( moonLightCol, 1.2 );
    scene.add( nightAmbientLight );

    streetLight1 = new THREE.SpotLight( 0x00ffce, 1 );
    streetLight1.position.set( -10, -20, 0 );
    streetLight1.distance = 0;
    streetLight1.decay = 1;
    streetLight1.penumbra = 1;
    streetLight1.angle = 10 * Math.PI / 180;
    //streetLight1.castShadow = true;

    streetLight1.shadow.mapSize.width = 256;
    streetLight1.shadow.mapSize.height = 256;

    streetLight1.shadow.camera.near = 1;
    streetLight1.shadow.camera.far = 500;
    streetLight1.shadow.camera.fov = 10;

    scene2.add( streetLight1 );

    let sphelper1 = new THREE.SpotLightHelper( streetLight1, 1 );
    //scene2.add( sphelper1 );

    streetLight2 = new THREE.SpotLight( 0xff00f0, 0.5 );
    streetLight2.position.set( 10, -20, 0 );
    streetLight2.distance = 0;
    streetLight2.decay = 1;
    streetLight2.penumbra = 1;
    streetLight2.angle = 10 * Math.PI / 180;
    //streetLight2.castShadow = true;

    streetLight2.shadow.mapSize.width = 256;
    streetLight2.shadow.mapSize.height = 256;

    streetLight2.shadow.camera.near = 1;
    streetLight2.shadow.camera.far = 50;
    streetLight2.shadow.camera.fov = 30;

    scene2.add( streetLight2 );

    let sphelper2 = new THREE.SpotLightHelper( streetLight2, 1 );

}


const addFireflies = () => {

    let fireflyTxt1 = new THREE.TextureLoader().load( './assets/textures/firefly/firefly-1.png' );
    let fireflyTxt2 = new THREE.TextureLoader().load( './assets/textures/firefly/firefly-2.png' );

    
    let fireflies1 = new Fireflies( { num: 60, radius: 0.8, scale: 0.004, camera: camera, txt1: fireflyTxt1, txt2: fireflyTxt2 } );
    fireflies1.position.set( 1.8, 0.2, 2.3 )
    scene2.add( fireflies1 );

    let fireflies2 = new Fireflies( { num: 50, radius: 0.6, scale: 0.004, camera: camera, txt1: fireflyTxt1, txt2: fireflyTxt2 } );
    fireflies2.position.set( -2.2, 1.7, -1.1 )
    scene2.add( fireflies2 );

    fireflyGroups.push( fireflies1, fireflies2 );

}



const addMeshForBending = ( mesh ) => {

    mesh.bendVals = { z: -1 };
    mesh.bendAmount = 0.07 + Math.random() * 0.07;
    mesh.bendSpeed = 1 + Math.random() * 1;
    mesh.bendAngle = Math.random() * 0.5;
    
    const modifier = new ModifierStack( mesh );
    bendModifiersArr.push( modifier );
    mesh.modifier = modifier;
    mesh.bend = new Bend(0, 0.1, 0 );
    modifier.addModifier( mesh.bend );
    
    TweenLite.to( mesh.bendVals, mesh.bendSpeed, { z: 1, ease:Power1.easeInOut, yoyo: true, repeat: 9999999, onUpdate: function() {
        mesh.bend.force = mesh.bendAmount * mesh.bendVals.z;
        mesh.bend.angle = mesh.bendAngle * mesh.bendVals.z;
        modifier.apply();

    } } )
}

const loadModel = () => {
    return new Promise( ( resolve, reject ) => {
        
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( "./assets/models/draco/gltf/" );
        loader.setDRACOLoader( dracoLoader );
        
        loader.load( params.modelPath, function( gltf ) {

            let numVerts = 0;

            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {
       

                    if( child.name == "Plane015" 
                    || child.name == "Plane008" || 
                    child.name == "Plane011" || 
                    child.name == "Plane012" || 
                    child.name == "Plane006" || 
                    child.name == "Plane016" || 
                    child.name == "Plane021" || 
                    child.name == "Plane022" ){
                        addMeshForBending( child );
                    } 

                    if( child.name == "Leaf098" || child.name == "Leaf099" || child.name == "Leaf092" || child.name == "Leaf089" || child.name == "Leaf095" || child.name == "Leaf094" 
                    || child.name == "Leaf091" || child.name == "Leaf090" || child.name == "Leaf093" || child.name == "Leaf088" || child.name == "Leaf097" || child.name == "Leaf080"  || child.name == "Leaf096"
                    || child.name == "Leaf081" || child.name == "Leaf087" || child.name == "Leaf086" || child.name == "Leaf085" || child.name == "Leaf082" || child.name == "Leaf084" || child.name == "Leaf083" ){
                        
                        //child.material = new THREE.MeshNormalMaterial

                        TreesManager.addLeavesGroup( { 
                            mesh: child, 
                            rotX: child.rotation.x,
                            rotY: child.rotation.y, 
                            rotZ: child.rotation.z, 
                            moveCtrX: Math.random()*360, 
                            moveCtrY: Math.random()*360, 
                            moveCtrZ: Math.random()*360, 
    
                        } );

                    }

               

                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.side = THREE.DoubleSide;
                    numVerts += child.geometry.index.count / 3;  
                }
            }.bind( this ));

            console.log( 'addModel() num verts: ' + numVerts );

            
            gltf.scene.rotation.set( params.modelRotationAngles.x * Math.PI / 180, params.modelRotationAngles.y * Math.PI / 180, params.modelRotationAngles.z * Math.PI / 180 );
            gltf.scene.scale.set( 0.2, 0.2, 0.2 );

            gltf.scene.position.set( params.modelPos.x, params.modelPos.y, params.modelPos.z );

            resolve( gltf.scene ); 
        });
    })
}

const addShootingStar = () => {

    let ssTexture = new THREE.TextureLoader().load( './assets/textures/sky/shooting-star.png' );

    shootingStarMat = new THREE.MeshBasicMaterial( { color: 0xffffff, map: ssTexture, side: THREE.DoubleSide, transparent: true, fog: false, opacity: 0.0 } );
    shootingStarMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 512, 94 ), shootingStarMat );
    shootingStarMesh.scale.set( 0.005, 0.005, 0.005 );
    shootingStarMesh.rotation.z = ( 20 * Math.PI / 180 );

    shootingStarMesh.position.set( 20, 20, -45 )

    scene2.add( shootingStarMesh );

    shootStar( true );
}

const shootStar = ( first ) => {

    let delay = first ? 5 + Math.random() * 5 : 15 + Math.random() * 15;

    let fromAlpha = 0;
    let toAlpha = 1//worldTime == 0 ? 1 : 0;

    let startX = 20;//20 - Math.random() * 40;
    let startY = 25;//10 + Math.random() * 30;


    TweenLite.set( shootingStarMesh.material, { opacity: 0.0 } );
    TweenLite.set( shootingStarMesh.position, { x: startX, y: startY, z: -45 } );

    TweenLite.to( shootingStarMat, 0.6, { opacity: toAlpha, ease: Power4.easeIn, delay: delay } );
    TweenLite.to( shootingStarMat, 0.4, { opacity: 0, ease: Power4.easeIn, delay: delay + 0.6 });
    
    TweenLite.to( shootingStarMesh.position, 1, { x: startX -30, y: startY - 7, delay: delay, ease:Power4.easeIn, onComplete: function(){
        shootStar( false );
    } })
}


const addSkies = () => {

    let skydomeRadius = 100;

    // night
    let nightSkyShaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            skyRadius: { value: 500 },
            env_c1: { value: nightCols.col1 },
            env_c2: { value:  nightCols.col2 },
            noiseOffset: { value: new THREE.Vector3( 100, 100, 100 ) },
            starSize: { value: 0.006 },
            starDensity: { value: 0.09 },
            clusterStrength: { value: 0.2 },
            clusterSize: { value: 0.2 },
            uAlpha: { value: 1.0 }
        },
        vertexShader: StarryNightShader.vertexShader,
        fragmentShader: StarryNightShader.fragmentShader,
        transparent: false,
        depthWrite: false,
        side: THREE.BackSide,
    })

    nightSkydome = new THREE.Mesh( new THREE.SphereBufferGeometry(990, 20, 20 ), nightSkyShaderMaterial );
    scene.add( nightSkydome );
}

const createTerrain = () => {
    
    const heightMap = new THREE.TextureLoader().load( "./assets/textures/terrain/height-map-old.jpg" );

    heightMap.encoding = THREE.sRGBEncoding;
    heightMap.wrapS = THREE.ClampToEdgeWrapping;
    heightMap.wrapT = THREE.ClampToEdgeWrapping;

    heightMap.anisotropy = 16;
    
    alphaMap = new THREE.TextureLoader().load( "./assets/textures/terrain/alpha-map.png" );
    alphaMap.encoding = THREE.sRGBEncoding;
    alphaMap.wrapS = THREE.RepeatWrapping;
    alphaMap.wrapT = THREE.RepeatWrapping;
    alphaMap.anisotropy = 16;
    
    
    const textureMapDay = new THREE.TextureLoader().load( "./assets/textures/terrain/texture-map-day.jpg" );
    textureMapDay.encoding = THREE.sRGBEncoding;
    textureMapDay.wrapS = THREE.RepeatWrapping;
    textureMapDay.wrapT = THREE.RepeatWrapping;

    textureMapDay.anisotropy = 16;
    
    const textureMapNight = new THREE.TextureLoader().load( "./assets/textures/terrain/texture-map-night.jpg" );
    textureMapNight.encoding = THREE.sRGBEncoding;
    textureMapNight.wrapS = THREE.RepeatWrapping;
    textureMapNight.wrapT = THREE.RepeatWrapping;

    textureMapNight.anisotropy = 16;

    /* const normalMap = new THREE.TextureLoader().load( "./assets/textures/terrain/texture-normal-map.jpg" );
    normalMap.encoding = THREE.sRGBEncoding;
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;

    normalMap.anisotropy = 16; */
    
    terrainMaterialDay = new THREE.MeshStandardMaterial( {
        
        color: 0xffffff, 
        map: textureMapDay,
        displacementMap: heightMap,
        displacementScale: 500,
        //normalMap: normalMap, 
        normalScale: new THREE.Vector2( 1, 1 ),
        normalMapType: THREE.ObjectSpaceNormalMap,
        //alphaMap: alphaMap,
        transparent: true,
        roughness: 1,
    })
    
    terrainMaterialNight = new THREE.MeshStandardMaterial( {
        color: 0xffffff, 
        map: textureMapNight,
        displacementMap: heightMap,
        displacementScale: 500,
        //alphaMap: alphaMap,
        transparent: true,
        opacity: 1,
    })

    let terrainScale = 40 / 1024;
    let terrainGeom = new THREE.PlaneBufferGeometry( 1024, 1024, 256, 256 );
    
    terrainMeshNight = new THREE.Mesh( terrainGeom.clone(), terrainMaterialNight );
    terrainMeshNight.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), -Math.PI * 0.5 );
    terrainMeshNight.scale.set( terrainScale, terrainScale, terrainScale );
    terrainMeshNight.position.x = 5;
    terrainMeshNight.position.y = -2;
    terrainMeshNight.position.z = -10
    terrainMeshNight.matrixAutoUpdate = false
    terrainMeshNight.updateMatrix()
    scene.add( terrainMeshNight );

}

const updateWorldTime = ( val ) => {
    worldTime = val;
    if( scene.fog ) scene.fog.color.lerpColors( nightCols.fog, dayCols.fog, val );
    if( scene2.fog ) scene2.fog.color.lerpColors( new THREE.Color( 0x000000 ), modelFogCol, val );

    cloudsShaderMaterial.uniforms.uAlpha.value = val * 1;
    if( terrainMeshDay ) terrainMeshDay.material.opacity = val;

    ambientLight2.intensity = 1 * val;
    hemiLight2.intensity = 0.5 * val;
    nightLight.intensity = 0.6 - val;
    streetLight1.intensity = 1 - ( val * 1 );
    streetLight2.intensity = 0.5 - ( val * 0.5 );
    
    nightAmbientLight.intensity = 1 * ( 1 - val );
    

}

const parallaxItems = ( t ) => {
    cameraOscillorParams.x += 0.005;
    cameraOscillorParams.y += 0.0025;

    let xVal = Math.sin( cameraOscillorParams.x ) ;
    let yVal = Math.cos( cameraOscillorParams.y ) ;

    if( model ) {

        model.rotation.y = ( params.modelRotationAngles.y * Math.PI / 180 ) + ( ( 2 * Math.PI / 180 ) * -Math.sin( xVal ) );
       
    }

    camera.lookAt( 0, 0, 0 );
    paralaxVals.x = xVal;
    paralaxVals.y = yVal;

}



const update = ( t ) => {

    if( !allowUpdate ) return;

    if ( prevLoopCtr === null) {
        prevLoopCtr = t;
    }

    prevLoopCtr = t;

    if( nightSkydome ) {
        nightSkydome.rotation.y -= 0.0001;
        nightSkydome.rotation.z -= 0.0001;

    }

    for( let i = 0; i< fireflyGroups.length; i++ ){
        fireflyGroups[ i ].update( t );
    }

    TreesManager.update();

    waveMaterial.uniforms.uTime.value = clock.getElapsedTime() * 0.3;

    
    
    if( isMobile ) {
        targetX = -( mouseX ) * .0008;
        
    } else {
        targetX = -( mouseX ) * .0004;

    }

    
    if ( scene2 ) {
        //scene2.rotation.y += 0.05 * ( targetX - scene2.rotation.y );
        camera.position.x -= 0.05 * ( targetX + camera.position.x );
        camera.lookAt( scene2.position );
        modelYCtr += 0.01;
        scene2.position.y = 0.1 + Math.cos( modelYCtr ) * 0.1;   
    }
    
    renderer.clear();
    renderer.render( scene, camera );
    renderer.clearDepth();
    renderer.render( scene2, camera );

    if( raycastPlane ) {
        //updateRaycaster();
        if( FireflyManager.getModelLoaded() ) FireflyManager.update();
    }

};



const resize = () => {

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( windowWidth, windowHeight );
}


const mouseMove = ( e ) => {

    if( !modelLoaded ) return;

    mouseX = ( e.clientX - windowWidth/2 ) * 3;
    mouseY = ( e.clientY - windowHeight/2 ) * 3;

    mouse.x = ( e.clientX / windowWidth ) * 2 - 1;
    mouse.y = - ( e.clientY / windowHeight ) * 2 + 1;

    nativeMouse.x = e.clientX;
    nativeMouse.y = e.clientY;

    TweenLite.to( paraAmount, 2, { x: ( mouseX / windowWidth ) * 0.5, ease: Power1.easeOut, onUpdate: updateLightColors })

}

const touchMove = ( e ) => {

    if( !modelLoaded ) return;

    mouseX = ( e.touches[ 0 ].clientX - windowWidth/2 ) * 3;
    mouseY = ( e.touches[ 0 ].clientY - windowHeight/2 ) * 3;

    mouse.x = ( e.touches[ 0 ].clientX / windowWidth ) * 2 - 1;
    mouse.y = - ( e.touches[ 0 ].clientY / windowHeight ) * 2 + 1;

   /*  nativeMouse.x = e.touches[ 0 ].clientX;
    nativeMouse.y = e.clientY; */

    TweenLite.to( paraAmount, 2, { x: ( mouseX / windowWidth ) * 0.5, ease: Power1.easeOut, onUpdate: updateLightColors })
}

const updateLightColors = () => {

    if( paraAmount.x > 0 ){
        homeLight.color.lerpColors( homeLightCols.mid, homeLightCols.end, paraAmount.x * 4 );
    } else {
        homeLight.color.lerpColors( homeLightCols.mid, homeLightCols.start, Math.abs( paraAmount.x * 4 ) );
    }

    homeLight.target.updateMatrixWorld();

}

const initAudio = () => {

    //return;

    AudioManager.dispatcher.addEventListener( 'audioLoaded', function( e ){

        if( isMobile ) dispatcher.dispatchEvent( 'audioInitMobile' );

        if( e.id == 'ambient-loop' ) {
            TweenLite.to( ambientSoundObj, 3, { perc: 1, ease: Power1.easeInOut, delay: 0, onUpdate: function(){
                AudioManager.fadeVolume( 'ambient-loop', ambientSoundObj.vol * ambientSoundObj.perc );
                AudioManager.fadeVolume( 'bug-flap', bugSoundObj.vol * ambientSoundObj.perc );
            }});
        } 
    })
    
    AudioManager.init( { isMobile: isMobile } );



    /* TweenLite.to( ambientSoundObj, 10, { perc: 0.1, ease: Power1.easeInOut, delay: 5, onUpdate: function(){
        AudioManager.fadeVolume( 'ambient-loop', ambientSoundObj.vol * ambientSoundObj.perc );
    }, onComplete: function(){
        TweenLite.to( ambientSoundObj, 2, { perc: 1.0, ease:Power1.easeInOut, delay: 5, onUpdate: function(){
            AudioManager.fadeVolume( 'ambient-loop', ambientSoundObj.vol * ambientSoundObj.perc );
        } });
    }}) */
}

const getDispatcher = () => {
    return dispatcher;
}

const getRenderer = () => {
    return renderer;
}


const getParallaxVals = () => {
    return paralaxVals;
}

const getParaAmount = () => {
    return paraAmount.x;
}

const getAudioManager = () => {
    return AudioManager;
}

const updateCameraPosition = ( val ) => {
    camera.position.y = -( val * 1.5 );
    //scene.position.y = -( val * 1 )
    renderer.clear();
    renderer.render( scene, camera );
    renderer.clearDepth();
    renderer.render( scene2, camera );
    //console.log( 'cameraPos ' + camera.position.y + val );

    /* ambientLight2.intensity = 1 * val;
    hemiLight2.intensity = 0.5 * val;
    
    
     */
    nightLight.intensity = 0.6 * ( 1 - ( val * 4 ) );
    nightAmbientLight.intensity = 1 - ( val * 4 );
    streetLight1.intensity = 1 - ( val * 0.5 );
    streetLight2.intensity = 0.5 - ( val * 0.5 );

    if( val > 0.75 ) {
        allowUpdate = false;
    } else {
        allowUpdate = true;

    }

}


const WebaWorld = {
    init,
    update,
    resize,
    getRenderer,
    getParallaxVals,
    updateWorldTime,
    mouseMove,
    getParaAmount,
    getDispatcher,
    touchMove,
    initAudio,
    dispatcher,
    getAudioManager,
    updateCameraPosition
};

export default WebaWorld;