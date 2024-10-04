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
const totalBodyLength = 2;
const bodyHeight = 1;
const bodyDepth = 2;
const ring1Depth = 0.1;
const ring2Depth = 0.3;
const girth = 0.10;

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
    const numPoints = 50; // Number of samples per curve

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
        const blade = createBlade();
        blade.position.set(position.x, position.y, 0);
        blade.rotation.z += Math.PI * i*2;
        bladeGroup.add(blade); 
    }
    bladeGroup.rotation.x = Math.PI/2;
    return bladeGroup;
}

export function createBody() {
    const points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(bodyHeight/2, bodyHeight/2, 0),
            new THREE.Vector3(totalBodyLength - bodyHeight/2, bodyHeight/2, 0),
            new THREE.Vector3(totalBodyLength, 0, 0),
            new THREE.Vector3(totalBodyLength - bodyHeight/2, -(bodyHeight/2), 0),
            new THREE.Vector3(bodyHeight/2, -(bodyHeight/2), 0),
            new THREE.Vector3(0, 0, 0)
        ];

    // Create a shape for the cross-section
    const shape = new THREE.Shape(points);

    // Extrude settings
    const extrudeSettings = {
        steps: 100,
        bevelEnabled: false,
        depth:bodyDepth,  
    };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshPhongMaterial(
    phongSettings);
    const bodyMesh = new THREE.Mesh(geometry, material);
    const bodyGroup = new THREE.Group;
    bodyGroup.add(bodyMesh);

    
    const windshieldFrontShape = new THREE.Shape();
    windshieldFrontShape.moveTo(0 ,bodyHeight/2,0);
    windshieldFrontShape.lineTo( bodyHeight/2,bodyHeight,0);
    windshieldFrontShape.lineTo( bodyHeight/2,0,0);
    windshieldFrontShape.lineTo( 0 ,bodyHeight/2,0);
    windshieldFrontShape.closePath();
    const extrudeSettingsWindshield = {
        steps: 100,
        bevelEnabled: false,
        depth:bodyDepth/2,  
        
    };
    const windshieldFrontGeo = new THREE.ExtrudeGeometry(windshieldFrontShape, extrudeSettingsWindshield);
    const materialWindshield = new THREE.MeshPhongMaterial(
    phongSettings);
    const windshieldFront = new THREE.Mesh(windshieldFrontGeo, materialWindshield);
    windshieldFront.rotateY(Math.PI/2);
    windshieldFront.position.z = bodyDepth+bodyHeight/2;
    windshieldFront.position.x = bodyHeight/2;
    windshieldFront.position.y -= bodyHeight/2;
    bodyGroup.add(windshieldFront); 

    //side windows 
    const windowShape = new THREE.Shape();
    windowShape.moveTo(-((bodyHeight/2) * Math.SQRT2)/2,0,0);
    windowShape.lineTo(((bodyHeight/2) * Math.SQRT2)/2,0,0);
    windowShape.lineTo(0,bodyHeight/2,0);
    windowShape.lineTo(-((bodyHeight/2) * Math.SQRT2)/2,0,0);
    windowShape.closePath();
    const windowGeo = new THREE.ShapeGeometry(windowShape);
    const windowMat = new THREE.MeshPhongMaterial(phongSettings);

    const window1 = new THREE.Mesh(windowGeo,windowMat);
    window1.rotateY(Math.PI/4);
    window1.rotateX(-Math.PI/5);
    window1.position.z += totalBodyLength + bodyHeight/4;
    window1.position.x += (bodyDepth - bodyHeight/4); 
    window1.scale.set(1,1.2,1);
    bodyGroup.add(window1); 

    const window2 = new THREE.Mesh(windowGeo, windowMat);
    window2.position.z += totalBodyLength + bodyHeight/4;
    window2.rotateY(-Math.PI /4);
    window2.rotateX(-Math.PI/5);
    window2.position.x += bodyHeight/4;
    window2.scale.set(1,1.2,1);
    bodyGroup.add(window2);

    const window3 = new THREE.Mesh(windowGeo,windowMat);
    
    window3.position.z += totalBodyLength + bodyHeight/4;
    window3.rotateZ(Math.PI);
    window3.rotateY(Math.PI/4);
    window3.rotateX(-Math.PI/5);
    window3.position.x += bodyHeight/4;
    window3.scale.set(1,1.2,1);
    bodyGroup.add(window3);

    const window4 = new THREE.Mesh(windowGeo, windowMat);
    window4.position.z += totalBodyLength + bodyHeight/4;
    window4.rotateZ(Math.PI);
    window4.rotateY(-Math.PI/4);
    window4.rotateX(-Math.PI/5);
    window4.position.x += (totalBodyLength - bodyHeight/4);
    window4.scale.set(1,1.2,1);
    bodyGroup.add(window4);
    
    return bodyGroup; 

}

export function createBodyRings(){

        // Create the outer shape
        const outerShape = new THREE.Shape();
        outerShape.moveTo(0,0,0);
        outerShape.lineTo(bodyHeight/2+ girth,bodyHeight/2 + girth, 0);
        outerShape.lineTo(totalBodyLength - bodyHeight/2 + girth, bodyHeight/2 + girth,0);
        outerShape.lineTo(totalBodyLength+2* girth,0,0);
        outerShape.lineTo(totalBodyLength-bodyHeight/2 + girth, -(bodyHeight/2 + girth),0);
        outerShape.lineTo(bodyHeight/2+ girth,-(bodyHeight/2 + girth), 0);
        outerShape.lineTo(0,0,0);
        outerShape.closePath();
        // Create the inner shape (hole)
        const innerShape = new THREE.Path();
        innerShape.moveTo(girth, 0, 0);
        innerShape.lineTo(girth + bodyHeight/2, bodyHeight/2);
        innerShape.lineTo(totalBodyLength + girth - bodyHeight/2, bodyHeight/2,0);
        innerShape.lineTo(totalBodyLength + girth , 0);
        innerShape.lineTo(totalBodyLength + girth - bodyHeight/2, -(bodyHeight/2),0);
        innerShape.lineTo(girth + bodyHeight/2, -(bodyHeight/2),0);
        innerShape.lineTo(girth,0,0);
        innerShape.closePath();
        outerShape.holes.push(innerShape);
    
        // Extrude settings
        const extrudeSettings = {
            steps: 1,
            depth: ring1Depth,
            bevelEnabled: true,
            bevelSize: 0.05,
        };
        const extrudeSettings2 = {
            steps: 1,
            depth: ring2Depth,
            bevelEnabled: true,
            bevelSize: 0.05,
        }
        // Ring 1
        const geometry1 = new THREE.ExtrudeGeometry(outerShape, extrudeSettings);
        const material = new THREE.MeshPhongMaterial(phongSettings);
        const ring1 = new THREE.Mesh(geometry1, material);
        ring1.position.x -= girth;
        ring1.position.z += 1.3;

        const geometry2 = new THREE.ExtrudeGeometry(outerShape,extrudeSettings2);
        const ring2 = new THREE.Mesh(geometry2,material);
        ring2.position.x -= girth;
        ring2.position.z += 0.2;
        const ringGroup = new THREE.Group();
        ringGroup.add(ring1);
        ringGroup.add(ring2);
        return ringGroup;
}