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
let zIndexCtr = 99;
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
        blurImg.className = 'slide-scroll-img slide-shadow';
        let focusImg = document.createElement( 'img' );
        focusImg.className = 'slide-scroll-img';
        let tintImg = document.createElement( 'img' );
        tintImg.className = 'slide-scroll-img';

        blurImg.src = imgPath + sectionImgs[ i ].blur;
        focusImg.src = imgPath + sectionImgs[ i ].focus;
        tintImg.src = imgPath + 'tint-img.png';

        slideItem.blurImg = blurImg;
        slideItem.focusImg = focusImg;
        slideItem.tintImg = tintImg;

        slideItem.appendChild( blurImg );
        slideItem.appendChild( focusImg );
        slideItem.appendChild( tintImg );

        slideItem.sineFract = i / contentLength;
        slideItem.originFract = i / contentLength;
        console.log( 'SineFract ' +  slideItem.sineFract )


        slideItem.transforms = { 
            rotX: 0 * Math.sin(  slideItem.sineFract ),
            rotY: ( 15 * contentLength ) * Math.sin(  slideItem.sineFract ),
            rotZ: ( 5 * contentLength ) * Math.sin(  slideItem.sineFract ),
            trans: ( 480 * contentLength ) * Math.sin(  slideItem.sineFract ),
            perspective: ( 800 * contentLength ) * Math.sin(  slideItem.sineFract )
        }
        
        gsap.set( slideItem, { transform: `rotateX(${ slideItem.transforms.rotX }deg) rotateY(${ slideItem.transforms.rotY }deg) rotateZ(${ slideItem.transforms.rotZ }deg) translateX(${ slideItem.transforms.trans }px)`, perspective: `${ slideItem.transforms.perspective }px` });

        if( i != 0 ) {
            tintImg.style.opacity = 0;
            focusImg.style.opacity = 0;
        } else {
        }
        
        slideItem.style.zIndex = zIndexCtr - i;

        tintImg.style.opacity = i * 0.3;

        


        slideItemsContainer.appendChild( slideItem )
        slideItemsArray.push( slideItem );
    }

    gsap.set( slideItemsContainer, { x: (window.innerWidth - 480 ) * 0.5 })
}

const controlItemClickedHandler = ( evt ) => {
    console.log( 'itemClicled in Manager ' + evt.id );

    let newIndex = -( evt.id * 0.2 );
    console.log( 'new index ' + newIndex );

    for( let i = 0; i<slideItemsArray.length; i++ ){
        let slideItem = slideItemsArray[ i ];

        slideItem.sineFract = slideItem.originFract + newIndex;

        slideItem.transforms = { 
            rotX: 0 * Math.sin(  slideItem.sineFract ),
            rotY: ( 15 * contentLength ) * Math.sin(  slideItem.sineFract ),
            rotZ: ( 5 * contentLength ) * Math.sin(  slideItem.sineFract ),
            trans: ( 480 * contentLength ) * Math.sin(  slideItem.sineFract ),
            perspective: ( 800 * contentLength ) * Math.sin(  slideItem.sineFract )
        }

        gsap.to( slideItem, 0.6, { transform: `rotateX(${ slideItem.transforms.rotX }deg) rotateY(${ slideItem.transforms.rotY }deg) rotateZ(${ slideItem.transforms.rotZ }deg) translateX(${ slideItem.transforms.trans }px)`, perspective: `${ slideItem.transforms.perspective }px`, ease: Power3.easeOut, delay: i * 0.0 });

        if( i == evt.id ){
            zIndexCtr++;
            slideItem.style.zIndex = zIndexCtr;
            gsap.to( slideItem.focusImg, 0.6, { opacity: 1, ease: Power3.easeOut, delay: i * 0.025 } );
            gsap.to( slideItem.tintImg, 0.6, { opacity: 0, ease: Power3.easeOut, delay: i * 0.025  } );
        } else { 
            slideItem.style.zIndex = zIndexCtr - Math.ceil( Math.abs( slideItem.sineFract * 10  )) ;
            gsap.to( slideItem.focusImg, 0.6, { opacity: 0, ease: Power3.easeOut, delay: i * 0.025 } );
            gsap.to( slideItem.tintImg, 0.6, { alpha: Math.abs( slideItem.sineFract ) * 1.5, ease: Power3.easeOut, delay: i * 0.025  } );
        }
    }
}

const updateScrollVal = ( val ) => {

    let newIndex = ( Math.floor( Math.abs( val  * 10 ) * 0.5 ) );
    
    SideScrollControls.forceClick( newIndex );

    let activeIndex = Math.round( Math.abs( val * 5 ) );

    console.log( 'activeIndex ' + activeIndex );

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
 
        if( i == activeIndex ){
            zIndexCtr++;
            slideItem.style.zIndex = zIndexCtr;
            gsap.to( slideItem.focusImg, 0.6, { opacity: 1, ease: Power3.easeOut, delay: i * 0.0 } );
            gsap.to( slideItem.tintImg, 0.6, { opacity: 0, ease: Power3.easeOut, delay: i * 0.0  } );
        } else { 
            slideItem.style.zIndex = zIndexCtr - Math.ceil( Math.abs( slideItem.sineFract * 10  )) ;
            gsap.to( slideItem.focusImg, 0.6, { opacity: 0, ease: Power3.easeOut, delay: i * 0.0 } );
            gsap.to( slideItem.tintImg, 0.6, { alpha: Math.abs( slideItem.sineFract ) * 1.5, ease: Power3.easeOut, delay: i * 0.0  } );
        }
    }
}


const pointerDown = ( evt ) => {
    console.log( 'pointerDown ' + evt.clientX )
    evt.target.addEventListener( 'mousemove', mousemove );

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

const SideScrollManager = {
    init,
    updateScrollVal,
    controlItemClickedHandler
}

export default SideScrollManager