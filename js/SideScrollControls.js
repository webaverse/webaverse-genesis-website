import { TweenLite, Power3, Power4, Linear } from 'gsap';
import EventDispatcher from './EventDispatcher';
//import SideNav from './SideNav';

let container;
let controlItemsArray = [];
let controlItemsLength;
let colorsArray = [ '#c15ed4', '#d25856', '#54a1e2', '#d761ec', '#5be2a7', '#f5e536', '#9df536', '#36f5b8', '#15feff', '#9751a9', '#de40ac' ];
let bar;
let isMobile;
let innerItemSizes = { focus: 20, blur: 9 };
let outerItemSizes = { focus: 26, blur: 13 };

const dispatcher = new EventDispatcher();

const init = ( params ) => {
    console.log( 'SideScrollControls.init()' );
    isMobile = params.isMobile;
    container = params.container;
    controlItemsLength = params.numItems;

    bar = document.createElement( 'div' );
    bar.className = 'side-scroll-controls-bar';

    container.appendChild( bar );

    for( let i = 0; i < controlItemsLength; i++ ){
        let controlItem = document.createElement( 'div' );
        controlItem.className = 'slide-scroll-control-item';
       
        let controlItemOuter = document.createElement( 'div' );
        controlItemOuter.className = 'side-scroll-controls-item-outer round';
        TweenLite.set( controlItemOuter, { width: outerItemSizes.blur, height: outerItemSizes.blur } );
        
        let controlItemInner = document.createElement( 'div' );
        controlItemInner.className = 'side-scroll-controls-item-inner round';
        TweenLite.set( controlItemInner, { width: innerItemSizes.blur, height: innerItemSizes.blur } );
        //controlItemInner.style.width = controlItemInner.style.height = innerItemSizes.blur;
        controlItemInner.style.backgroundColor = colorsArray[ i ];


        controlItem.appendChild( controlItemOuter );
        controlItem.appendChild( controlItemInner );
        
        controlItem.id = i;
        controlItem.isActive = true;
        
        if( i == 0 ){
            TweenLite.set( controlItemOuter, { width: outerItemSizes.focus, height: outerItemSizes.focus } );
            TweenLite.set( controlItemInner, { width: innerItemSizes.focus, height: innerItemSizes.focus } );
            controlItem.isActive = false;
        }
        
        container.appendChild( controlItem );
        controlItemsArray.push( controlItem );


        if( isMobile ){
            controlItem.addEventListener( 'touchend', itemClicked, false );
        } else {
            controlItem.addEventListener( 'click', itemClicked, false );
        }
        /* controlItem.addEventListener( 'mouseover', itemOver, false );
        controlItem.addEventListener( 'mouseout', itemOut, false ); */


    }

}

const itemClicked = ( evt ) => {

    if( !evt.target.isActive ) return;

    console.log( 'itemClicked ' + evt.target.id );

    let activeItem = controlItemsArray[ evt.target.id ]; 
    activeItem.isActive = false;
    TweenLite.to( activeItem.children[ 0 ], 0.3, { width: outerItemSizes.focus, height: outerItemSizes.focus, ease: Power3.easeOut } );
    TweenLite.to( activeItem.children[ 1 ], 0.3, { width: innerItemSizes.focus, height: innerItemSizes.focus, ease: Power3.easeOut } );

    for( let i = 0; i < controlItemsArray.length; i++ ){
        let ci = controlItemsArray[ i ];
        if( i != evt.target.id && ci.isActive == false ){
            ci.isActive = true;
            TweenLite.to( ci.children[ 0 ], 0.3, { width: outerItemSizes.blur, height: outerItemSizes.blur, ease: Power3.easeOut } );
            TweenLite.to( ci.children[ 1 ], 0.3, { width: innerItemSizes.blur, height: innerItemSizes.blur, ease: Power3.easeOut } );
        }
    }

    dispatcher.dispatchEvent( 'controlItemClicked', { index: evt.target.id } );
    
}

const itemOver = ( evt ) => {

    if( !evt.target.isActive ) return;

    //console.log( 'itemOver ' + evt.target.id );
}

const itemOut = ( evt ) => {

    if( !evt.target.isActive ) return;

    //console.log( 'itemOver ' + evt.target.id );
}

const pointerDown = ( evt ) => {
    /* console.log( 'pointerDown ' + evt.clientX )
    evt.target.addEventListener( 'mousemove', mousemove );
    scrollerStartXPos = contentInnerCont.getBoundingClientRect().left;
    console.log( 'startX ' + scrollerStartXPos )
    pointerDownXPos = evt.clientX; */
}

const pointerUp = ( evt ) => {
    /* console.log( 'pointerUp' );
    evt.target.removeEventListener( 'mousemove', mousemove ); */
}

/* const mousemove = ( evt ) => {
    let dragDist;

    TweenLite.set( contentInnerCont, { x: scrollerStartXPos + ( evt.clientX - pointerDownXPos ) } );
    
 
}
 */

const forceClick = ( index ) => {

    let activeItem = controlItemsArray[ index ]; 
    activeItem.isActive = false;
    TweenLite.to( activeItem.children[ 0 ], 0.3, { width: outerItemSizes.focus, height: outerItemSizes.focus, ease: Power3.easeOut } );
    TweenLite.to( activeItem.children[ 1 ], 0.3, { width: innerItemSizes.focus, height: innerItemSizes.focus, ease: Power3.easeOut } );

    for( let i = 0; i < controlItemsArray.length; i++ ){
        let ci = controlItemsArray[ i ];
        if( i != index && ci.isActive == false ){
            ci.isActive = true;
            TweenLite.to( ci.children[ 0 ], 0.3, { width: outerItemSizes.blur, height: outerItemSizes.blur, ease: Power3.easeOut } );
            TweenLite.to( ci.children[ 1 ], 0.3, { width: innerItemSizes.blur, height: innerItemSizes.blur, ease: Power3.easeOut } );
        }
    }

}


const updateScroll = ( val ) => {
    let amt = val > 1 ? 1 : val;
   
}

const SideScrollControls = {
    init,
    updateScroll,
    dispatcher,
    forceClick
}

export default SideScrollControls;