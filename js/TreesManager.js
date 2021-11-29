import curlNoise from './curlNoise';


const leafGroupsArray = [];
let ctr = 0;
let i;

const init = () => {

}

const addLeavesGroup = ( groupObj ) => {
    leafGroupsArray.push( groupObj );
}

const update = () => {

    //ctr += 0.001;
    //console.log( curlNoise( 0, ctr, 0 ) )

    for( i = 0; i<leafGroupsArray.length; i++ ){
        let l = leafGroupsArray[ i ];
        l.moveCtrX += 0.007;
        l.moveCtrY += 0.007;
        l.moveCtrZ += 0.007;
        let c = curlNoise( l.moveCtrX, l.moveCtrX, 0 )
        l.mesh.rotation.x = l.rotX + ( c.x  * ( 0.2 * Math.PI / 180 ) );
        //l.mesh.rotation.y = l.rotY + ( c.y  * ( 0.5 * Math.PI / 180 ) );
        l.mesh.rotation.z = l.rotZ + ( c.z  * ( 0.2 * Math.PI / 180 ) );
    }
}



const TreeManager = {
    init,
    addLeavesGroup,
    update
};

export default TreeManager;