//import ScrollerManager from './SideScrollManager';

let container;
let topGrad;

const init = ( params ) => {
    
    container = params.container;
    topGrad = document.createElement( 'div' );
    topGrad.className = "content-top-grad";
    container.appendChild( topGrad );
}

const updateScroll = ( val ) => {
    //let amt = val > 1 ? 1 : val;
    topGrad.style.height =  ( window.innerHeight * 0.5 ) * val + 'px';
    topGrad.style.marginTop = -( ( window.innerHeight * 0.5 ) * val ) + 'px';
}

const Content = {
    init,
    updateScroll,
}

export default Content;