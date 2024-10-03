
import * as THREE from 'three';

    /* provisional settings only! */
const phongSettings = {
        color : 0x696c77,
        emissive : 0x191515,
        specular: 0xf4f0f0,
        shininess : 28.5,
        side: THREE.DoubleSide,
        opacity  : 0.88
}
    //constants for wing
const outerRadius = 1.1;
const innerRadius = 1;
const wheelThickness = 0.330;
const axisRadius = 0.2;
const axisThickness = 0.1;


//Turbine container creation
export function createTurbine(){
    // circular containment
    const shape = new THREE.Shape();
    shape.arcLengthDivisions = 100;
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false); // Outer circle
    shape.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);  // Inner circle (hole)
    
    // Define extrusion settings for wheel and axis
    const extrudeSettings = {
        steps : 30,
        depth: wheelThickness,
        bevelEnabled: true,
        bevelSize: 0.05,
    };
    const extrudeSettingsAxis = {
        steps : 20,
        depth: axisThickness,
        bevelEnabled: true,
        bevelSize: 0.05,
    };


    // Extrude the shape and add to scene
    const wheelGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const wheelMaterial = new THREE.MeshPhongMaterial(phongSettings);
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    //wheel.rotateOnAxis((0,0,0), Math.PI/2);
    wheel.rotateX(Math.PI/2);

    //now we create the axis 
    const axisCurve = new THREE.EllipseCurve(0,0, axisRadius, axisRadius);
    axisCurve.position = wheel.position;
    const points = axisCurve.getPoints(50);
    const axisShape = new THREE.Shape(points);
    const axisGeometry = new THREE.ExtrudeGeometry(axisShape, extrudeSettingsAxis);
    const axisMaterial = new THREE.MeshPhongMaterial(phongSettings);
    const axis = new THREE.Mesh(axisGeometry,axisMaterial);
    axis.rotateX(Math.PI/2);
    const turbineGroup = new THREE.Group();
    turbineGroup.add(wheel);
    turbineGroup.add(axis);
    turbineGroup.scale.set(3.6,3.6,3.6);
    return turbineGroup;
}
//Helix creation
function createBlade(){
// Create the blade geometry
const bladeGeometry = createBladeGeometry();
// Create a material and mesh for the blade
const bladeMaterial = new THREE.MeshPhongMaterial(phongSettings);
const propellerBlade = new THREE.Mesh(bladeGeometry, bladeMaterial);

// Transform the blade to starting point
propellerBlade.rotation.z = Math.PI /2;
propellerBlade.scale.set(0.1,0.1);
propellerBlade.position.x = 0;
propellerBlade.position.y = 0;
propellerBlade.position.z = 0;
return propellerBlade;
}
function createBladeGeometry() {
    const curves = [];

    // Define control points
    const controlPoints = [
        [new THREE.Vector3( 16.9664 - 16.9664 ,42.757 - 42.757,0), //
            new THREE.Vector3(16.9619 - 16.9664, 42.8656 - 42.757,0), 
            new THREE.Vector3(14.3578 - 16.9664,16.039 - 42.757,0),
            new THREE.Vector3(14.4803 - 16.9664, 14.4072 - 42.757 ,0)],
            
        [new THREE.Vector3(14.4803 - 16.9664, 14.4072 - 42.757,0),
            new THREE.Vector3(14.5645 - 16.9664,12.8226 - 42.757,0),
            new THREE.Vector3(15.3351 - 16.9664,11.6765 - 42.757,0),
            new THREE.Vector3(16.3417 - 16.9664,11.6413 - 42.757,0)],

        [new THREE.Vector3(16.3417 - 16.9664,11.6413 - 42.757 ,0),
            new THREE.Vector3(17.0891 - 16.9664,11.6152 - 42.757,0),
            new THREE.Vector3(17.6438 - 16.9664,11.5191 - 42.757,0),
            new THREE.Vector3(18.694 - 16.9664, 12.5209 - 42.757 ,0)],
        [new THREE.Vector3(18.694 - 16.9664, 12.5209- 42.757 ,0),
            new THREE.Vector3(24.1383 - 16.9664, 19.7426 - 42.757,0),
            new THREE.Vector3(16.9831 - 16.9664,42.7792 - 42.757,0),
            new THREE.Vector3(16.9664 - 16.9664,42.757 - 42.757,0)]

    ];
    // Create curves from control points
    for (const points of controlPoints) {
        const bezierCurve = new THREE.CubicBezierCurve3(points[0], points[1], points[2], points[3]);
        curves.push(bezierCurve);
    }
    // Sample points along the curves to create the shape
    const shapePoints = [];
    const numPoints = 1000; // Number of samples per curve

    curves.forEach(curve => {
        for (let j = 0; j <= numPoints; j++) {
            const t = j / numPoints;
            const point = curve.getPoint(t);
            shapePoints.push(point);
        }
    });

    // Create a shape from the sampled points
    const shape = new THREE.Shape();
    shape.moveTo(shapePoints[0].x, shapePoints[0].y); // Start the shape at the first point

    // Create line segments between sampled points
    for (let i = 1; i < shapePoints.length; i++) {
        shape.lineTo(shapePoints[i].x, shapePoints[i].y);
    }

    // Create geometry from the shape and optionally extrude it
    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 0.3, // Thickness of the shape
        bevelEnabled: false
    });
    return geometry;
}
export function createBladeGroup(){
    const refCirc =  new THREE.EllipseCurve(0,0,axisRadius,axisRadius);

    const bladeGroup = new THREE.Group;
    for(var i = 0; i < 1 ; i+= (1/8)){
        
        const position = refCirc.getPointAt(i);
        console.log(position);
        const blade = createBlade();
        blade.position.set(position.x, position.y, 0);
        blade.rotation.z += Math.PI * i*2;
        console.log(blade);
        bladeGroup.add(blade); 
    }
    bladeGroup.rotation.x = Math.PI/2;
    return bladeGroup;
}

