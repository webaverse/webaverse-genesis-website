import { TweenLite, Power1, Power3, Linear, gsap } from 'gsap';
import SideScrollControls from './SideScrollControls';

let container;
let controlsContainer;
let slideItemsContainer;
let imgPath = './imgs/content-scroll-imgs/'
let scrollItemsLength;
let scrollItemsArray;


let slideItemsArray = [];

let slideStartX;

let sectionImgs = [ 
    { focus: 'info_sm.png', blur:'info_alt_sm.png' },
    { focus: 'engine_sm.png', blur:'engine_alt_sm.png' },
    { focus: 'street_sm.png', blur:'street_alt_sm.png' },
    { focus: 'partner_sm.png', blur:'partner_alt_sm.png' },
    { focus: 'secret_sm.png', blur:'secret_alt_sm.png' },
]

let contentLength = sectionImgs.length;

const init = ( params ) => {
    
    console.log( 'SideScrollManager.init()' );

    container = params.container;
    scrollItemsLength = params.itemsLength;

    // Slides 
    slideItemsContainer = document.querySelector( '.slide-scroll-items-container' );
    
    // Controls
    controlsContainer = document.querySelector( '.slide-scroll-controls-container' );

    SideScrollControls.init( { 
        container: controlsContainer,
        numItems: contentLength,
    })

    SideScrollControls.dispatcher.addEventListener( 'controlItemClicked', controlItemClickedHandler, false );
    
    // build slides;

    for( let i = 0; i<contentLength; i++ ){
        let slideItem = document.createElement( 'div' );
        slideItem.className = 'slide-scroll-item';
        let blurImg = document.createElement( 'img' );
        blurImg.className = 'slide-scroll-img';
        let focusImg = document.createElement( 'img' );
        focusImg.className = 'slide-scroll-img';

        blurImg.src = imgPath + sectionImgs[ i ].blur;
        focusImg.src = imgPath + sectionImgs[ i ].focus;

        slideItem.appendChild( blurImg );
        slideItem.appendChild( focusImg );

        //slideItem.style.zIndex = tempContentLen - i;

        slideItem.sineFract = i / contentLength;
        slideItem.originFract = i / contentLength;
        console.log( 'SineFract ' +  slideItem.sineFract )
 
        /* let rots = { x: 0 * i, y: 15 * i, z: 5 * i, pers: 800 * i };
        let perspective = { pers: 800 * i };
        let trans = { x: 480 * i };

        slideItem.rots = rots;
        slideItem.trans = trans;
        slideItem.perspective = perspective;
 */

        slideItem.transforms = { 
            rotX: 0 * Math.sin(  slideItem.sineFract ),
            rotY: ( 15 * contentLength ) * Math.sin(  slideItem.sineFract ),
            rotZ: ( 5 * contentLength ) * Math.sin(  slideItem.sineFract ),
            trans: ( 480 * contentLength ) * Math.sin(  slideItem.sineFract ),
            perspective: ( 800 * contentLength ) * Math.sin(  slideItem.sineFract )
        }
        
        gsap.set( slideItem, { transform: `rotateX(${ slideItem.transforms.rotX }deg) rotateY(${ slideItem.transforms.rotY }deg) rotateZ(${ slideItem.transforms.rotZ }deg) translateX(${ slideItem.transforms.trans }px)`, perspective: `${ slideItem.transforms.perspective }px` });

        if( i != 0 ) focusImg.style.opacity = 0;

        slideItemsContainer.appendChild( slideItem )
        slideItemsArray.push( slideItem );
    }

    gsap.set( slideItemsContainer, { x: (window.innerWidth - 480 ) * 0.5 })
}

const controlItemClickedHandler = ( evt ) => {
    //console.log( 'itemClicled in Manager ' + evt.id );

    for( let i = 0; i < slideItemsArray.length; i++ ){

        let slideItem = slideItemsArray[ i ];
        
        slideItem.rots.x = 0;// -= 0
        slideItem.rots.y = 0; //-= 15;// * ( i + 1 );
        slideItem.rots.z = 0; //-= 5;
        slideItem.trans.x = 0;//-= 480;
        slideItem.perspective.pers = 0;//-= 800;

        if( i == evt.id ){
            gsap.to( slideItem.children[ 1 ], 0.6, { opacity: 1, ease: Power3.easeInOut, delay: i * 0.025 } );
            //gsap.to( slideItem.children[ 0 ], 0.6, { opacity: 1, ease: Power3.easeOut } );
        } else {
            gsap.to( slideItem.children[ 1 ], 0.6, { opacity: 0, ease: Power3.easeInOut, delay: i * 0.025 } );

        }

        gsap.to( slideItem, 0.6, { transform: `rotateX(${ slideItem.rots.x }deg) rotateY(${ slideItem.rots.y }deg) rotateZ(${ slideItem.rots.z }deg) translateX(${ slideItem.trans.x }px)`, perspective: `${ slideItem.perspective.pers }px`, ease: Power3.easeInOut, delay: i * 0.025 } );

    }
}

const updateScrollVal = ( val ) => {
    console.log( 'updateScrollVal in SideScrollManager ' + val );

    //console.log( 'index is ' + )

    let newIndex = ( Math.floor( Math.abs( val  * 10 ) * 0.5 ) )

    for( let i = 0; i<slideItemsArray.length; i++ ){
        let slideItem = slideItemsArray[ i ];

        

        slideItem.sineFract = slideItem.originFract + val;

        slideItem.transforms = { 
            rotX: 0 * Math.sin(  slideItem.sineFract ),
            rotY: ( 15 * contentLength ) * Math.sin(  slideItem.sineFract ),
            rotZ: ( 5 * contentLength ) * Math.sin(  slideItem.sineFract ),
            trans: ( 480 * contentLength ) * Math.sin(  slideItem.sineFract ),
            perspective: ( 800 * contentLength ) * Math.sin(  slideItem.sineFract )
        }

        gsap.to( slideItem, 0.6, { transform: `rotateX(${ slideItem.transforms.rotX }deg) rotateY(${ slideItem.transforms.rotY }deg) rotateZ(${ slideItem.transforms.rotZ }deg) translateX(${ slideItem.transforms.trans }px)`, perspective: `${ slideItem.transforms.perspective }px`, ease: Power3.easeOut, delay: i * 0.0 });
        //gsap.set( slideItem, { transform: `rotateX(${ slideItem.transforms.rotX }deg) rotateY(${ slideItem.transforms.rotY }deg) rotateZ(${ slideItem.transforms.rotZ }deg) translateX(${ slideItem.transforms.trans }px)`, perspective: `${ slideItem.transforms.perspective }px` });
        
        if( i == newIndex ){
            gsap.to( slideItem.children[ 1 ], 0.6, { opacity: 1, ease: Power3.easeOut, delay: i * 0.0 } );
            //gsap.to( slideItem.children[ 0 ], 0.6, { opacity: 1, ease: Power3.easeOut } );
        } else {
            gsap.to( slideItem.children[ 1 ], 0.6, { opacity: 0, ease: Power3.easeOut, delay: i * 0.00 } );

        }
    }
}

/* 
const pointerDown = ( evt ) => {
    console.log( 'pointerDown ' + evt.clientX )
}

const pointerUp = ( evt ) => {
    console.log( 'pointerUp' );
    evt.target.removeEventListener( 'mousemove', mousemove );
}

const mousemove = ( evt ) => {
    let dragDist;
}

const updateScroll = ( val ) => {
    let amt = val > 1 ? 1 : val;
}
 */
const SideScrollManager = {
    init,
    updateScrollVal,
}

export default SideScrollManager