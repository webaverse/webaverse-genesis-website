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
let currentScrollFraction = 0;
let currentContentItemIndex = 0;
let newScrollFraction;
const dispatcher = new EventDispatcher();


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

        slideItem.id = i;

        slideItem.blurImg = blurImg;
        slideItem.focusImg = focusImg;
        slideItem.tintImg = tintImg;

        slideItem.appendChild( blurImg );
        slideItem.appendChild( focusImg );
        slideItem.appendChild( tintImg );

        slideItem.sineFract = i / contentLength;
        slideItem.originFract = i / contentLength;
        console.log( 'SineFract ' +  slideItem.sineFract );

        slideItem.transforms = { 
            rotX: 0 * Math.sin(  slideItem.sineFract ),
            rotY: ( 15 * contentLength ) * Math.sin(  slideItem.sineFract ),
            rotZ: ( 5 * contentLength ) * Math.sin(  slideItem.sineFract ),
            trans: ( slideWidth * contentLength ) * Math.sin(  slideItem.sineFract ),
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

        slideItemsContainer.appendChild( slideItem );
        slideItemsArray.push( slideItem );

        slideItem.addEventListener( 'click', slideItemClickedHandler );
        //slideItemsContainer.addEventListener( 'pointerdown', pointerDown );
    }

    gsap.set( slideItemsContainer, { x: (window.innerWidth - slideWidth ) * 0.5 })
}


const updateItemIndex = ( index ) => {
    console.log( 'SideScrollManager.updateItemIndex  ' + index )

    if( index > contentLength - 1  ) index = 0;  
    if( index < 0 ) index = contentLength - 1;


    updateSlidePos( index );
    SideScrollControls.forceClick( index )

}


const slideItemClickedHandler = ( evt ) => {
    //console.log( 'clicked ' + evt.currentTarget.id );
    dispatcher.dispatchEvent( 'componentIndexChange', { index: evt.currentTarget.id } );
    SideScrollControls.forceClick( evt.currentTarget.id )

    updateSlidePos( evt.currentTarget.id );
}

const controlItemClickedHandler = ( evt ) => {
    console.log( 'itemClicled in Manager ' + evt.id );

    currentScrollFraction = ( evt.id * 2 ) * 0.1;

    console.log( 'currentScrollFraction ' + currentScrollFraction )

    dispatcher.dispatchEvent( 'componentIndexChange', { index: evt.id } );

    updateSlidePos( evt.id );
}

const updateSlidePos = ( index ) => {
    
    let newFract = -( index * 0.2 );

    console.log( 'SideScrollManager.updateSlidePos() ' + newFract );

    for( let i = 0; i<slideItemsArray.length; i++ ){
        
        let slideItem = slideItemsArray[ i ];

        slideItem.sineFract = slideItem.originFract + newFract;

        slideItem.transforms = { 
            rotX: 0 * Math.sin(  slideItem.sineFract ),
            rotY: ( 15 * contentLength ) * Math.sin(  slideItem.sineFract ),
            rotZ: ( 5 * contentLength ) * Math.sin(  slideItem.sineFract ),
            trans: ( slideWidth * contentLength ) * Math.sin(  slideItem.sineFract ),
            perspective: ( 800 * contentLength ) * Math.sin(  slideItem.sineFract )
        }

        gsap.to( slideItem, 0.6, { transform: `rotateX(${ slideItem.transforms.rotX }deg) rotateY(${ slideItem.transforms.rotY }deg) rotateZ(${ slideItem.transforms.rotZ }deg) translateX(${ slideItem.transforms.trans }px)`, perspective: `${ slideItem.transforms.perspective }px`, ease: Power3.easeOut, delay: i * 0.0 });

        if( i == index ){
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

    currentContentItemIndex = index;
}

const updateScrollVal = ( val ) => {
    console.log( 'SideScrollManager.updateScrollVal() ' + val )

    /* if( val > 0 ) val = 0;
    if( val < -( ( contentLength-1 ) * 2 ) * 0.1 ) val = -( ( contentLength-1 ) * 2 ) * 0.1;
 */
    let newIndex = ( Math.floor( Math.abs( val  * 10 ) * 0.5 ) );
    let activeIndex = Math.round( Math.abs( val * 5 ) );

    /* console.log( 'NEW INDEX IS ' + newIndex );
    console.log( 'ACTIVE INDEX IS ' + activeIndex ); */


    
    if( newIndex > -1 && newIndex < contentLength ) SideScrollControls.forceClick( newIndex );
    //if( activeIndex)

    //console.log( 'activeIndex ' + activeIndex );

    for( let i = 0; i<slideItemsArray.length; i++ ){
        let slideItem = slideItemsArray[ i ];

        slideItem.sineFract = slideItem.originFract + val;

        slideItem.transforms = { 
            rotX: 0 * Math.sin(  slideItem.sineFract ),
            rotY: ( 15 * contentLength ) * Math.sin(  slideItem.sineFract ),
            rotZ: ( 5 * contentLength ) * Math.sin(  slideItem.sineFract ),
            trans: ( slideWidth * contentLength ) * Math.sin(  slideItem.sineFract ),
            perspective: ( 800 * contentLength ) * Math.sin(  slideItem.sineFract )
        }

        gsap.to( slideItem, 0.6, { transform: `rotateX(${ slideItem.transforms.rotX }deg) rotateY(${ slideItem.transforms.rotY }deg) rotateZ(${ slideItem.transforms.rotZ }deg) translateX(${ slideItem.transforms.trans }px)`, perspective: `${ slideItem.transforms.perspective }px`, ease: Power3.easeOut, delay: i * 0.0 });
 
        if( i == activeIndex && activeIndex > -1 && activeIndex < contentLength ){
            zIndexCtr++;
            slideItem.style.zIndex = zIndexCtr;
            gsap.to( slideItem.focusImg, 0.6, { opacity: 1, ease: Power3.easeOut, delay: i * 0.0 } );
            gsap.to( slideItem.tintImg, 0.6, { opacity: 0, ease: Power3.easeOut, delay: i * 0.0  } );
        } else { 
            slideItem.style.zIndex = zIndexCtr - Math.ceil( Math.abs( slideItem.sineFract * 10 )) ;
            gsap.to( slideItem.focusImg, 0.6, { opacity: 0, ease: Power3.easeOut, delay: i * 0.0 } );
            gsap.to( slideItem.tintImg, 0.6, { alpha: Math.abs( slideItem.sineFract ) * 1.5, ease: Power3.easeOut, delay: i * 0.0  } );
        }
    }

    currentContentItemIndex = activeIndex;
}


const pointerDown = ( evt ) => {
    //console.log( 'pointerDown ' + evt.clientX );
    slideStartX = evt.clientX;
    window.addEventListener( 'mousemove', mousemove );
    //slideItemsContainer.removeEventListener( 'pointerdown', pointerDown );
    window.addEventListener( 'pointerup', pointerUp );

}

const pointerUp = ( evt ) => {
    //console.log( 'pointerUp' );
    window.removeEventListener( 'mousemove', mousemove );

   
    //newScrollFraction = currentScrollFraction +  -0.4;// ( Math.floor( Math.abs( newScrollFraction  * 10 ) * 0.5 ) );
    //console.log( 'newScrollFraction ' + Math.round( newScrollFraction * 10 ) - 1  );

    //console.log( 'to nearest ' + Math.round( newScrollFraction / 0.2 ) * 0.2 );

    //console.log( 'fract ' + ( Math.floor(( newScrollFraction * 10 )) - 1 ) )

    let nearest = Math.round( newScrollFraction / 0.2 ) * 0.2;
    if( nearest > 0 ) nearest = 0;
    if( nearest < -( ( contentLength-1 ) * 2 ) * 0.1 ) nearest = -( ( contentLength-1 ) * 2 ) * 0.1;
    //console.log( 'NEAREST is ' + nearest );

    //currentScrollFraction = nearest;


    updateScrollVal( currentScrollFraction );

    let newIndex = Math.floor( ( Math.abs( currentScrollFraction ) * 0.5 ) * 10 )

    console.log( 'SideScrollManager.pointerUp() ', newIndex );

    //dispatcher.dispatchEvent( 'componentIndexChange', { index: newIndex } );



    //console.log( 'currentScrollFraction ' + currentScrollFraction );


}

const mousemove = ( evt ) => {

    let dist = evt.clientX - slideStartX;

    newScrollFraction = ( currentScrollFraction + dist / (window.innerWidth * 1 ) );

    updateScrollVal( newScrollFraction );

    console.log( 'pointerMove ' + newScrollFraction );
    let dragDist;
}

const roundToNearest = x => Math.round(x/0.2)*0.2;

const updateScroll = ( val ) => {
    let amt = val > 1 ? 1 : val;
}

const evalScrollValues = () => {

}



/* const getDist = ( x1, y1, x2, y2 ) => {
	
	let xs = x2 - x1, ys = y2 - y1;		
	
	xs *= xs;
	ys *= ys;
	 
	return Math.sqrt( xs + ys );
}; */

const resize = ( width, height ) => {
    console.log( 'SideScrollManager.resize()');

    if( width < 600 ){
        slideWidth = 256;
        updateSlidePos( currentContentItemIndex );
    } else if( width > 599 && width < 768 ){
        slideWidth = 360;
        updateSlidePos( currentContentItemIndex );
    } else if( width > 767 ){
        slideWidth = 480;
        updateSlidePos( currentContentItemIndex );
    }
    gsap.set( slideItemsContainer, { x: (window.innerWidth - slideWidth ) * 0.5 })
}

const SideScrollManager = {
    init,
    controlItemClickedHandler,
    resize,
    dispatcher,
    updateItemIndex,
}



export default SideScrollManager