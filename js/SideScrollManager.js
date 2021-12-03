import { TweenLite, Power1, Power3, Linear, gsap } from 'gsap';
import SideScrollControls from './SideScrollControls';
// import ContentManager from './ContentManager';

let container;
let controlsContainer;
let slideItemsContainer;
let imgPath = './imgs/content-scroll-imgs/'
let scrollItemsLength;
let scrollItemsArray;

let globalCheck=0;

let slideItemsArray = [];
let currentIndex = 1;
let slideStartX;
let Image;

let sectionImgs = [ 
    { focus: 'info_sm.png', blur:'info_alt_sm.png' },
    { focus: 'engine_sm.png', blur:'engine_alt_sm.png' },
    { focus: 'street_sm.png', blur:'street_alt_sm.png' },
    { focus: 'partner_sm.png', blur:'partner_alt_sm.png' },
    { focus: 'secret_sm.png', blur:'secret_alt_sm.png' },
]
let zIndexCtr = 99;
let contentLength = sectionImgs.length;

var scrollIndex

const init = ( params ) => {
    
    console.log( 'SideScrollManager.init()' );
    FlexSlider.init();
    
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
        // focusImg.onclick=()=>
        // {
        //     console.log('HELOO MATHAFAKA')
        // }
        let tintImg = document.createElement( 'img' );
        tintImg.className = 'slide-scroll-img';
        tintImg.onclick=()=>
        {
            console.log(i)
            if (currentIndex!=i+1)
            {
            currentIndex = i+1
            FlexSlider.gotoNext();
            FlexSlider.scrollValChange()
            }
        }

        blurImg.src = imgPath + sectionImgs[ i ].blur;
        focusImg.src = imgPath + sectionImgs[ i ].focus;
        tintImg.src = imgPath + 'tint-img.png';

        slideItem.blurImg = blurImg;
        slideItem.focusImg = focusImg;
        slideItem.tintImg = tintImg;

        slideItem.appendChild( blurImg );
        slideItem.appendChild( focusImg );
        slideItem.appendChild( tintImg );

        slideItem.sineFract = i / contentLength;
        slideItem.originFract = i / contentLength;
        console.log( 'SineFract ' +  slideItem.sineFract )


        slideItem.transforms = { 
            rotX: 0 * Math.sin(  slideItem.sineFract ),
            rotY: ( 15 * contentLength ) * Math.sin(  slideItem.sineFract ),
            rotZ: ( 5 * contentLength ) * Math.sin(  slideItem.sineFract ),
            trans: ( 480 * contentLength ) * Math.sin(  slideItem.sineFract ),
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

        


        slideItemsContainer.appendChild( slideItem )
        slideItemsArray.push( slideItem );
    }

    gsap.set( slideItemsContainer, { x: (window.innerWidth - 480 ) * 0.5 })
}

const controlItemClickedHandler = ( evt ) => {
    console.log( 'itemClicled in Manager ' + evt.id );

    var move = (parseInt(evt.id)+1) - (currentIndex);
    console.log("\n\n move: ",move ,"currentIndex : ",currentIndex,"clicked index : ",parseInt(evt.id)+1)

    currentIndex=parseInt(evt.id)+1
    if (move>0)
        {
            FlexSlider.gotoNext();
        }
        else
        {
            FlexSlider.gotoNext2();
        }
    
    let newIndex = -( evt.id * 0.2 );
    console.log( 'new index ' + newIndex );

    for( let i = 0; i<slideItemsArray.length; i++ ){
        let slideItem = slideItemsArray[ i ];

        slideItem.sineFract = slideItem.originFract + newIndex;

        slideItem.transforms = { 
            rotX: 0 * Math.sin(  slideItem.sineFract ),
            rotY: ( 15 * contentLength ) * Math.sin(  slideItem.sineFract ),
            rotZ: ( 5 * contentLength ) * Math.sin(  slideItem.sineFract ),
            trans: ( 480 * contentLength ) * Math.sin(  slideItem.sineFract ),
            perspective: ( 800 * contentLength ) * Math.sin(  slideItem.sineFract )
        }

        gsap.to( slideItem, 0.6, { transform: `rotateX(${ slideItem.transforms.rotX }deg) rotateY(${ slideItem.transforms.rotY }deg) rotateZ(${ slideItem.transforms.rotZ }deg) translateX(${ slideItem.transforms.trans }px)`, perspective: `${ slideItem.transforms.perspective }px`, ease: Power3.easeOut, delay: i * 0.0 });

        if( i == evt.id ){
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
}

const change = ( value ) => {
    
    let newIndex = -( value * 0.2 );
    console.log( 'new index ' + newIndex );

    for( let i = 0; i<slideItemsArray.length; i++ ){
        let slideItem = slideItemsArray[ i ];

        slideItem.sineFract = slideItem.originFract + newIndex;

        slideItem.transforms = { 
            rotX: 0 * Math.sin(  slideItem.sineFract ),
            rotY: ( 15 * contentLength ) * Math.sin(  slideItem.sineFract ),
            rotZ: ( 5 * contentLength ) * Math.sin(  slideItem.sineFract ),
            trans: ( 480 * contentLength ) * Math.sin(  slideItem.sineFract ),
            perspective: ( 800 * contentLength ) * Math.sin(  slideItem.sineFract )
        }

        gsap.to( slideItem, 0.6, { transform: `rotateX(${ slideItem.transforms.rotX }deg) rotateY(${ slideItem.transforms.rotY }deg) rotateZ(${ slideItem.transforms.rotZ }deg) translateX(${ slideItem.transforms.trans }px)`, perspective: `${ slideItem.transforms.perspective }px`, ease: Power3.easeOut, delay: i * 0.0 });

        if( i == evt.id ){
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
}


const FlexSlider = {
    btn1:0,
    btn2:0,
	// total no of items
	num_items: document.querySelectorAll(".slider-item").length,
	
	// position of current item in view
	current: 1,

	init: function() {
		// set CSS order of each item initially
        console.log("CNDLE---5")
	

		this.addEvents();
	},
    imgChange:function(){
        console.log("\n\nIMG CHNSGE",this.current)
        if(this.current==1){
            document.querySelector(".content-scroller").style.backgroundImage= `url('http://www.freeimageslive.com/galleries/light/pics/light00002g.jpg')`;
        }
        else if(this.current==2){
            document.querySelector(".content-scroller").style.backgroundImage= `url('http://www.freeimageslive.com/galleries/home/diningroom/pics/diningroom_table.jpg')`;
    
        }
        else if(this.current==3){
            console.log("curr_ ")
            document.querySelector(".content-scroller").style.backgroundImage= `url('./imgs/content-bg-imgs/content-bg-img-00.jpg')`;
    
            
        }else if(this.current==4){
            document.querySelector(".content-scroller").style.backgroundImage= `url('http://www.freeimageslive.com/galleries/home/diningroom/pics/diningroom_table.jpg')`
            
        }else if(this.current==5){
            document.querySelector(".content-scroller").style.backgroundImage= `url('http://www.freeimageslive.com/galleries/light/pics/light00002g.jpg')`;
    
            
        }else if(this.current==6){
            document.querySelector(".content-scroller").style.backgroundImage= `url('http://www.freeimageslive.com/galleries/light/pics/light01043.jpg')`;
    
            
        }else if(this.current==7){
            document.querySelector(".content-scroller").style.backgroundImage= `url('http://www.freeimageslive.com/galleries/light/pics/light00002g.jpg')`;
    
            
        }
        
    }, 
    scrollValChange :function(){
        if(currentIndex==1){
            updateScrollVal(0)

        }
        else if(currentIndex==2){
            updateScrollVal(-0.2)

        }
        else if(currentIndex==3){
            updateScrollVal(-0.4)

        }
        else if(currentIndex==4){
            updateScrollVal(-0.6)

        }
        else {
            updateScrollVal(-0.8)

        }

    },
	addEvents: function() {
		var that = this;

		// click on move item button
		document.querySelector("#move-button").addEventListener('click', () => {
            this.btn2=1;
            this.btn1=0
            console.log("currindex: ",currentIndex)
            currentIndex=(currentIndex+1)%5
            console.log("currindex: after  ",currentIndex)
            this.scrollValChange()
            
            this.gotoNext();
		});

		// after each item slides in, slider container fires transitionend event
		document.querySelector("#slider-container").addEventListener('transitionend', () => {
            
//             if(globalCheck>0){
//                 // document.querySelector("#slider-container").classList.remove('slider-container-transition3');
//                 // document.querySelector("#slider-container").style.transform = 'translateX(50%)';
//                 // document.querySelector("#slider-container").classList.remove('slider-container-transition');

//                 console.log("\n\n\n GOVAL")
//                 document.querySelector("#slider-container").style.transform = 'translateX(-100%)';

// globalCheck=0

//             }
//             else{
            console.log("\n\nTRANS END")

			this.changeOrder();
            // }
		});
        document.querySelector("#move-button-left").addEventListener('click', () => {
            console.log("Button prev")
            this.btn1=1
            this.btn2=0
            console.log("curr KKKKHHH : ",currentIndex)
            if(currentIndex>0)
                {
                    currentIndex = currentIndex-1
                }
            console.log("curr KKKKHHH : ",currentIndex)

            this.scrollValChange()

			this.gotoNext2();
		});

	},
   
	changeOrder: function() {
        // console.log("Xcurr: ",this.current,"Xnum_ : ",this. num_items)
        // console.log("pointer dowen")
        // pointerDown()
        var b = parseInt(currentIndex)
        let val_in= b;
        // console.log("(change order )currentIndex: ",currentIndex,"val_in : ",val_in)
        if(val_in==0)
        {
            currentIndex=this.num_items
            val_in=this.num_items
        }
        // console.log(val_in,"dddd")
        if(this.btn2==1){
             console.log("if")
        // console.log("curr: ",this.current,"num_ IFFFFF : ",this. num_items)//left btn
        if(this.current == this.num_items)
        this.current = 1;
    else 
        this.current++;

    let order = 1;

    // change order from current position till last
    for(let i=val_in; i<=this.num_items; i++) {
        // console.log("Order: ",order , "i: ",i)
        document.querySelector(".slider-item[data-position='" + i + "']").style.order = order;
        order++;
    }

    // change order from first position till current
    for(let i=val_in-1; i>=1; i--) {
        console.log("Order: ",order , "i: ",i)

        document.querySelector(".slider-item[data-position='" + i + "']").style.order = order;
        order++;
    }

    // translate back to 0 from -100%
    document.querySelector("#slider-container").style.transform = 'translateX(0)';
        document.querySelector("#slider-container").classList.remove('slider-container-transition');

    }
        else{
            console.log("else")
        // console.log("curr: ",this.current,"2num_ : ",this. num_items)//right btn
        // console.log("curr: ",this.current,"num_ : ",this. num_items)//left btn
        if(this.current == 1)
        this.current = this.num_items;
    else 
        this.current--;

    let order = 1;


//         }
for(let i=val_in; i<=this.num_items; i++) {
    console.log("Order: ",order , "i: ",i)
    document.querySelector(".slider-item[data-position='" + i + "']").style.order = order;
    order++;
}

// change order from first position till current
for(let i=val_in-1; i>=1; i--) {
    console.log("Order: ",order , "i: ",i)

    document.querySelector(".slider-item[data-position='" + i + "']").style.order = order;
    order++;
}
document.querySelector("#slider-container").classList.remove('slider-container-transition');

document.querySelector("#slider-container").style.transform = 'translateX(0)';
// if(globalCheck==0){

// }

// globalCheck=1;

//     }



  


}
this.btn1=0;

this.btn2=0;

		
	},


	


	gotoNext: function() {
        // console.log("\n\nNEXT")
		document.querySelector("#slider-container").classList.add('slider-container-transition');
		document.querySelector("#slider-container").style.transform = 'translateX(-100%)';
        
        // document.querySelector("#slider-container").style.transform = 'transition: transform 0.7s';



        this.imgChange()

       

	},
    gotoNext2: function() {
        // console.log("\n\nNEXT2")
       
        // document.querySelector("#slider-container").classList.add('slider-container-transition');
        document.querySelector("#slider-container").classList.add('slider-container-transition');

        document.querySelector("#slider-container").style.transform = 'translateX(-100%)';

        // document.querySelector("#slider-container").classList.remove('slider-container-transition');



        this.imgChange()
        
	}
};

const updateScrollVal = ( val ) => {

    let newIndex = ( Math.floor( Math.abs( val  * 10 ) * 0.5 ) );
    
    SideScrollControls.forceClick( newIndex );

    let activeIndex = Math.round( Math.abs( val * 5 ) );

    console.log( 'activeIndex ' + activeIndex );

    for( let i = 0; i<slideItemsArray.length; i++ ){
        let slideItem = slideItemsArray[ i ];

        slideItem.sineFract = slideItem.originFract + val;

        slideItem.transforms = { 
            rotX: 0 * Math.sin(  slideItem.sineFract ),
            rotY: ( 15 * contentLength ) * Math.sin(  slideItem.sineFract ),
            rotZ: ( 5 * contentLength ) * Math.sin(  slideItem.sineFract ),
            trans: ( 480 * contentLength ) * Math.sin(  slideItem.sineFract ),
            perspective: ( 800 * contentLength ) * Math.sin(  slideItem.sineFract )
        }

        gsap.to( slideItem, 0.6, { transform: `rotateX(${ slideItem.transforms.rotX }deg) rotateY(${ slideItem.transforms.rotY }deg) rotateZ(${ slideItem.transforms.rotZ }deg) translateX(${ slideItem.transforms.trans }px)`, perspective: `${ slideItem.transforms.perspective }px`, ease: Power3.easeOut, delay: i * 0.0 });
 
        if( i == activeIndex ){
            zIndexCtr++;
            slideItem.style.zIndex = zIndexCtr;
            gsap.to( slideItem.focusImg, 0.6, { opacity: 1, ease: Power3.easeOut, delay: i * 0.0 } );
            gsap.to( slideItem.tintImg, 0.6, { opacity: 0, ease: Power3.easeOut, delay: i * 0.0  } );
        } else { 
            slideItem.style.zIndex = zIndexCtr - Math.ceil( Math.abs( slideItem.sineFract * 10  )) ;
            gsap.to( slideItem.focusImg, 0.6, { opacity: 0, ease: Power3.easeOut, delay: i * 0.0 } );
            gsap.to( slideItem.tintImg, 0.6, { alpha: Math.abs( slideItem.sineFract ) * 1.5, ease: Power3.easeOut, delay: i * 0.0  } );
        }
    }
}


const pointerDown = ( evt ) => {
    console.log( 'pointerDown ' + evt )
    evt.target.addEventListener( 'mousemove', mousemove );

}

const pointerUp = ( evt ) => {
    console.log( 'pointerUp' );
    evt.target.removeEventListener( 'mousemove', mousemove );
}

const mousemove = ( evt ) => {
    let dragDist;
    
}

const updateScroll = ( val ) => {
    let amt = val > 1 ? 1 : val;
}

const SideScrollManager = {
    init,
    updateScrollVal,
    controlItemClickedHandler,
    FlexSlider
}

export default SideScrollManager