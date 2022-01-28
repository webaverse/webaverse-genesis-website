import EventDispatcher from './EventDispatcher';
import { gsap, Power3 } from 'gsap';


let closeButton;
let formElement;
let submitButton;
let nameInputText;
let inputPrompt;
const dispatcher = new EventDispatcher();

const init = () => {

    if (!localStorage.getItem('id'))
        localStorage.setItem('id', Date.now() + '' + Math.floor(Math.random() * 100000));

    closeButton = document.querySelector( '.ui-qr-form-close' );
    formElement = document.querySelector('#qrform')
    submitButton = document.querySelector( '.form-submit-button' )
    nameInputText = document.querySelector('#name-input');
    inputPrompt = document.querySelector('.ui-enter-text');


}

const invokeForm = () => {
    closeButton.addEventListener( 'click', hideForm );
    submitButton.addEventListener( 'click', submitForm );

    let name = localStorage.getItem('name');
    if (name) {
        window.location.href = `https://qr.webaverse.com/weba/${encodeURIComponent(name.replace(/\./g,'_'))}-${localStorage.getItem('id')}`
        return;
    }
    formElement.style.display = 'flex';

    document.querySelector('#qrform > div > form > input[type="text"]').focus();
    gsap.killTweensOf( formElement );
    
    gsap.set( inputPrompt, { y: -10, alpha: 0 } );
    gsap.set( nameInputText, { y: -10, alpha: 0 } );
    gsap.set( submitButton, { y: -10, alpha: 0 } );

    let openAniSpeed = 0.3;
    
    gsap.to( formElement, openAniSpeed, { alpha: 1, ease: Power3.easeOut } );

    gsap.to( inputPrompt, 0.3, { y: 0, alpha: 1, ease: Power3.easeOut, delay: openAniSpeed } );
    gsap.to( nameInputText, 0.3, { y: 0, alpha: 1, ease: Power3.easeOut, delay: openAniSpeed + 0.1 } );
    gsap.to( submitButton, 0.3, { y: 0, alpha: 1, ease: Power3.easeOut, delay: openAniSpeed + 0.2 } );

}

const hideForm = () => {
    submitButton.removeEventListener( 'click', submitForm );
    submitButton.removeEventListener( 'click', hideForm );

    document.querySelector('#qrform').classList.remove('open');
    dispatcher.dispatchEvent( 'formClosed' );
    gsap.to( formElement, 0.3, { alpha: 0, ease: Power3.easeOut, onComplete: function(){
        formElement.style.display = 'none';
    } } );
}

const submitForm = () => {
    let input = document.querySelector('#name-input').value;
    if ( input.length > 1 ) {
        localStorage.setItem('name', input);
        window.location.href = `https://qr.webaverse.com/weba/${encodeURIComponent(input.replace(/\./g,'_'))}-${localStorage.getItem('id')}`
    }
}


const TabletManager = {
    init,
    invokeForm,
    hideForm,
    dispatcher,
};

export default TabletManager;