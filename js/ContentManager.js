import SideScrollManager from './SideScrollManager';
import { TweenLite, Power1, Power3, Linear, gsap } from 'gsap';

let container;
let topGrad;
let sideScrollComponentContainer;
let contentBackgroundImagesContainer;
let contentBackgroundImagesArray;

let contentBodiesArray;
let contentUpdateInProgress = false;
let lastIndexToUpdateContent = -1;

let imgsPath = './imgs/content-bg-imgs/';

let currentContentItemIndex = 0;
let prevContentItemIndex = 0;
//let newContentItemIndex = 0;
let contentItemsLength;
let animationOffsetX = 20;

let colorsArray = [ '#c15ed4', '#d25856', '#54a1e2', '#d761ec', '#5be2a7', '#f5e536', '#9df536', '#36f5b8', '#15feff', '#9751a9', '#de40ac' ];
let currentItem;
let nextArrow, prevArrow;

let iconsPath = './imgs/content-icons/';
let contentIcons = [
    "info-icon.png",
    "engine-icon.png",
    "street-icon.png",
    "partners-icon.png",
    "secret-icon.png",
]

let isMobile;

const bgImageAlphaVal = 1;

const init = ( params ) => {
    
    isMobile = params.isMobile;
    container = params.container;
    topGrad = document.createElement( 'div' );
    topGrad.className = "content-top-grad";
    container.appendChild( topGrad );

    // Scroll compoment
    sideScrollComponentContainer = document.querySelector( '.slide-scroll-component' );
    
    contentBackgroundImagesContainer = document.querySelector( '.content-bg-imgs-container' );
    // contentBackgroundImagesContainer.style.top = '800px';
    contentBackgroundImagesArray = document.querySelectorAll( '.content-bg-img' );
    
    console.log( 'ContentManager contentBackgroundImagesArray() ' + contentBackgroundImagesArray.length )
    
    for( let i = 0; i<contentBackgroundImagesArray.length; i++ ){
        let img = contentBackgroundImagesArray[ i ];
        let path = i < 10 ? ('content-bg-img-0' + i + '.jpg' ) : ( 'content-bg-img-' + i + '.jpg' );
        console.log( 'path ' + imgsPath + path )
        img.src = imgsPath + path;
        if( i == 0 ) {
            img.style.opacity = bgImageAlphaVal;
            //img.style.mixBlendMode = 'overlay';
        }
    }
    
    //console.log( ' imgs container height: ', contentBackgroundImagesContainer.getBoundingClientRect() ); 
    
    contentBodiesArray = document.querySelectorAll( '.content-scroll-item' );
    contentItemsLength = contentBodiesArray.length;

    SideScrollManager.init( {
        isMobile: isMobile,
        container: sideScrollComponentContainer,
        scrollLength: contentItemsLength,
    })

    SideScrollManager.dispatcher.addEventListener( 'componentIndexChange', sideScrollComponentIndexChangeHandler )

    for( let j = 0; j < contentItemsLength; j++ ){
        let bodyItem = contentBodiesArray[ j ];
        bodyItem.icon = bodyItem.querySelector( '.content-scroll-item-icon' );
        bodyItem.headline = bodyItem.querySelector( '.content-scroll-item-headline' );
        bodyItem.body = bodyItem.querySelector( '.content-scroll-item-body' );
        
        bodyItem.headline.style.color = colorsArray[ j ]

        
        bodyItem.icon.style.backgroundImage = 'url( ' + iconsPath + contentIcons[ j ] + ')';

        if( j == 0 ){
            currentItem = bodyItem;
            bodyItem.icon.style.opacity = 1;
            bodyItem.headline.style.opacity = 1;
            bodyItem.body.style.opacity = 1;
        } else {
            gsap.set( bodyItem.icon, { x: animationOffsetX, opacity: 0 } );
            gsap.set( bodyItem.headline, { x: animationOffsetX, opacity: 0 } );
            gsap.set( bodyItem.body, { x: animationOffsetX, opacity: 0 } ); 
        }
    }

    nextArrow = document.querySelector( '.content-scroll-next-arrow' );
    prevArrow = document.querySelector( '.content-scroll-prev-arrow' );


    if( isMobile ){
        nextArrow.addEventListener( 'touchend', nextArrowClickHandler );
        prevArrow.addEventListener( 'touchend', prevArrowClickHandler );
    } else {
        nextArrow.addEventListener( 'click', nextArrowClickHandler );
        prevArrow.addEventListener( 'click', prevArrowClickHandler ); 
    }
    

    
}

var clicked = false;

const nextArrowClickHandler = () => {
    if(!clicked) {
        clicked = true;
        currentContentItemIndex++;
        if( currentContentItemIndex > contentItemsLength-1 ) currentContentItemIndex = 0;
        console.log( 'NEXT CLICKED ', currentContentItemIndex )
        //console.log( 'ContentManager.nextArrowClickHandler() ' + currentContentItemIndex )
        //SideScrollManager.updateItemIndex( currentContentItemIndex  );
        SideScrollManager.changeSlideItemIndex( currentContentItemIndex );
        //console.log('*****************************  next clicked')
        //changeContentFromIndex( currentContentItemIndex );
        
        //updateBackgroundImageIndex( currentContentItemIndex + 1 )
    }

}

const prevArrowClickHandler = () => {

    if(!clicked) {
        clicked = true;
        currentContentItemIndex--;
        
        //
        if( currentContentItemIndex < 0 ) currentContentItemIndex = contentItemsLength-1;
        
        console.log( 'PREV CLICKED ', currentContentItemIndex );
        SideScrollManager.changeSlideItemIndex( currentContentItemIndex );
        // changeContentFromIndex( currentContentItemIndex );
    }
    
}


// *********** NEEDS WORK 

const changeContentFromIndex = ( index ) => {

    if(index<0){
        console.log('*****************************  index < 1')
        return;
    }
    if(true){
        try{
            throw new Error('Gaga');
        }catch(e){
            console.warn('*****************************   ',e);
        }
    }

    //implementhere
    if(!contentUpdateInProgress){
        contentUpdateInProgress = true;
        console.log('*****************************  setting in progress')
    }else{
        console.log('*****************************  Flushing',index)
        lastIndexToUpdateContent = index;
        return;
    }

    console.log( '*****************************  ContentManager.changeContentFromIndex() ' + index )

    let nextItem = contentBodiesArray[ index ];
    let nextDelayVal = 0.3;
    let totalDelay = nextDelayVal * 3;
    let __delay = 0.1;
    console.log( '*****************************  prev/next index ' + prevContentItemIndex  + ' ' + currentContentItemIndex);

    //return;

    if( index > prevContentItemIndex ){

        gsap.set( nextItem.icon, { x: animationOffsetX } )
        gsap.set( nextItem.headline, { x: animationOffsetX } )
        gsap.set( nextItem.body, { x: animationOffsetX } )

        gsap.to( currentItem.icon, __delay, { x: -animationOffsetX, opacity: 0, ease: Power3.easeIn } )
        gsap.to( currentItem.headline, __delay, { x: -animationOffsetX, opacity: 0, ease: Power3.easeIn, delay: 0.05 } )
        gsap.to( currentItem.body, __delay, { x: -animationOffsetX, opacity: 0, ease: Power3.easeIn, delay: 0.1 } )

        gsap.to( nextItem.icon, __delay, { x: 0, opacity: 1, ease: Power3.easeOut, delay: nextDelayVal } )
        gsap.to( nextItem.headline, __delay, { x: 0, opacity: 1, ease: Power3.easeOut, delay: nextDelayVal + 0.05 } )
        gsap.to( nextItem.body, __delay, { x: 0, opacity: 1, ease: Power3.easeOut, delay: nextDelayVal + 0.1, onComplete:function(){
            
            setTimeout(() => {
                console.log('*****************************  Popping out',lastIndexToUpdateContent)


                currentItem = nextItem;
                prevContentItemIndex = index;
                //
                updateBackgroundImageIndex( currentContentItemIndex );


                clicked = false;
                contentUpdateInProgress = false;
                if(lastIndexToUpdateContent > -1){
                    let tempIdx = lastIndexToUpdateContent;
                    lastIndexToUpdateContent = -1;
                    changeContentFromIndex(tempIdx);
                }                    
            }, totalDelay);

         }});

    } else {
        gsap.set( nextItem.icon, { x: -animationOffsetX } )
        gsap.set( nextItem.headline, { x: -animationOffsetX } )
        gsap.set( nextItem.body, { x: -animationOffsetX } )

        gsap.to( currentItem.icon, __delay, { x: animationOffsetX, opacity: 0, ease: Power3.easeIn } )
        gsap.to( currentItem.headline, __delay, { x: animationOffsetX, opacity: 0, ease: Power3.easeIn, delay: 0.05 } )
        gsap.to( currentItem.body, __delay, { x: animationOffsetX, opacity: 0, ease: Power3.easeIn, delay: 0.1 } )

        gsap.to( nextItem.icon, __delay, { x: 0, opacity: 1, ease: Power3.easeOut, delay: nextDelayVal } )
        gsap.to( nextItem.headline, __delay, { x: 0, opacity: 1, ease: Power3.easeOut, delay: nextDelayVal + 0.05 } )
        gsap.to( nextItem.body, __delay, { x: 0, opacity: 1, ease: Power3.easeOut, delay: nextDelayVal + 0.1, onComplete:function(){

            setTimeout(() => {
                console.log('*****************************  Popping out',lastIndexToUpdateContent)

                currentItem = nextItem;
                prevContentItemIndex = index;
                //
                updateBackgroundImageIndex( currentContentItemIndex );
            
                clicked = false;
                contentUpdateInProgress = false;
                if(lastIndexToUpdateContent > -1){
                    let tempIdx = lastIndexToUpdateContent;
                    lastIndexToUpdateContent = -1;
                    changeContentFromIndex(tempIdx);
                }                    
            }, totalDelay);

         }});
    }
}

const sideScrollComponentIndexChangeHandler = ( evt ) => {
    console.log( 'ContentManager.sideScrollComponentIndexChangeHandler() ' + evt.index );
    currentContentItemIndex = evt.index;

    //if( evt.index == currentContentItemIndex ) return;
    changeContentFromIndex( evt.index )
    

    //updateBackgroundImageIndex( evt.index );
}

const updateBackgroundImageIndex = ( index ) => {

    /* if( index > contentItemsLength ){
        index = 0
    } else if( index < 0 ){
        index = contentItemsLength;
    } */

    console.log( 'ContentManager.updateBackgroundImageIndex() ' + index );

    for( let i = 0; i<contentBackgroundImagesArray.length; i++ ){
        let img = contentBackgroundImagesArray[ i ];
        if( i == index ){
            gsap.to( img, 1, { opacity: bgImageAlphaVal, ease:Power3.easeOut } );
        } else {
            gsap.to( img, 1, { opacity: 0.0, ease:Power3.easeOut } );
        }
    }
}

const updateScroll = ( val ) => {
    contentBackgroundImagesContainer.style.display = 'block';
    //let amt = val > 1 ? 1 : val;
    topGrad.style.height =  ( window.innerHeight * 0.5 ) * val + 'px';
    topGrad.style.marginTop = -( ( window.innerHeight * 0.5 ) * val ) + 'px';
}


const resize = ( width, height ) => {
    SideScrollManager.resize( width, height )
    //console.log( ' imgs container height: ', contentBackgroundImagesContainer.getBoundingClientRect() ); 
    let bgImgsRect = contentBackgroundImagesContainer.getBoundingClientRect();
    let contHeight = bgImgsRect.y + bgImgsRect.height;

    //container.style.height = contHeight + 'px';

    //gsap.set( container, { height: 'auto'})
}

const Content = {
    init,
    updateScroll,
    resize,
}

export default Content;