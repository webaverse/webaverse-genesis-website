import { TweenLite, Power1, Power4, Linear } from 'gsap';
//import SideNav from './SideNav';

let container;

let scrollItemsArray;

let imgPath = './imgs/content-scroll-imgs/'
let scrollItemsLength;

let scrollPercent = 0;
let focusCtr = 0;
let startXpos;

let pointerDownXPos;
let contentInnerCont;

let scrollerStartXPos;

let scrollContentOriginalXPos;
let scrollContentCurrentXPos;

const init = ( params ) => {
    
    container = params.container;

    scrollItemsArray = container.querySelectorAll( '.drag-scroll-item' );
    scrollItemsLength = scrollItemsArray.length;

    contentInnerCont = container.querySelector( '.content-scroll-inner-cont' );

    startXpos = -( 480 * 0.5 );
    //console.log( 'ScrollerManager.init() ' + scrollItemsLength );

    for( let i = 0; i < scrollItemsLength; i++ ){
        let scrollItem = scrollItemsArray[ i ];
        let focusImg = scrollItem.children[ 0 ];
        let blurImg = scrollItem.children[ 1 ];
        
        /* focusImg.src = imgPath + ( ( i < 9 ) ? '0' + i + '-focus.jpg' : i + '-focus.jpg' );
        blurImg.src = imgPath + ( ( i < 9 ) ? '0' + i + '-blur.jpg' : i + '-blur.jpg' ); */
        
        focusImg.src = imgPath + ( ( i < 9 ) ? '0' + 0 + '-focus.jpg' : 0 + '-focus.jpg' );
        blurImg.src = imgPath + ( ( i < 9 ) ? '0' + 0 + '-blur.jpg' : 0 + '-blur.jpg' );

        //scrollItem.style.top = ( i * 10 ) + 'px';
        TweenLite.set( scrollItem, { y: ( i * 20 ), x: startXpos + ( i * 480 ) });

        container.addEventListener( 'pointerdown', pointerDown );
        container.addEventListener( 'pointerup', pointerUp );

        scrollItem.style.transform = '( perspective("800px") )';
        /* rotateY(25deg) scale(0.9)
        rotateX(10deg); */
        
        //document.getElementById('my-image').ondragstart = function() { return false; };
        if( i != 0 ) focusImg.style.opacity = 0;
        
    }

    scrollContentOriginalXPos = contentInnerCont.getBoundingClientRect().left - 480;

}

const pointerDown = ( evt ) => {
    console.log( 'pointerDown ' + evt.clientX )
    evt.target.addEventListener( 'mousemove', mousemove );
    scrollerStartXPos = contentInnerCont.getBoundingClientRect().left;
    console.log( 'startX ' + scrollerStartXPos )
    pointerDownXPos = evt.clientX;
}

const pointerUp = ( evt ) => {
    console.log( 'pointerUp' );
    evt.target.removeEventListener( 'mousemove', mousemove );
}

const mousemove = ( evt ) => {
    let dragDist;

    TweenLite.set( contentInnerCont, { x: scrollerStartXPos + ( evt.clientX - pointerDownXPos ) })

    //scrollContentCurrentXPos = contentInnerCont.getBoundingClientRect().left;

    //console.log( 'SCROLL STATS - originX: ' + scrollContentOriginalXPos + '  cuurentX: ' + scrollContentCurrentXPos );
    
    /* if( evt.clientX < pointerDownXPos ) {
        dragDist = -( pointerDownXPos - evt.clientX );
        //TweenMax.to( contentInnerCont, )
        TweenLite.set( contentInnerCont, { x: scrollerStartXPos + dragDist })
        console.log( 'mousemove MINUS ' + dragDist );
    } else {
        dragDist = evt.clientX - pointerDownXPos;
        TweenLite.set( contentInnerCont, { x: scrollerStartXPos + dragDist })

        console.log( 'mousemove PLUS ' + dragDist );
    } */
    
 
}



const updateScroll = ( val ) => {
    let amt = val > 1 ? 1 : val;
   
}

const ScrollerManager = {
    init,
    updateScroll,
}

export default ScrollerManager;