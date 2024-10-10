import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Turbine } from "/components/Turbine.js";
import { createBody, createBodyRings, createPlanetScene}    from "/components/vehicleUtils.js";

import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { BLLeg, BRLeg, createBackLeft, createBackRight, createFrontRight, FLLeg, FRLeg } from './components/vehicleUtils';
import { Vehicle } from './components/Vehicle';


//const scene = new THREE.Scene();
const { scene, cameraGroup, updatePosition } = createPlanetScene(100);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z += 10; //starting pos for camera
camera.position.y += 5;
cameraGroup.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement )
const orbitcontrols = new OrbitControls(camera, renderer.domElement);
//orbitcontrols.maxDistance = 10000; // only works for perspective camera...

renderer.setPixelRatio(window.devicePixelRatio * 0.75); // Reduce to 75% of device pixel ratio -> optimize system resources usage


const helper = new THREE.AxesHelper(10); // add helpers
scene.add(helper)

// add music  -> commented for later

/*
const listener = new THREE.AudioListener();
camera.add(listener);
const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load('/OuterWilds.mp3', (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(true); 
    sound.setVolume(0.3); 
    sound.play(); 
}); 
 */
 

//Add some lights -> provisional  
const ambientLight = new THREE.AmbientLight(0x000000); // Soft white light
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 3); // Bright white light

directionalLight.position.set(5, 5, 5); // Position of the direc. light
scene.add(ambientLight);
scene.add(directionalLight);


window.addEventListener('resize', onWindowResize, false); //auto update size of window

renderer.setAnimationLoop(animate); //animation loop

window.addEventListener('click',onClick,false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}



const body = new Vehicle();
body.scale.set(2,2,2);
body.rotateY(Math.PI);

scene.add(body);

function onClick(){
    body.turnBladesVertical();
    body.animationVertical(0.3);
    
}

function animate(){
	orbitcontrols.update();
    //body.animationHorizontal(0.35);

    // Update position based on user input or other logic



	renderer.render( scene, camera );
}





