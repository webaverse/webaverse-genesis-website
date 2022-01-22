import * as THREE from '../build/three.module';
import { GLTFLoader } from '../examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from '../examples/jsm/loaders/DRACOLoader';
import SilkShader from './shaders/SilkShaderRocks';
import { gsap, Power2, Power3, Power4 } from 'gsap';

const emissiveCol = 0x63fcff;
let otMesh1, otMesh2, otGroup, otHologramMat1, otHologramMat2, otPl;
let otMouseDist = 0;
let otLightPerc = 0;
const maxLight = 3.0;
const minLight = 0.7;
let silkFountainMesh, silkFountainClone1, silkFountainClone2, silkFountainsGroup, sfPl1, sfPl2, sfPL3;
const sfPlsArr = [];
let sfMouseDist = 0;
let sfLightPerc = 0;
let baseUrl = './assets/models/';
let scene;

const assetPositions = {};
let silkBrightnessVal = 0;
let silkShaderMaterial;
let enableOTTooltip = false;
let enableSFTooltip = false;
let allowSilkFountainsTooltip = false;

const terrainRaycaster = new THREE.Raycaster();
const terrainDebugMarker = new THREE.Mesh( new THREE.SphereBufferGeometry( 0.1, 4, 4 ), new THREE.MeshNormalMaterial( { wireframe: true } ) );
const terrainAssetPlane = new THREE.Mesh( new THREE.PlaneBufferGeometry( 15, 15, 20, 20 ), new THREE.MeshNormalMaterial( { wireframe: true } ) );

const sfToolTipElement = document.createElement( 'div' );
let sfToolTipImg, sfToolTipText;

const otToolTipElement = document.createElement( 'div' );
let otToolTipImg, otToolTipText;


let mousePointer = new THREE.Vector2();

const init = ( params ) => {
    console.log( 'TooltipAssetManager.init()' );
    scene = params.scene;

    otHologramMat1 = new THREE.MeshStandardMaterial( { color: emissiveCol, transparent: true, opacity: 0.2 } ); 
    otHologramMat2 = new THREE.MeshStandardMaterial( { color: emissiveCol, transparent: true, opacity: 0.2 } ); 

    scene.add( terrainDebugMarker, terrainAssetPlane );
    terrainAssetPlane.rotateOnAxis( new THREE.Vector3( 0, 1, 0 ), 10 * Math.PI / 180 );
    terrainAssetPlane.position.z = 0.7;
    terrainAssetPlane.visible = false;
    terrainDebugMarker.visible = false;

    otToolTipElement.className = "ui-terrain-asset-tooltip-ot";
    //otToolTipElement.style.opacity = '0';
    
    otToolTipImg = document.createElement( 'img' );
    otToolTipImg.src = './assets/docs-tooltip-circ.png';
    otToolTipImg.className = 'ui-tooltip-circ-ot';

    
    otToolTipText = document.createElement( 'img' );
    otToolTipText.src = './assets/docs-tooltip-text.png';
    otToolTipText.className = 'ui-tooltip-text-ot';
    //otToolTipText.style.top = '45px';

    otToolTipElement.appendChild( otToolTipText );
    otToolTipElement.appendChild( otToolTipImg );

    document.body.appendChild( otToolTipElement );

    sfToolTipElement.className = "ui-terrain-asset-tooltip-sf";
    //sfToolTipElement.style.opacity = '0';

    sfToolTipImg = document.createElement( 'img' );
    sfToolTipImg.src = './assets/app-tooltip-circ.png';
    sfToolTipImg.className = 'ui-tooltip-circ-sf';

    
    sfToolTipText = document.createElement( 'img' );
    sfToolTipText.src = './assets/app-tooltip-text.png';
    sfToolTipText.className = 'ui-tooltip-text-sf';
    //otToolTipText.style.top = '45px';

    sfToolTipElement.appendChild( sfToolTipText );
    sfToolTipElement.appendChild( sfToolTipImg );

    document.body.appendChild( sfToolTipElement );

    loadModels();
}


const loadModels = () => {

    console.log( 'TooltipAssetManager.loadModels()')

    //let pointLight = new THREE.PointLight( 0x63fcff, 2.5, 1, 1 );
    const sphereSize = 100;
    
    //scene.add( pointLightHelper );

    let p1 = loadModel( { filePath: baseUrl + 'ot/', fileName: 'Tablet_Origin_Var1_LOD2_dream.glb', pos: { x: 0, y: 0, z: 0 }, scale: 1 } ).then( result => { 
        otMesh1 = result;
        
    } );

    let p2 = loadModel( { filePath: baseUrl + 'ot/', fileName: 'Tablet_Origin_Var2_LOD2_dream.glb', pos: { x: 0, y: 0, z: 0 }, scale: 1 } ).then( result => { 
        otMesh2 = result;
        //otMesh2.add( pointLight.clone() );
    } );

    let p3 = loadModel( { filePath: baseUrl + 'silk-fountain/', fileName: 'SilkFountain_5_LOD2_center_dream.glb', pos: { x: 0, y: 0, z: 0 }, scale: 0.2 } ).then( result => { 
        silkFountainMesh = result;
        
        //silkFountainMesh.add( pl, plh )
        
    } );

    Promise.all( [ p1, p2, p3 ] ).then( models => {

        otGroup = new THREE.Group();
        otMesh2.position.set( -1.5, 0, -1.5 );
        otMesh1.position.set( 1.5, 0, 1.5 );

        otMesh2.rotation.y = -25 * ( Math.PI / 180 );
        otMesh1.rotation.y = 35 * ( Math.PI / 180 );

        otPl = new THREE.PointLight( emissiveCol, maxLight * 0.25, 3, 6 );
        otPl.position.set( 0, 1, -2 )
        const plh = new THREE.PointLightHelper( otPl, sphereSize );
        
        let marker1 = new THREE.Mesh( new THREE.BoxBufferGeometry( 5, 5, 5 ), new THREE.MeshNormalMaterial( { wireframe: true } ) );
        otGroup.add( otMesh1, otMesh2, otPl );
        otGroup.position.set( -5, -1.27, 1.8 );
        otGroup.scale.set( 0.075, 0.0975, 0.075 );
        //otGroup.rotation.y = 35 * Math.PI/180;

        scene.add( otGroup );

        silkFountainsGroup = new THREE.Group();

        silkFountainClone1 = silkFountainMesh.clone();
        silkFountainClone2 = silkFountainMesh.clone();
        //silkFountainMesh.material.wireframe = true;

        silkFountainClone1.position.set( 10, 0, 0 );
        silkFountainClone1.scale.set( 0.2 * 0.75, 0.2 * 0.75, 0.2 * 0.75 );
        silkFountainClone1.rotation.y = -90 * Math.PI/180;

        silkFountainClone2.position.set( 0, 0, 10 );
        silkFountainClone2.scale.set( 0.2 * 0.85, 0.2 * 0.85, 0.2 * 0.85 );

        silkFountainClone2.rotation.y = 90 * Math.PI/180;

        sfPl1 = new THREE.PointLight( emissiveCol, ( maxLight * 0.75 ) * 0.25, 30, 60 );
        sfPl1.position.copy( silkFountainMesh.position );

        sfPl2 = sfPl1.clone();
        sfPl2.position.copy( silkFountainClone1.position );

        sfPl3 = sfPl1.clone();
        sfPl3.position.copy( silkFountainClone1.position );

        sfPlsArr.push( sfPl1, sfPl2, sfPl3 );

        let marker = new THREE.Mesh( new THREE.BoxBufferGeometry( 5, 5, 5 ), new THREE.MeshNormalMaterial( { wireframe: true } ) );

        silkFountainsGroup.add( silkFountainMesh, silkFountainClone1, silkFountainClone2, sfPl1, sfPl2, sfPl3 );

        silkFountainsGroup.position.set( 6, -1.68, 0 );
        silkFountainsGroup.scale.set( 0.1, 0.1, 0.1 );
        //silkFountainsGroup.rotation.y = 35 * ( Math.PI/180 );


        scene.add( silkFountainsGroup );

        assetPositions.otsPos = otGroup.position;
        assetPositions.silkFountainsPos = silkFountainsGroup.position;



        /* app.add( groundMesh );

        rocksArray.push( rock01Mesh, rock02Mesh, rock03Mesh, rock04Mesh, rock05Mesh, rock06Mesh, rock07Mesh, rock08Mesh, rock09Mesh, rock10Mesh );
        rockGroupsArray.push( rockGroup01Mesh, rockGroup02Mesh, rockGroup03Mesh, rockGroup04Mesh, rockGroup05Mesh, rockGroup06Mesh, rockGroup07Mesh, rockGroup08Mesh, rockGroup09Mesh, rockGroup10Mesh );
        plantsArray.push( plantMesh01, plantMesh02, plantMesh03 );
        bushesArray.push( bushMesh01, bushMesh02 );

        addGroundItems();
        addAndScatterSilkNodes( 500, 1, 2 ); */
    });
}

const loadModel = ( params ) => {

    return new Promise( ( resolve, reject ) => {
            
        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( "./assets/models/draco/gltf/" );
        gltfLoader.setDRACOLoader( dracoLoader );
        
        gltfLoader.load( params.filePath + params.fileName, function( gltf ) {

            let numVerts = 0;

            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {

                    if( params.fileName == "Tablet_Origin_Var1_LOD2_dream.glb" || params.fileName == "Tablet_Origin_Var2_LOD2_dream.glb" ){

                        if( child.name == 'Var1_Holo' ){
                            child.material = otHologramMat2;
                        } else if( child.name == 'Var2_Holo' ){
                            //child.visible = false;
                            child.material = otHologramMat1;
                        } else {
                            child.material.color = new THREE.Color( 0x252525 );
                        }

                    }

                    if( params.fileName == 'SilkFountain_5_LOD2_center_dream.glb' ){

                        if( child.material.name == 'Silk_Var5' ){
                            const silkMaterialTexture = new THREE.TextureLoader().load( "./assets/textures/silk/silk-contrast-noise.png" );
                            silkMaterialTexture.wrapS = silkMaterialTexture.wrapT = THREE.RepeatWrapping;
                        
                            silkShaderMaterial = new THREE.ShaderMaterial({
                                uniforms: SilkShader.uniforms,
                                vertexShader: SilkShader.vertexShader,
                                fragmentShader: SilkShader.fragmentShader,
                                side: THREE.FrontSide,
                            })
                        
                            silkShaderMaterial.uniforms.noiseImage.value = silkMaterialTexture;


                            child.material = silkShaderMaterial;

                            //console.log( 'SILK MATERIAL is ' + child )

                        } else {
                            child.material.color = new THREE.Color( 0x444444 );
                        }

                        //child.material.wireframe = true;
                        
                    }



                    /* if( params.fileName == "SilkFountain_Ground_V4_Dream.glb" ){

                        let mat = new THREE.MeshStandardMaterial( { 
                           color: 0xffffff,
                            map: textureMap,
                           
                            wireframe: false
                        })

                        mat.needsUpdate = true
                            
                        child.material = mat;

                        const physicsId = physics.addGeometry( child );
                        physicsIds.push( physicsId );

                        groundGeometry = child.geometry;

                        for( let i = 0; i< groundGeometry.attributes.position.count; i++ ){
                            groundGeometry.attributes.position.needsUpdate = true;
                            let v = new THREE.Vector3().fromBufferAttribute( groundGeometry.attributes.position, i ) ;
                            groundVerticePositions.push( v );
                        }

                    } */


                    numVerts += child.geometry.index.count / 3;  
                    

                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            console.log( `modelLoaded() -> ${ params.fileName } num verts: ` + numVerts );

            gltf.scene.position.set( params.pos.x, params.pos.y, params.pos.z );
            gltf.scene.scale.set( params.scale, params.scale, params.scale );

            resolve( gltf.scene );     
        });
    })
}


const updateRaycaster = ( mouse, camera ) => {

    //console.log( 'mouse ' + mouse.x + ' ' + mouse.y )
    //console.log( 'terrainDebugMarker ', terrainDebugMarker.position )
    //console.log( 'terrainMeshNight ', terrainMeshNight.position )

    if( !terrainAssetPlane || !terrainDebugMarker || !otGroup ) return;


    terrainRaycaster.setFromCamera( mouse, camera );

	const intersects = terrainRaycaster.intersectObjects( [ terrainAssetPlane ] );
    if( intersects[ 0 ] == undefined ) return;


    terrainDebugMarker.position.copy( intersects[0].point.add( new THREE.Vector3( 0, 0, 0 ) ) );

    //console.log( 'dist' + terrainDebugMarker.position.distanceTo( TooltipAssetManager.getAssetPositions.otsPos ) );

    //console.log( 'debugPos ', terrainDebugMarker.position );
    //console.log( 'otsPos ', TooltipAssetManager.getAssetPositions().otsPos );

    otMouseDist = terrainDebugMarker.position.distanceTo( otGroup.position );
    otLightPerc = ( 5 - otMouseDist ) * 0.2;

    //console.log( 'dist ' + Math.max( minLight, maxLight * otLightPerc ) );

    otPl.intensity = Math.max( minLight, ( maxLight * 2 ) * otLightPerc );
    otHologramMat1.opacity = Math.max( 0.2, otLightPerc );
    otHologramMat2.opacity = Math.max( 0.2, otLightPerc );


    sfMouseDist = terrainDebugMarker.position.distanceTo( silkFountainsGroup.position );
    sfLightPerc = ( 5 - sfMouseDist ) * 0.2;

    sfPlsArr.forEach( pl => {
        pl.intensity = Math.max( minLight, ( maxLight * 0.75 ) * sfLightPerc );
    })

    if( terrainDebugMarker.position.distanceTo( otGroup.position ) <0.75 && enableOTTooltip == false ) {
        showOTTooltip();
        document.body.style.cursor = "pointer";
    } else if( terrainDebugMarker.position.distanceTo( otGroup.position ) > 0.75 && enableOTTooltip == true ){
        document.body.style.cursor = "auto";

        hideOTTooltip();
    }

    if( terrainDebugMarker.position.distanceTo( silkFountainsGroup.position ) <0.75 && enableSFTooltip == false ) {
        showSFTooltip();
        document.body.style.cursor = "pointer";

    } else if( terrainDebugMarker.position.distanceTo( silkFountainsGroup.position ) > 0.75 && enableSFTooltip == true ){
        document.body.style.cursor = "auto";

        hideSFTooltip();
    }


    /* if( terrainDebugMarker.position.distanceTo( silkFountainsGroup.position ) < 0.5 ) {
        console.log( 'SHOW SILK FOUNTAIN TOOLTIP '); 
    } */
 
}

const showOTTooltip = () => {
    enableOTTooltip = true;


    gsap.killTweensOf( otToolTipText );
    gsap.killTweensOf( otToolTipImg );

    gsap.set( otToolTipElement, { x: mousePointer.x + 0, y: mousePointer.y - 75.0 } )
    gsap.set( otToolTipText, { x: -40, alpha: 0 } );
    gsap.set( otToolTipImg, { scaleX: 0.5, scaleY:0.5, alpha: 0 } );

    gsap.to( otToolTipText, 0.15, { x: 0, alpha: 1, ease: Power3.easeOut } );
    gsap.to( otToolTipImg, 0.15, { scaleX: 1, scaleY:1, alpha: 1, ease: Power3.easeOut, delay: 0.05 } );

    otToolTipElement.style.display = 'block';

}

const hideOTTooltip = () => {


    //gsap.killTweensOf( otToolTipText );
    //gsap.killTweensOf( otToolTipImg );

    gsap.to( otToolTipText, 0.15, { x: 20, alpha: 0, ease: Power3.easeIn, delay: 0.1, onComplete: function(){
        enableOTTooltip = false;
        otToolTipElement.style.display = 'none';
    } } );
    gsap.to( otToolTipImg, 0.15, { scaleX: 0.5, scaleY: 0.5, alpha: 0, ease: Power3.easeIn } );


}

const showSFTooltip = () => {

    console.log('SHow SF T')
    enableSFTooltip = true;

    gsap.killTweensOf( sfToolTipText );
    gsap.killTweensOf( sfToolTipImg );
    
    gsap.set( sfToolTipElement, { x: mousePointer.x - ( 300 ), y: mousePointer.y - 75.0 } )
    gsap.set( sfToolTipText, { x: 40, alpha: 0 } );
    gsap.set( sfToolTipImg, { scaleX: 0.5, scaleY:0.5, alpha: 0 } );

    gsap.to( sfToolTipText, 0.15, { x: 0, alpha: 1, ease: Power3.easeOut } );
    gsap.to( sfToolTipImg, 0.15, { scaleX: 1, scaleY: 1, alpha: 1, ease: Power3.easeOut, delay: 0.05 } );

    sfToolTipElement.style.display = 'block';

   
}

const hideSFTooltip = () => {
    
    gsap.to( sfToolTipText, 0.15, { x: -20, alpha: 0, ease: Power3.easeIn, delay: 0.1, onComplete: function(){
        enableSFTooltip = false;
        sfToolTipElement.style.display = 'none';
    } } );
    gsap.to( sfToolTipImg, 0.15, { scaleX: 0.5, scaleY: 0.5, alpha: 0, ease: Power3.easeIn } );
}

const update = ( nativeMouse ) => {

    mousePointer = nativeMouse;

    if( enableOTTooltip ) {
        /* otToolTipElement.style.top = mousePointer.y + 'px';
        otToolTipElement.style.left = mousePointer.x + 'px'; */
        gsap.to( otToolTipElement, 0.3, { x: mousePointer.x + 0, y: mousePointer.y - 75.0, ease: Power2.easeOut } );
    }

    if( enableSFTooltip ) {
        /* otToolTipElement.style.top = mousePointer.y + 'px';
        otToolTipElement.style.left = mousePointer.x + 'px'; */
        gsap.to( sfToolTipElement, 0.3, { x: mousePointer.x - ( 300 ), y: mousePointer.y - 75, ease: Power2.easeOut } );
    }


    //silkBrightnessVal += 0.1;

    /* for( let i = 0; i < silkNodesArray.length; i++ ){
        let shaderMesh = silkNodesArray[ i ];
        shaderMesh.material.seed += 0.005;
        shaderMesh.material.uniforms.time.value = shaderMesh.material.seed;
        shaderMesh.material.uniforms.tileCaustic_brightness.value = 1.5 - ( ( ( 1 + Math.sin( shaderMesh.dist + silkBrightnessVal ) ) * 0.5 ) );
        shaderMesh.material.uniforms.noiseRipples_brightness.value = 0.1 - ( ( ( 1 + Math.sin( shaderMesh.dist + silkBrightnessVal ) ) * 0.5 ) * 0.075 );
    } */

    if( silkShaderMaterial ) silkShaderMaterial.uniforms.time.value += 0.06;
}

const getAssetPositions = () => {
    return assetPositions;
}

const TooltipAssetManager = {
    init,
    update,
    updateRaycaster,
}

export default TooltipAssetManager;