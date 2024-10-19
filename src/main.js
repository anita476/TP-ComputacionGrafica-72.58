import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { createPlanetScene}    from "./components/vehicleUtils.js";

import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { BLLeg, BRLeg, createBackLeft, createBackRight, createFrontRight, FLLeg, FRLeg } from './components/vehicleUtils';
import { Vehicle } from './components/Vehicle';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { backgroundBlurriness } from 'three/webgpu';
import { createPlanet, getPlanetId, getPlanetPhisical } from './components/planetUtils.js';

let bladesHorizontal = true;
let click = 0;
let model;
const { scene, cameraGroup } = createPlanetScene(100);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y += 817;
camera.lookAt(0,0,0);


cameraGroup.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement )
const orbitcontrols = new OrbitControls(camera, renderer.domElement);
//orbitcontrols.maxDistance = 10000; // only works for perspective camera...

renderer.setPixelRatio(window.devicePixelRatio * 0.75); // Reduce to 75% of device pixel ratio -> optimize system resources usage


const helper = new THREE.AxesHelper(1000); // add helpers
scene.add(helper)

const world = new CANNON.World();
world.gravity.set(0, -7, 0);

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
const directLight2 = new THREE.DirectionalLight(0xFFFFFF, 3);
directLight2.position.set(100,-1500,0);

directionalLight.position.set(500, 1000, 300); // Position of the direc. light
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


const body = new Vehicle();
body.scale.set(2,2,2);
body.rotateY(Math.PI);
scene.add(body);


// Create a Cannon.js body and assign the shape
const bodyPhisical = new CANNON.Body({
    mass: 50, // Adjust mass as needed
    position: new CANNON.Vec3(body.position.x,body.position.y,body.position.z),
    shape: new CANNON.Box(new CANNON.Vec3(10,10,10))
});
console.log(bodyPhisical);
world.addBody(bodyPhisical);



bodyPhisical.position.z = 0;
bodyPhisical.position.y = 100;
bodyPhisical.position.x += 2;
body.position.copy(bodyPhisical.position);

document.body.appendChild(renderer.domElement);

const planet = createPlanet(world);
scene.add(planet);
const planetPhisical = getPlanetPhisical();
console.log(planetPhisical);

//add stairs
const loader = new GLTFLoader();
loader.load('/metal_ladder/scene.gltf', (gltf) => {
    model = gltf.scene;
    model.scale.set(0.01, 0.01, 0.01);
    model.rotateY(-Math.PI/2);
    model.position.set(+1, -1.3,  -0.9);
    const times = [0, 1]; 
    const valuesOpacity = [0, 1]; 

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

 /* apply gravity */
function applyGravitationalForce() {
    // Get the position of the planet's mesh
    const planetPosition = new CANNON.Vec3(
        planet.position.x,
        planet.position.y,
        planet.position.z
    );

    // Iterate through all bodies in the world
    world.bodies.forEach((body) => {
        // Check if the body is not part of the planet (or any other condition you need)
        if (!(body.id === getPlanetId())) { // Add any condition to identify the planet's body if needed
            // Calculate the force direction towards the planet
            const force = planetPosition.vsub(body.position).scale(1); // Direction towards the planet
            body.applyForce(force.scale(5)); // Scale for attraction strength
        }
    });

} 

// Create a contact material
//const planetMaterial = new CANNON.Material('planetMaterial');
const bodyMaterial = new CANNON.Material('bodyMaterial');

// Define the contact material properties
/* const contactMaterial = new CANNON.ContactMaterial(planetMaterial, bodyMaterial, {
    friction: 0.5, 
    restitution: 0.1 
}); */
//world.addContactMaterial(contactMaterial);
//const planetPhisical = getPlanetPhisical();
//planetPhisical.material = planetMaterial;
bodyPhisical.material = bodyMaterial;

console.log(bodyPhisical);
console.log(planetPhisical);






renderer.setAnimationLoop(animate); //animation loop
function animate(){
    world.fixedStep();
    if(bladesHorizontal){
        body.animationHorizontal(0.2);
    }
    else{
        body.animationVertical(0.3);
    }

    const delta = clock.getDelta();
    mixer1.update(delta);
    mixer2.update(delta);
    //camera.lookAt(bodyPhisical.position.x -2, bodyPhisical.position.y, bodyPhisical.position.z);
    //applyGravitationalForce();

    body.position.copy(bodyPhisical.position);
    body.quaternion.copy(bodyPhisical.quaternion);
    planet.position.copy(planetPhisical.position);
    planet.quaternion.copy(planetPhisical.quaternion);


    
	orbitcontrols.update();

	renderer.render( scene, camera );
}





