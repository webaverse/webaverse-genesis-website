import SimplexNoise from "simplex-noise";

const simplex = new SimplexNoise()

export default (x, y, z) => {
  
    var eps = 0.0001;

    var curl = { x: null, y: null, z: null };

    //Find rate of change in YZ plane
    var n1 = simplex.noise3D(x, y + eps, z); 
    var n2 = simplex.noise3D(x, y - eps, z); 
    //Average to find approximate derivative
    var a = (n1 - n2)/(2 * eps);
    var n1 = simplex.noise3D(x, y, z + eps); 
    var n2 = simplex.noise3D(x, y, z - eps); 
    //Average to find approximate derivative
    var b = (n1 - n2)/(2 * eps);
    curl.x = a - b;

    //Find rate of change in XZ plane
    n1 = simplex.noise3D(x, y, z + eps); 
    n2 = simplex.noise3D(x, y, z - eps); 
    a = (n1 - n2)/(2 * eps);
    n1 = simplex.noise3D(x + eps, y, z); 
    n2 = simplex.noise3D(x - eps, y, z); 
    b = (n1 - n2)/(2 * eps);
    curl.y = a - b;

    //Find rate of change in XY plane
    n1 = simplex.noise3D(x + eps, y, z); 
    n2 = simplex.noise3D(x - eps, y, z); 
    a = (n1 - n2)/(2 * eps);
    n1 = simplex.noise3D(x, y + eps, z); 
    n2 = simplex.noise3D(x, y - eps, z); 
    b = (n1 - n2)/(2 * eps);
    curl.z = a - b;

    return curl;
}