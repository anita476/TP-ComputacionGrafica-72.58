
import * as THREE from 'three';
import { shininess } from 'three/webgpu';


export function createTurbine(){
    //constants for wing
    const outerRadius = 1;
    const innerRadius = 0.90;
    const wheelThickness = 0.50;
    const axisRadius = 0.2;
    const axisThickness = 0.1;

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
    /* provisional settings only! */
    const phongSettings = {
        color : 0x696c77,
        emissive : 0x191515,
        specular: 0xf4f0f0,
        shininess : 28.5,
        side: THREE.DoubleSide,
        opacity  : 0.88
    }

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
    return turbineGroup;
}