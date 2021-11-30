import 'regenerator-runtime/runtime'
import { TweenLite, Power1, Power4, Linear } from 'gsap';
import Stats from '../../examples/jsm/libs/stats.module';
import WebaWorld from './WebaWorld';
import { GUI } from '../../examples/jsm/libs/dat.gui.module.js';
import userAgent from './userAgent';
import UI from './UI';
import ContentManager from './ContentManager';

let world;
let windowWidth;
let windowHeight;
let foreground;
let foregroundImg;
let parallaxAmount = 80;
let guiParams;
let isMobile;
let contentContainer;
let stats;
let showStats = false;
//import "./css/index.css";

//console.log = function(){};


window.onload = init;

function init(){
    console.log( 'app.init');

    if( showStats ) stats = new Stats();
        
    isMobile = userAgent.getUserAgent();
    console.log( 'isMobile ' + isMobile );

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    WebaWorld.dispatcher.once( 'modelLoaded', function() { 
        console.log( 'app.modelLoaded()')
        document.querySelector( '.content-container' ).style.display = 'block';

        WebaWorld.getAudioManager().dispatcher.addEventListener( 'audioInitByInteraction', UI.toggleAudioIconOn )

    } )

    WebaWorld.dispatcher.addEventListener( 'audioInitMobile', UI.forceComplete );

       
    /* UI.dispatcher.addEventListener( 'toggleAudio', function( e ){
        console.log( 'toggleAudio');
        if( e.audioToggle ) {
            WebaWorld.getAudioManager().playAll();

        } else {
            WebaWorld.getAudioManager().stopAll();
        }

    });


    UI.init( { isMobile: isMobile } ); */

    contentContainer = document.querySelector( '.content-container' );
    ContentManager.init( { 
        container: contentContainer,
    })

    WebaWorld.init( { 
        modelPath: "./assets/models/homespace/homespace_shell_V12_galad.glb",
        modelPos: { x: -2, y: -0.5, z: 0 },
        modelScale: 8.0,
        modelRotationAngles: { x: 17, y: 48.5, z: 0 },
        width: windowWidth, 
        height: windowHeight,
        fov: 45, 
        near: 1,
        far: 10000,
        fogNear: 0.1,
        fogFar: 100,
        fogColor: 0xffffff,
        fogDensity: 0.00007,
        fogSpeed: 0.001,
        cameraPos: { x: 0, y: 200, z: 500 },
        sunlightColor: 0xdbdf66,
        sunlightIntensity: 3.5,
        sunlightPos: { x: -20, y: 20, z: 10 },
        sunlightShadowMapSize: 5,
        wireframe: false, 
        colors: { fog: 0x222222, top: 0x222222, bot: 0x04FFFF },
        cloudRotationSpeed: 0.0002,
        isMobile: isMobile,
        container: document.querySelector( '.app-container' ),
    } );

    guiParams = {
        drag: 0.0,
    };

    const gui = new GUI();
    gui.add( guiParams, 'drag', -0.8, 0.0 ).step( 0.2 ).onChange( function ( value ) {
        
        /* WebaWorld.updateWorldTime( value );
        foregroundImg.style.filter = 'grayscale(' + ( value ) * 100 + '%)';
        foregroundImg.style.filter = 'brightness(' + value + ' )'; */
        console.log( 'scrollVal ' + value)
        ContentManager.updateDragVal( value );
        
    } );
    
    gui.open();

    if( showStats ) document.body.appendChild( stats.dom );

    window.addEventListener( 'resize', resize, false );
    window.addEventListener("scroll", updateScroll );
    
    if( isMobile ){
        window.addEventListener('touchstart', WebaWorld.touchMove, false );
        window.addEventListener( 'touchmove', WebaWorld.touchMove, false )
    } else {
        window.addEventListener( 'mousemove', WebaWorld.mouseMove, false )
    }
    
    resize();
    update();
}

const update = () => {
    requestAnimationFrame( ( t ) => {
        WebaWorld.update( t );
        UI.update();
        if( showStats ) stats.update();
        update();
    } );
};

const updateScroll = ( e ) => {
    var yVal = window.scrollY / window.innerHeight;
    TweenLite.set( contentContainer, { y: -( yVal * ( window.innerHeight * 0.25 ) ) })
    WebaWorld.updateCameraPosition( yVal );
    ContentManager.updateScroll( yVal );
}


const render = () => {
  /* return (
    <div ref={ ref => ( this.mount = ref ) } />
  ) */
}

const resize = () => {

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    
    WebaWorld.resize( windowWidth, windowHeight );

}

