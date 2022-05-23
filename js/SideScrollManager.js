import { TweenLite, Power1, Power3, Linear, gsap } from 'gsap';
import SideScrollControls from './SideScrollControls';
import EventDispatcher from './EventDispatcher';

let container;
let controlsContainer;
let slideItemsContainer;
let imgPath = './imgs/content-scroll-imgs/'
let scrollItemsLength;
let scrollItemsArray;


let slideItemsArray = [];
let slideWidth = 480;
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
let currentScrollVal = 0;
let currentContentIndex = 0;
let newDragScrollVal = 0;
let globalScrollDist = 0;
let isMobile;
let gotoSlideAlreadyInProgress = false;
let gotoSlideLatestValue = -1;

const dispatcher = new EventDispatcher();


const init = ( params ) => {
    
    console.log( 'SideScrollManager.init()' );

    isMobile = params.isMobile;
    container = params.container;
    scrollItemsLength = params.itemsLength;

    // Slides 
    slideItemsContainer = document.querySelector( '.slide-scroll-items-container' );
    
    // Controls
    controlsContainer = document.querySelector( '.slide-scroll-controls-container' );

    SideScrollControls.init( { 
        isMobile: isMobile,
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

        slideItem.id = i;

        slideItem.blurImg = blurImg;
        slideItem.focusImg = focusImg;
        slideItem.tintImg = tintImg;

        slideItem.appendChild( blurImg );
        slideItem.appendChild( focusImg );
        slideItem.appendChild( tintImg );

        slideItem.sineVal = i / contentLength;
        slideItem.originVal = i / contentLength;
        console.log( 'sineVal ' +  slideItem.sineVal );

        slideItem.transforms = { 
            rotX: 0 * Math.sin(  slideItem.sineVal ),
            rotY: ( 15 * contentLength ) * Math.sin(  slideItem.sineVal ),
            rotZ: ( 5 * contentLength ) * Math.sin(  slideItem.sineVal ),
            trans: ( slideWidth * contentLength ) * Math.sin(  slideItem.sineVal ),
            perspective: ( 800 * contentLength ) * Math.sin(  slideItem.sineVal )
        }
        
        gsap.set( slideItem, { transform: `rotateX(${ slideItem.transforms.rotX }deg) rotateY(${ slideItem.transforms.rotY }deg) rotateZ(${ slideItem.transforms.rotZ }deg) translateX(${ slideItem.transforms.trans }px)`, perspective: `${ slideItem.transforms.perspective }px` });

        if( i != 0 ) {
            tintImg.style.opacity = 0;
            focusImg.style.opacity = 0;
        } else {

        }
        
        slideItem.style.zIndex = zIndexCtr - i;
        tintImg.style.opacity = i * 0.3;

        slideItemsContainer.appendChild( slideItem );
        slideItemsArray.push( slideItem );

        if( isMobile ){
            slideItemsContainer.addEventListener( 'touchstart', pointerDown );
            slideItem.addEventListener( 'touchend', slideItemClickedHandler );
        } else {
            slideItemsContainer.addEventListener( 'pointerdown', pointerDown );
            slideItem.addEventListener( 'pointerup', slideItemClickedHandler );
        }

        
    }

    gsap.set( slideItemsContainer, { x: (window.innerWidth - slideWidth ) * 0.5 })

    setTimeout( function() { goToSlideVal( 0.2 ) }, 5000 )

}

const goToSlideVal = ( val ) => {
    let newSlideIndex = getIndexFromValue( val );
    console.log( 'newSlideIndex ' + newSlideIndex );
}


const goToSlideIndex = ( index ) => {

    if(!gotoSlideAlreadyInProgress)
        gotoSlideAlreadyInProgress = true;
    else{
        gotoSlideLatestValue = index;
        return;
    }

    let newSlideVal = getValueFromIndex( index );

    dispatcher.dispatchEvent( 'componentIndexChange', { index: index } );

    console.log( 'SideScrollManager.gotoSlideIndex() > ' + index  + ' val: ' + newSlideVal );

    for( let i = 0; i<slideItemsArray.length; i++ ){
        
        let slideItem = slideItemsArray[ i ];

        slideItem.sineVal = slideItem.originVal + newSlideVal;

        slideItem.transforms = { 
            rotX: 0 * Math.sin(  slideItem.sineVal ),
            rotY: ( 15 * contentLength ) * Math.sin(  slideItem.sineVal ),
            rotZ: ( 5 * contentLength ) * Math.sin(  slideItem.sineVal ),
            trans: ( slideWidth * contentLength ) * Math.sin(  slideItem.sineVal ),
            perspective: ( 800 * contentLength ) * Math.sin(  slideItem.sineVal )
        }

        gsap.to( slideItem, 0.6, { transform: `rotateX(${ slideItem.transforms.rotX }deg) rotateY(${ slideItem.transforms.rotY }deg) rotateZ(${ slideItem.transforms.rotZ }deg) translateX(${ slideItem.transforms.trans }px)`, perspective: `${ slideItem.transforms.perspective }px`, ease: Power3.easeOut, delay: i * 0.00 });

        if( i == index ){
            zIndexCtr++;
            slideItem.style.zIndex = zIndexCtr;
            gsap.to( slideItem, 0.6, { scaleX: 1.1, scaleY: 1.1, ease: Power3.easeOut, delay: i * 0.025 })
            gsap.to( slideItem.focusImg, 0.6, { opacity: 1, ease: Power3.easeOut, delay: i * 0.025 } );
            gsap.to( slideItem.tintImg, 0.6, { opacity: 0, ease: Power3.easeOut, delay: i * 0.025  } );
        } else { 
            slideItem.style.zIndex = zIndexCtr - Math.ceil( Math.abs( slideItem.sineVal * 10  )) ;
            gsap.to( slideItem, 0.6, { scaleX: 1, scaleY: 1, ease: Power3.easeOut, delay: i * 0.025 })
            gsap.to( slideItem.focusImg, 0.6, { opacity: 0, ease: Power3.easeOut, delay: i * 0.025 } );
            gsap.to( slideItem.tintImg, 0.6, { alpha: Math.abs( slideItem.sineVal ) * 1.5, ease: Power3.easeOut, delay: i * 0.025  } );
        }
    }

    currentContentIndex = index;
    currentScrollVal = getValueFromIndex( currentContentIndex );
    gotoSlideAlreadyInProgress = false;
    if(gotoSlideLatestValue > -1){
        gotoSlideLatestValue = -1;
        goToSlideIndex(gotoSlideLatestValue);
    }
}

const getValueFromIndex = ( index ) => {
    let valFromIndex = parseFloat( ( index * 0.2 ).toFixed( 1 ) );
    return -valFromIndex;
}

const getIndexFromValue = ( val ) => {
    let indexFromVal = val * 5;
    return indexFromVal;
}


const updateScrollVal = ( val ) => {

    let valToIndex = -Math.round( val/2 * 10 ); 

    if( valToIndex < 0 ) valToIndex = 0;
    if( valToIndex > contentLength-1 ) valToIndex = contentLength-1;

    console.log( 'updateScrollVal() > valToIndex: ' + valToIndex ); 

    let activeIndex = valToIndex;

    SideScrollControls.forceClick( activeIndex )
   
    currentContentIndex = activeIndex; 
    
    for( let i = 0; i<slideItemsArray.length; i++ ){
        let slideItem = slideItemsArray[ i ];

        slideItem.sineVal = slideItem.originVal + val;

        slideItem.transforms = { 
            rotX: 0 * Math.sin(  slideItem.sineVal ),
            rotY: ( 15 * contentLength ) * Math.sin(  slideItem.sineVal ),
            rotZ: ( 5 * contentLength ) * Math.sin(  slideItem.sineVal ),
            trans: ( slideWidth * contentLength ) * Math.sin(  slideItem.sineVal ),
            perspective: ( 800 * contentLength ) * Math.sin(  slideItem.sineVal )
        }

        gsap.to( slideItem, 0.6, { transform: `rotateX(${ slideItem.transforms.rotX }deg) rotateY(${ slideItem.transforms.rotY }deg) rotateZ(${ slideItem.transforms.rotZ }deg) translateX(${ slideItem.transforms.trans }px)`, perspective: `${ slideItem.transforms.perspective }px`, ease: Power3.easeOut, delay: i * 0.0 });
 
        if( i == activeIndex && activeIndex > -1 && activeIndex < contentLength ){
            zIndexCtr++;
            slideItem.style.zIndex = zIndexCtr;
            gsap.to( slideItem, 0.6, { scaleX: 1.1, scaleY: 1.1, ease: Power3.easeOut, delay: i * 0.0 })
            gsap.to( slideItem.focusImg, 0.6, { opacity: 1, ease: Power3.easeOut, delay: i * 0.0 } );
            gsap.to( slideItem.tintImg, 0.6, { opacity: 0, ease: Power3.easeOut, delay: i * 0.0  } );
        } else { 
            slideItem.style.zIndex = zIndexCtr - Math.ceil( Math.abs( slideItem.sineVal * 10 )) ;
            gsap.to( slideItem, 0.6, { scaleX: 1, scaleY: 1, ease: Power3.easeOut, delay: i * 0.0 })
            gsap.to( slideItem.focusImg, 0.6, { opacity: 0, ease: Power3.easeOut, delay: i * 0.0 } );
            gsap.to( slideItem.tintImg, 0.6, { alpha: Math.abs( slideItem.sineVal ) * 1.5, ease: Power3.easeOut, delay: i * 0.0  } );
        }
    }

    
}


const pointerDown = ( evt ) => {
    
    if( isMobile ){
        // disableScroll(evt);
        slideStartX = evt.touches[ 0 ].clientX;
        window.addEventListener( 'touchmove', mousemove );
        window.addEventListener( 'touchend', pointerUp );
    } else {
        slideStartX = evt.clientX;
        window.addEventListener( 'mousemove', mousemove );
        window.addEventListener( 'pointerup', pointerUp );
    }

}

const pointerUp = ( evt ) => {


    if( isMobile ){
        window.removeEventListener( 'touchmove', mousemove );
        window.removeEventListener( 'touchend', pointerUp );
    } else {
        window.removeEventListener( 'mousemove', mousemove );
        window.removeEventListener( 'pointerup', pointerUp );
    }
    

    let scrollVal = ( globalScrollDist / ( window.innerWidth * 1 ) );
    console.log( 'pointerUp() > scrollVal abs ' + Math.abs( scrollVal ) )

    if( Math.abs( scrollVal ) > 0.09 ) {
        goToSlideIndex( currentContentIndex );
    }

    //currentScrollVal = getValueFromIndex( currentContentIndex );
    console.log( 'currentScrollVal ' + currentScrollVal );

    newDragScrollVal = 0;
    globalScrollDist = 0;

    // enableScroll(evt);

}

function disableScroll(e) {
    // noscroll = ;
    if (window.addEventListener)
        window.addEventListener("DOMMouseScroll", e.preventDefault(), false);
    window.onwheel = e.preventDefault(); // modern standard
    window.onmousewheel = document.onmousewheel = e.preventDefault(); // older browsers, IE
    window.ontouchmove = e.preventDefault(); // mobile
    document.onkeydown = e.preventDefault();
}
  
function enableScroll(e) {
    // noscroll = false;
    if (window.removeEventListener)
        window.removeEventListener("DOMMouseScroll", e.preventDefault(), false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}

const mousemove = ( evt ) => {

    newDragScrollVal = 0;
    globalScrollDist = 0;

    if( isMobile ){
        globalScrollDist = evt.touches[ 0 ].clientX - slideStartX;
    } else {
        globalScrollDist = evt.clientX - slideStartX;
    }

    
    newDragScrollVal = currentScrollVal + ( globalScrollDist / ( window.innerWidth * 1 ) );
    
    console.log( 'mouseMoving ' + newDragScrollVal )

    updateScrollVal( newDragScrollVal );

}

// CALLED FROM CONTENT CONTROLLER 
const changeSlideItemIndex = ( index ) => {
    console.log( 'SideScrollManager.changeSlideItemIndex  ' + index )
    goToSlideIndex( index );
    SideScrollControls.forceClick( index )

  /*   if( index > contentLength - 1  ) index = 0;  
    if( index < 0 ) index = contentLength - 1;


    
 */
}


const slideItemClickedHandler = ( evt ) => {
    //console.log( 'slideItemClicked ' + evt.currentTarget.id );

    let scrollVal = ( globalScrollDist / ( window.innerWidth * 1 ) );
    //console.log( 'slideItemClickedHandler() > scrollVal abs ' + Math.abs( scrollVal ) )

    if( Math.abs( scrollVal ) < 0.1 ) {
        console.log( 'slideItemClickedHandler() > GO TO SLIDE INDEX ' + evt.currentTarget.id )
        goToSlideIndex( evt.currentTarget.id );
        currentContentIndex = evt.currentTarget.id;
        SideScrollControls.forceClick( evt.currentTarget.id );
    }

    

}

const controlItemClickedHandler = ( evt ) => {
    console.log( 'controlItemClickedHandler() > id ' + evt.index );
    goToSlideIndex( evt.index );
    currentContentIndex = evt.index;
}


const resize = ( width, height ) => {
    console.log( 'SideScrollManager.resize()');

    if( width < 600 ){
        slideWidth = 256;
        goToSlideIndex( currentContentIndex );
    } else if( width > 599 && width < 768 ){
        slideWidth = 360;
        goToSlideIndex( currentContentIndex );
    } else if( width > 767 ){
        slideWidth = 480;
        goToSlideIndex( currentContentIndex );
    }

    if( height < 480 ){
        slideWidth = 220;
        goToSlideIndex( currentContentIndex );
    }

    gsap.set( slideItemsContainer, { x: (window.innerWidth - slideWidth ) * 0.5 })
}

window.slideScrollResize = resize;

const SideScrollManager = {
    init,
    controlItemClickedHandler,
    resize,
    dispatcher,
    changeSlideItemIndex,
}



export default SideScrollManager