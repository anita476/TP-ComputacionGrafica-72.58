import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Turbine } from "./components/Turbine.js";
import { createBody, createBodyRings, createPlanetScene}    from "./components/vehicleUtils.js";

import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { BLLeg, BRLeg, createBackLeft, createBackRight, createFrontRight, FLLeg, FRLeg } from './components/vehicleUtils';
import { Vehicle } from './components/Vehicle';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { backgroundBlurriness } from 'three/webgpu';


let click = 0;

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
 

//Add some lights -> provisional  
const ambientLight = new THREE.AmbientLight(0x000000); // Soft white light
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 3); // Bright white light

directionalLight.position.set(5, 5, 5); // Position of the direc. light
scene.add(ambientLight);
scene.add(directionalLight);


window.addEventListener('resize', onWindowResize, false); //auto update size of window
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

renderer.setAnimationLoop(animate); //animation loop

window.addEventListener('click',onClick,false);

function onKeyDown(event) {
    if (event.key === 'h' || event.key === 'H') {
        if (click === 0) {
            closeDoorsAc1.stop();
            closeDoorsAc2.stop();
            openDoorsAc1.clampWhenFinished = true; 
            openDoorsAc1.setLoop(THREE.LoopOnce); 
            openDoorsAc2.clampWhenFinished = true; 
            openDoorsAc2.setLoop(THREE.LoopOnce);
            openDoorsAc1.play();
            openDoorsAc2.play();
    
            click = 1;
        } else if (click === 1) {
            openDoorsAc1.stop();
            openDoorsAc2.stop();
    
            closeDoorsAc1.clampWhenFinished = true; 
            closeDoorsAc1.setLoop(THREE.LoopOnce); 
            closeDoorsAc2.clampWhenFinished = true; 
            closeDoorsAc2.setLoop(THREE.LoopOnce);
    
            closeDoorsAc1.play();
            closeDoorsAc2.play();
    
            click = 0;
        }
    }
}

// Add event listener for keydown
window.addEventListener('keydown', onKeyDown);



const body = new Vehicle(scene);
body.scale.set(2,2,2);
body.rotateY(Math.PI);

scene.add(body);


const mixer1 = new THREE.AnimationMixer(body.doors.door1);
const openDoorsAc1 = mixer1.clipAction(body.doors.door1.animations[0]);
const closeDoorsAc1 = mixer1.clipAction(body.doors.door1.animations[1]);

const mixer2 = new THREE.AnimationMixer(body.doors.door2);
const openDoorsAc2 = mixer2.clipAction(body.doors.door2.animations[0]);
const closeDoorsAc2 = mixer2.clipAction(body.doors.door2.animations[1]);

function onClick() {
}
const clock = new THREE.Clock();

function animate(){
	orbitcontrols.update();
    body.animationHorizontal(0.35);

    const delta = clock.getDelta();
    mixer1.update(delta);
    mixer2.update(delta);
    // Update position based on user input or other logic



	renderer.render( scene, camera );
}





