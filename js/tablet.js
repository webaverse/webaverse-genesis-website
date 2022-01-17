import * as THREE from '../build/three.module';
const raycaster = new THREE.Raycaster();

let  scene, scene3, camera, gui, hologram,mouse;
let alwasyShow = false;
let cursorAlreadyWeba = false;
let cursorAlreadyNone = false;

let position ={
    x : -7.640,
    y: 0.450,
    z: 1.290
}
const init = ( params ) => {
    scene = params.scene;
    scene3 = params.scene3;
    mouse = params.mouse;
    // dynamicMouse = params.mouse;
    camera = params.camera;
    gui = params.gui;
    // raycaster = params.raycaster;
    // raycastPlane.visible = true;
    // raycastTarget.visible = true;
    abeer.log(camera);
    if(!localStorage.getItem('id'))
        localStorage.setItem('id', Date.now() + Math.random());
    addTablet(gui);
}

const addTablet = (gui) =>{

    /** Tablet */
    var img = new THREE.MeshBasicMaterial({
        map:THREE.ImageUtils.loadTexture('./assets/tablets.png')
    });
    img.transparent = true;

    var plane = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6),img);
    plane.position.set(position.x,position.y,position.z);
    plane.rotateY(1);
    plane.rotateX(0);
    plane.renderOrder = 2;
    plane.material.depthTest = false;

    // let cubeFolder = gui.addFolder('Rotation')
    // cubeFolder.add(plane.rotation, 'x', -360,360)
    // cubeFolder.add(plane.rotation, 'y', -360,360)
    // cubeFolder.add(plane.rotation, 'z', -360,360)
    // cubeFolder.add(plane, "renderDepth", 0, 200)

    // cubeFolder.open()


    // cubeFolder = gui.addFolder('Position')
    // cubeFolder.add(plane.position, 'x', -50,30)
    // cubeFolder.add(plane.position, 'y', -50,20)
    // cubeFolder.add(plane.position, 'z', -50,20)
    // cubeFolder.open()

    /** Holograms */
    const holoImg = new THREE.MeshBasicMaterial({
        map:THREE.ImageUtils.loadTexture('./assets/holograms.png')
    });
    holoImg.transparent = true;

    var holoPlane = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6),holoImg);
    holoPlane.position.set(position.x,position.y,position.z);
    holoPlane.rotateY(1);
    holoPlane.rotateX(0);
    hologram = holoPlane;
    // let outerFolder = gui.addFolder('Hologram')

    // cubeFolder = outerFolder.addFolder('Rotation')
    // cubeFolder.add(holoPlane.rotation, 'x', -1,1)
    // cubeFolder.add(holoPlane.rotation, 'y', -1,1)
    // cubeFolder.add(holoPlane.rotation, 'z', -1,1)
    // cubeFolder.open()

    // cubeFolder = outerFolder.addFolder('Position')
    // cubeFolder.add(holoPlane.position, 'x', -50,50)
    // cubeFolder.add(holoPlane.position, 'y', -50,50)
    // cubeFolder.add(holoPlane.position, 'z', -50,50)
    // cubeFolder.open()

    // outerFolder.open();

    scene.add(plane);
    scene3.add(holoPlane);
    startHoloLoop();
}

const startHoloLoop = () =>{
    let random = Math.floor(Math.random() * 1000) + 300;
    setTimeout(()=>{
        if(!alwasyShow)
            hologram.visible = !hologram.visible;
        else 
            hologram.visible = true;
        startHoloLoop();
    },random)
}

const updateCursor = (weba) =>{
    if(weba && !cursorAlreadyWeba){
        cursorAlreadyNone = false;
        cursorAlreadyWeba = true;
        document.documentElement.style.cursor = "url('./assets/mouse.png'), auto";
    }else if(!weba && !cursorAlreadyNone){
        cursorAlreadyWeba = false;
        cursorAlreadyNone = true;
        document.documentElement.style.cursor = "auto";
    }
}

const update = (camera,mouse) => {
    // console.log(camera);
    if(hologram){
        raycaster.setFromCamera( mouse, camera );
        const intersects = raycaster.intersectObjects( [hologram] );
        if(intersects.length > 0){
            alwasyShow = true;
            updateCursor(alwasyShow);
        }else{
            alwasyShow = false;
            updateCursor(alwasyShow);
        }
    }
}

document.body.onmouseup = function() { 
    if(alwasyShow){
        window.location.href = `https://qr.webaverse.com/weba/${localStorage.getItem('id')}`
    }
}
  


const TabletManager = {
    init,
    update,
};

export default TabletManager;