import 'regenerator-runtime/runtime'
import { gsap, Power1, Power4, Linear } from 'gsap';
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

       
    UI.dispatcher.addEventListener( 'toggleAudio', function( e ){
        console.log( 'toggleAudio');
        if( e.audioToggle ) {
            WebaWorld.getAudioManager().playAll();

        } else {
            WebaWorld.getAudioManager().stopAll();
        }

    });


    UI.init( { isMobile: isMobile } );

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

    // const gui = new GUI();
    // gui.add( guiParams, 'drag', -0.8, 0.0 ).step( 0.2 ).onChange( function ( value ) {
        
        
    //     console.log( 'scrollVal ' + value)
    //     ContentManager.updateDragVal( value );
        
    // } );
    
    // gui.open(); 
    // ContentManager.updateDragVal( -0.2 );


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
    FlexSlider.init()
}
const FlexSlider = {
    btn1:0,
    btn2:0,
	// total no of items
	num_items: document.querySelectorAll(".slider-item").length,
	
	// position of current item in view
	current: 1,

	init: function() {
		// set CSS order of each item initially
        console.log("CNDLE---2")
	

		this.addEvents();
	},
    imgChange:function(){
        console.log("\n\nIMG CHNSGE",this.current)
        if(this.current==1){
            document.querySelector(".content-scroller").style.backgroundImage= `url('http://www.freeimageslive.com/galleries/light/pics/light00002g.jpg')`;
    
    
        }
        else if(this.current==2){
            document.querySelector(".content-scroller").style.backgroundImage= `url('http://www.freeimageslive.com/galleries/home/diningroom/pics/diningroom_table.jpg')`;
    
        }
        else if(this.current==3){
            console.log("curr_ ")
            document.querySelector(".content-scroller").style.backgroundImage= `url('./imgs/content-bg-imgs/content-bg-img-00.jpg')`;
    
            
        }else if(this.current==4){
            document.querySelector(".content-scroller").style.backgroundImage= `url('http://www.freeimageslive.com/galleries/home/diningroom/pics/diningroom_table.jpg')`
            
        }else if(this.current==5){
            document.querySelector(".content-scroller").style.backgroundImage= `url('http://www.freeimageslive.com/galleries/light/pics/light00002g.jpg')`;
    
            
        }else if(this.current==6){
            document.querySelector(".content-scroller").style.backgroundImage= `url('http://www.freeimageslive.com/galleries/light/pics/light01043.jpg')`;
    
            
        }else if(this.current==7){
            document.querySelector(".content-scroller").style.backgroundImage= `url('http://www.freeimageslive.com/galleries/light/pics/light00002g.jpg')`;
    
            
        }
        
    },
	addEvents: function() {
		var that = this;

		// click on move item button
		document.querySelector("#move-button").addEventListener('click', () => {
            this.btn2=1;
            this.btn1=0
            this.gotoNext();

		});

		// after each item slides in, slider container fires transitionend event
		document.querySelector("#slider-container").addEventListener('transitionend', () => {
			this.changeOrder();
		});
        document.querySelector("#move-button-left").addEventListener('click', () => {
            console.log("Button prev")
            this.btn1=1
            this.btn2=0
			this.gotoNext2();
		});

	},

	changeOrder: function() {
        console.log("Xcurr: ",this.current,"Xnum_ : ",this. num_items)

        if(this.btn2==1){
        console.log("curr: ",this.current,"num_ : ",this. num_items)//left btn
        if(this.current == this.num_items)
        this.current = 1;
    else 
        this.current++;

    let order = 1;

    // change order from current position till last
    for(let i=this.current; i<=this.num_items; i++) {
        document.querySelector(".slider-item[data-position='" + i + "']").style.order = order;
        order++;
    }

    // change order from first position till current
    for(let i=1; i<this.current; i++) {
        document.querySelector(".slider-item[data-position='" + i + "']").style.order = order;
        order++;
    }

    // translate back to 0 from -100%
    document.querySelector("#slider-container").classList.remove('slider-container-transition');
    document.querySelector("#slider-container").style.transform = 'translateX(0)';
    }
        else{
        console.log("curr: ",this.current,"2num_ : ",this. num_items)//right btn
        // console.log("curr: ",this.current,"num_ : ",this. num_items)//left btn
        if(this.current == 1)
        this.current = this.num_items;
    else 
        this.current--;

    let order = 1;

    // change order from current position till last
    for(let i=this.current; i<=this.num_items; i++) {
        document.querySelector(".slider-item[data-position='" + i + "']").style.order = order;
        order++;
    }

    // change order from first position till current
    for(let i=1; i<this.current; i++) {
        document.querySelector(".slider-item[data-position='" + i + "']").style.order = order;
        order++;
    }

    document.querySelector("#slider-container").classList.remove('slider-container-transition');
    document.querySelector("#slider-container").style.transform = 'translateX(0)';
   
}

		
	},


	


	gotoNext: function() {
        console.log("\n\nNEXT")
		document.querySelector("#slider-container").classList.add('slider-container-transition');
		document.querySelector("#slider-container").style.transform = 'translateX(-100%)';
        this.imgChange()

       

	},
    gotoNext2: function() {
        console.log("\n\nNEXT")

		document.querySelector("#slider-container").classList.add('slider-container-transition');
		document.querySelector("#slider-container").style.transform = 'translateX(+100%)';
        this.imgChange()
        
	}
};





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
    gsap.set( contentContainer, { y: -( yVal * ( window.innerHeight * 0.25 ) ) })
    WebaWorld.updateCameraPosition( yVal );
    ContentManager.updateScroll( yVal );
    console.log("is this the value?", yVal)
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

