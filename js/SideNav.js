import { TweenLite, Power1, Power4, Linear } from 'gsap';

let sideNavContainer;
let sectionsLength;
let buttonsArray = [];

const init = ( params ) => {
    console.log( 'SideNav.init()' );
    sectionsLength = params.sections.length;

    sideNavContainer = document.createElement( 'div' );
    sideNavContainer.className = "ui-side-nav-cont";
    document.body.appendChild( sideNavContainer );

    let navHeight = 0;
    
    for( let i = 0; i < sectionsLength; i++ ){
        let navItem = document.createElement( 'div' );
        navItem.className = 'ui-side-nav-item';
        sideNavContainer.appendChild( navItem );
        navHeight += 20;
    }
    
    console.log( "calc(100% - " + Math.round( navHeight * 0.5 ) + 'px)' )
    sideNavContainer.style.top = "calc(50% - " + Math.round( navHeight * 0.5 ) + 'px)';


    
}

const showNav = () => {
    sideNavContainer.style.display = "block";
}

const hideNav = () => {
    sideNavContainer.style.display = "none";
}

const SideNav = {
    init,
    showNav,
    hideNav,

}

export default SideNav;

