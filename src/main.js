import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Turbine } from "./components/Turbine.js";
import { createBody, createBodyRings, createPlanetScene}    from "./components/vehicleUtils.js";

import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { BLLeg, BRLeg, createBackLeft, createBackRight, createFrontRight, FLLeg, FRLeg } from './components/vehicleUtils';
import { Vehicle } from './components/Vehicle';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { backgroundBlurriness } from 'three/webgpu';

let bladesHorizontal = true;
let click = 0;
let model;
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


function waitForAnimation(action) {
    return new Promise((resolve) => {
        const checkAnimation = () => {
            if (action.isRunning()) {
                requestAnimationFrame(checkAnimation);
            } else {
                resolve();
            }
        };

        checkAnimation(); // Start checking
    });
}

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
                        Promise.all([
                            waitForAnimation(openDoorsAc1),
                            waitForAnimation(openDoorsAc2)
                        ]).then(() => {
                            model.traverse((child) => {
                                if (child.isMesh) {
                                    child.material.transparent = false;
                                    child.material.opacity = 1; // Set opacity to fully visible
                                }
                            });
                        });
            
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
            if (model) {
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.material.transparent = true;
                        child.material.opacity = 0; // Fully transparent
                    }
                });
            }
        }
    }
}
window.addEventListener('keydown', onKeyDown);

function onClick(){
    bladesHorizontal = !bladesHorizontal;
    if(bladesHorizontal){
        body.turnBladesHorizontal();
    }
    else{
        body.turnBladesVertical();
    }
}
window.addEventListener('click',onClick,false);


const body = new Vehicle(scene);
body.scale.set(2,2,2);
body.rotateY(Math.PI);
scene.add(body);

//add stairs
const loader = new GLTFLoader();
loader.load('/metal_ladder/scene.gltf', (gltf) => {
    model = gltf.scene;
    model.scale.set(0.01, 0.01, 0.01);
    model.rotateY(-Math.PI/2);
    model.position.set(+1, -1.3,  -0.9);
    const times = [0, 1]; // Time in seconds
    const valuesOpacity = [0, 1]; // Opacity values

    model.traverse((child) => {
        if (child.isMesh) {
            child.material.transparent = true;
            child.material.opacity = 0; // Start fully transparent
        }
    });
    scene.add(model);
    body.add(model);
});


const mixer1 = new THREE.AnimationMixer(body.doors.door1);
const openDoorsAc1 = mixer1.clipAction(body.doors.door1.animations[0]);
const closeDoorsAc1 = mixer1.clipAction(body.doors.door1.animations[1]);

const mixer2 = new THREE.AnimationMixer(body.doors.door2);
const openDoorsAc2 = mixer2.clipAction(body.doors.door2.animations[0]);
const closeDoorsAc2 = mixer2.clipAction(body.doors.door2.animations[1]);

const clock = new THREE.Clock();

renderer.setAnimationLoop(animate); //animation loop
function animate(){
	orbitcontrols.update();
    if(bladesHorizontal){
        body.animationHorizontal(0.2);
    }
    else{
        body.animationVertical(0.3);
    }

    const delta = clock.getDelta();
    mixer1.update(delta);
    mixer2.update(delta);
    // Update position based on user input or other logic



	renderer.render( scene, camera );
}





