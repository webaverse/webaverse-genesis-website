import SideScrollManager from './SideScrollManager';

let container;
let topGrad;
let sideScrollComponentContainer;

const init = ( params ) => {
    
    container = params.container;
    topGrad = document.createElement( 'div' );
    topGrad.className = "content-top-grad";
    container.appendChild( topGrad );

    // Scroll compoment
    sideScrollComponentContainer = document.querySelector( '.slide-scroll-component' );
    
    SideScrollManager.init( {
        container: sideScrollComponentContainer,
        scrollLength: 11,
    })
}

const updateScroll = ( val ) => {
    //let amt = val > 1 ? 1 : val;
    topGrad.style.height =  ( window.innerHeight * 0.5 ) * val + 'px';
    topGrad.style.marginTop = -( ( window.innerHeight * 0.5 ) * val ) + 'px';
}

const updateDragVal = ( val ) => {
    SideScrollManager.updateScrollVal( val );
}


const Content = {
    init,
    updateScroll,
    updateDragVal,
}

export default Content;