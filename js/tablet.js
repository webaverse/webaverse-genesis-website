import * as THREE from '../build/three.module';
const raycaster = new THREE.Raycaster();

let  scene, scene3, camera, gui, hologram,mouse;

let position ={
    x : -25,
    y: 1.27,
    z: -16
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
        hologram.visible = !hologram.visible;
        startHoloLoop();
    },random)
}


const update = () => {
    // console.log(camera);
	// raycaster.setFromCamera( mouse, camera );
	// const intersects = raycaster.intersectObjects( [hologram] );
    // console.log(intersects);
}


const TabletManager = {
    init,
    update,
};

export default TabletManager;