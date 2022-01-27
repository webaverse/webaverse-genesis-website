import { TweenLite, Power3 } from 'gsap';
import EventDispatcher from './EventDispatcher';
import * as WebaLogo from '../assets/logo_type.png'


let logo, logoImg;
let nav;
let uiDiv;
let uiTopContainer;
let uiBackground;
let ctaContainer;
let ctaInnerCont;
let ctaMessage;
let ctaButton;
let ctaLoadingMessage;
let isMobile;
let logoContainer, genesisContainer;
let genesisImgSrcsArr = [
    { img: 'imgs/genesis/genesis-01.png', offset: 65 },
    { img: 'imgs/genesis/genesis-02.png', offset: 75 },
    { img: 'imgs/genesis/genesis-03.png', offset: 75 },
    { img: 'imgs/genesis/genesis-04.png', offset: 62 },
    { img: 'imgs/genesis/genesis-05.png', offset: 65 },
    { img: 'imgs/genesis/genesis-06.png', offset: 69 },
    { img: 'imgs/genesis/genesis-07.png', offset: 76 },
    { img: 'imgs/genesis/genesis-08.png', offset: 79 },
    { img: 'imgs/genesis/genesis-09.png', offset: 54 },
    { img: 'imgs/genesis/genesis-10.png', offset: 85 }
];
let genesisImgsArr = [];
let ctaMessageStr = "This experience was designed for landscape viewing. If you're viewing this on a mobile device please switch to landscape orientation."
let currentGenesis;
let newGenesis;
let genesisCycleCtr = 0;
let spinner, spinnerContainer;
let spinnerAngle = 0;
let isLoading = false;
let cycleContainer;
let loadCyclesArray = [];
const dispatcher = new EventDispatcher();
let currentLoaderSprite, newLoaderSprite;
let loaderCycleCtr = 0;

let audioIconContainer;
let audioIconOn;
let audioIconOff;
let audioOn = false;
let audioHasInit = false;
let preloadCtr = 0;
let loadbarAniObj = { width: 0 };
let loadbarCont, loadbarDiv;
let loadGenesisInterval;
const navCols = ['#1dff72', '#49c88b', '#8651cb', '#b431c9', '#e900e6'];
let splashCalled = false;


const init = (params) => {
    console.log('ui.init()');

    isMobile = params.isMobile;

    uiBackground = document.createElement('div');
    uiBackground.className = 'ui-background';

    uiTopContainer = document.createElement('div');
    uiTopContainer.className = 'ui-top-cont';

    uiDiv = document.createElement('div');
    uiDiv.className = 'ui-cont';

    logoImg = document.createElement('img');
    logoImg.src = './imgs/logo.gif';
    logoImg.className = isMobile ? 'ui-logo-m' : 'ui-logo';

    genesisContainer = document.createElement('div');
    genesisContainer.className = "ui-genesis-container";

    logoContainer = document.createElement('div');
    logoContainer.className = "ui-logo-container"

    logoContainer.appendChild(logoImg);
    logoContainer.appendChild(genesisContainer);


    let webaImage = document.createElement('img')
    webaImage.src = WebaLogo;
    webaImage.className = isMobile ? 'weba-logo-m' : 'weba-logo';
    let webaImageContainer = document.createElement('div');
    webaImageContainer.className = "weba-logo-container"
    webaImageContainer.appendChild(webaImage);

    /* nav = document.createElement( 'div' );
    nav.className = 'ui-nav'; */



    /* let navArr = [ 'App', 'Docs', 'Discord', 'Twitter', 'Blog' ];
    let linksArr = [ 
        'https://app.webaverse.com/',
        'https://webaverse.notion.site/Webaverse-3a36b223e39b4f94b3d1f6921a4c297a',
        'https://discord.gg/HxdjCDyq58',
        'https://twitter.com/webaverse',
        'https://webaverse.ghost.io/'
    ];
    
    for( let i = 0; i<navArr.length; i++ ){
        let navItem = document.createElement( 'p' );
        navItem.className = isMobile ? 'ui-nav-item-m' : "ui-nav-item";
        navItem.innerText = navArr[ i ].toUpperCase();
        nav.appendChild( navItem );

        navItem.addEventListener( 'click', function(){
            window.open(linksArr[ i ], '_blank');
        })

        if( i == navArr.length-1 ){
            navItem.style.marginRight = 0;
        }

        if( !isMobile ){
            navItem.addEventListener( 'mouseover', function(){
                TweenLite.killTweensOf( navItem );
                TweenLite.to( navItem, 0.1, { color: navCols[ i ], ease:Power3.easeOut })
            })
            navItem.addEventListener( 'mouseout', function(){
                TweenLite.killTweensOf( navItem );
                TweenLite.to( navItem, 0.6, { color: '#ffffff', ease:Power3.easeOut })
            })
        }   
    } 

    
    let alphaCont = document.createElement( 'div' );
    alphaCont.className = isMobile ? 'ui-alpha-m' : 'ui-alpha';
    //alphaImg.scr = "./assets/imgs/alpha/alpha.jpg"
    nav.appendChild( alphaCont );
    let alphaTxt = document.createElement( 'p' );
    alphaTxt.className = "ui-alpha-text";
    alphaTxt.innerText = 'ALPHA';
    alphaCont.appendChild( alphaTxt );*/

    ctaContainer = document.createElement('div');
    ctaContainer.className = 'ui-cta-container';

    ctaInnerCont = document.createElement('div');
    ctaInnerCont.className = 'ui-cta-inner-container';

    ctaLoadingMessage = document.createElement('p');
    ctaLoadingMessage.className = 'ui-cta-lopading-message';
    ctaLoadingMessage.innerHTML = "LOADING";
    ctaInnerCont.appendChild(ctaLoadingMessage);

    /*  spinnerContainer = document.createElement( 'div' );
    spinner = document.createElement( 'img' );
    spinner.src = "./imgs/loader/spinner.png";

    spinnerContainer.appendChild( spinner );
    ctaInnerCont.appendChild( spinnerContainer );
 */

    loadbarCont = document.createElement('div');
    loadbarCont.className = 'ui-loadbar-cont';
    ctaInnerCont.appendChild(loadbarCont);

    loadbarDiv = document.createElement('div');
    loadbarDiv.className = 'ui-load-bar';
    loadbarCont.appendChild(loadbarDiv);

    //isLoading = true;

    cycleContainer = document.createElement('div');

    for (let i = 0; i < genesisImgSrcsArr.length; i++) {
        let img = document.createElement('img');

        img.src = genesisImgSrcsArr[i].img;
        img.className = "ui-genesis-img";

        loadCyclesArray.push(img);

        cycleContainer.appendChild(img);

        if (i == 0) {
            currentLoaderSprite = img;
            TweenLite.set(img, { y: 0, x: -genesisImgSrcsArr[i].offset });
        } else {
            TweenLite.set(img, { y: -10, x: -genesisImgSrcsArr[i].offset, alpha: 0 })
        }
    }

    ctaInnerCont.appendChild(cycleContainer);
    cycleContainer.style.marginTop = "10px"

    audioIconContainer = document.createElement('div');
    audioIconContainer.className = "ui-audio-toggle-container";

    audioIconOn = document.createElement('img');
    audioIconOn.className = 'ui-audio-icon';
    audioIconOn.src = './imgs/audio/audio-on-icon.png';

    audioIconOff = document.createElement('img');
    audioIconOff.className = 'ui-audio-icon';
    audioIconOff.src = './imgs/audio/audio-off-icon.png';
    audioIconOff.style.opacity = 1;

    audioIconContainer.appendChild(audioIconOn);
    audioIconContainer.appendChild(audioIconOff);

    uiDiv.appendChild(uiBackground);
    uiDiv.appendChild(uiTopContainer);
    uiDiv.appendChild(ctaContainer);
    ctaContainer.appendChild(ctaInnerCont)
    uiTopContainer.appendChild(logoContainer)
    uiTopContainer.appendChild(webaImageContainer);
    //uiTopContainer.appendChild( nav );
    uiTopContainer.appendChild(audioIconContainer);
    document.querySelector(".app-container").appendChild(uiDiv);

    createGenesis();
    loadGenesisInterval = setTimeout(cycleLoader, 2500);

}

const toggleAudioIcon = function() {

    audioOn = !audioOn;

    //console.log( 'audioOn ' + audioOn + ' ' + audioHasInit );

    if (audioOn) {
        TweenLite.to(audioIconOff, 0.3, { opacity: 0 });
        TweenLite.to(audioIconOn, 0.3, { opacity: 1 });
    } else {
        TweenLite.to(audioIconOff, 0.3, { opacity: 1 });
        TweenLite.to(audioIconOn, 0.3, { opacity: 0 });
    }

    dispatcher.dispatchEvent('toggleAudio', { audioToggle: audioOn });


}

const cycleLoader = () => {

    if (!isLoading) return;

    loaderCycleCtr++;

    //console.log( 'cycle loader')

    if (loaderCycleCtr >= loadCyclesArray.length) loaderCycleCtr = 0;
    newLoaderSprite = loadCyclesArray[loaderCycleCtr];

    TweenLite.set(newLoaderSprite, { y: -10, alpha: 0 })
    TweenLite.to(currentLoaderSprite, 0.3, { y: 10, alpha: 0, ease: Power3.easeIn });

    TweenLite.to(newLoaderSprite, 0.5, {
        y: 0,
        alpha: 1,
        ease: Power3.easeOut,
        delay: 0.2,
        onComplete: function() {
            currentLoaderSprite = newLoaderSprite;
            loadGenesisInterval = setTimeout(cycleLoader, 2500);
        }
    });

}

const hideSplash = () => {

        if (splashCalled) return;

        loadCyclesArray.forEach(img => {
                //TweenLite.killTweensOf( img );
                TweenLite.to(img, 0.5, { alpha: 0, y: 10, ease: Power3.easeIn })
            })
            //return;

        clearTimeout(loadGenesisInterval);

        /* TweenLite.to( cycleContainer, 0.5, { alpha: 0, y:10, ease: Power3.easeOut} )
        TweenLite.to( currentLoaderSprite, 0.5, { alpha: 0, y:10, ease: Power3.easeOut} ); */

        //return;



        TweenLite.to(loadbarCont, 0.5, { opacity: 0, y: 10, delay: 0.2, ease: Power3.easeIn })
            // TweenLite.to( spinnerContainer, 0.5, { opacity: 0, y:10, delay: 0.2, ease: Power3.easeIn} )

        TweenLite.to(ctaLoadingMessage, 0.5, {
            opacity: 0,
            y: 10,
            ease: Power3.easeIn,
            delay: 0.4,
            onComplete: function() {
                isLoading = false;

                uiTopContainer.style.display = 'block';

            }
        });

        TweenLite.to(uiBackground, 1, {
            opacity: 0,
            ease: Power3.easeOut,
            delay: 0.9,
            onComplete: function() {
                uiBackground.style.display = 'none';
            }
        });


        TweenLite.to(uiTopContainer, 1, {
            opacity: 1,
            ease: Power3.easeOut,
            delay: 1.5,
            onComplete: function() {
                //uiDiv.removeChild( ctaContainer )
                //uiDiv.removeChild( uiBackground )
                //dispatcher.dispatchEvent( 'uiComplete' );
                //cycleGenesis();
                setTimeout(cycleGenesis, 5000);
            }
        });





    }
    /* 
    const showUI = () => {

        uiTopContainer.style.display = 'block'; 
        
        TweenLite.to(uiBackground, 1, { opacity: 0, ease: Power3.easeOut, delay: 0.5, onComplete: function(){
            uiBackground.style.display = 'none'; 
        } } );
        TweenLite.to(uiTopContainer, 1, { opacity:1, ease: Power3.easeOut, delay: 1, onComplete: function() {
            //uiDiv.removeChild( ctaContainer )
            //uiDiv.removeChild( uiBackground )
            setTimeout( cycleGenesis, 5000  );
            dispatcher.dispatchEvent( 'uiComplete' );
        }  } );

        
    }

     */

const forceComplete = () => {
    //showUI();
}

const createGenesis = () => {

    for (let i = 0; i < genesisImgSrcsArr.length; i++) {
        let img = document.createElement('img');
        //console.log( 'genesis img path : ' + genesisImgSrcsArr[ i ])
        img.src = genesisImgSrcsArr[i].img;
        img.className = "ui-genesis-img";

        genesisImgsArr.push(img);

        genesisContainer.appendChild(img);

        if (i != 0) {
            TweenLite.set(img, { y: -10, alpha: 0 })
        } else {
            currentGenesis = img;
            TweenLite.set(img, { y: 0 })
        }
    }
}

const cycleGenesis = () => {

    genesisCycleCtr++;

    if (genesisCycleCtr >= genesisImgsArr.length) genesisCycleCtr = 0;
    newGenesis = genesisImgsArr[genesisCycleCtr];
    //console.log( 'newGenesis ' + newGenesis + genesisCycleCtr ) 

    TweenLite.set(newGenesis, { y: -10, alpha: 0, ease: Power3.easeOut, delay: 0 });

    TweenLite.to(currentGenesis, 0.3, { y: 10, alpha: 0, delay: 0, ease: Power3.easeIn });

    TweenLite.to(newGenesis, 0.5, {
        y: 0,
        alpha: 1,
        ease: Power3.easeOut,
        delay: 0.2,
        onComplete: function() {
            //cycleGenesis();
            currentGenesis = newGenesis;

            setTimeout(cycleGenesis, 3000);
        }
    });

    //cycleGenesis();

}

const update = () => {
    if (isLoading) {
        //console.log( 'UI.update()')
        /*  spinnerAngle += 16.0;
         spinner.style.transform = 'rotate(' + spinnerAngle + 'deg)'; */
    }
}

const toggleAudioIconOn = () => {

    TweenLite.to(audioIconOff, 0.3, { opacity: 0 });
    TweenLite.to(audioIconOn, 0.3, { opacity: 1 });
    audioOn = true;

    setTimeout(addAudioListener, 1000);

    //console.log( 'UI toggleAudioIconOn();')
}

const addAudioListener = () => {
    audioIconContainer.addEventListener('click', function() {
        toggleAudioIcon();
    })
}



const updatePreload = (perc) => {
    preloadCtr += perc;
    //console.log( '********** UI.updatePreload() ' + preloadCtr )

    TweenLite.to(loadbarAniObj, 1, {
        width: (100 * preloadCtr),
        ease: Power3.easeOut,
        onUpdate: function() {
            loadbarDiv.style.width = loadbarAniObj.width + 'px';
            if (loadbarAniObj.width == 100) {
                hideSplash();
                splashCalled = true;
            }
        }
    })
}

const UI = {
    init,
    dispatcher,
    forceComplete,
    update,
    toggleAudioIconOn,
    toggleAudioIcon,
    updatePreload
}

export default UI;