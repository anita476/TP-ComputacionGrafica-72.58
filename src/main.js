import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import { createPlanetScene}    from "./components/vehicleUtils.js";

import { Vehicle } from './components/Vehicle';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createPlanet, getPlanetPhisical , createMountainMeshesAndBodies , getMountains, createStars} from './components/planetUtils.js';

let bladesHorizontal = true;
let click = 0;
let legsDown = 1;
let model;
const { scene, cameraGroup } = createPlanetScene(100);



//Create cameras
const rearCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
    rearCamera.position.set(1,2,-3);
const frontCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
    frontCamera.position.set(1,2,7);
const topCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
    topCamera.position.set(1, 10,-1);
const bottomCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
    bottomCamera.position.set(1, -2, -2);


let currentCamera = rearCamera;


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement )
//orbitcontrols.maxDistance = 10000; // only works for perspective camera...

renderer.setPixelRatio(window.devicePixelRatio * 0.75); // Reduce to 75% of device pixel ratio -> optimize system resources usage


const helper = new THREE.AxesHelper(1000); // add helpers
scene.add(helper)

const world = new CANNON.World();
world.gravity.set(0, -20, 0);

const listener = new THREE.AudioListener();
currentCamera.add(listener);
const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load('/OuterWilds.mp3', (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(true); 
    sound.setVolume(0.3); 
    sound.play(); 
}); 
 
const ambientLight = new THREE.AmbientLight( 0x000000 );
scene.add( ambientLight );



const light2 = new THREE.DirectionalLight( 0xffffff, 30 );
light2.position.set( 100, 400, 100 );
scene.add( light2 );

const light3 = new THREE.DirectionalLight( 0xffffff, 3 );
light3.position.set( - 100, - 400, - 100 );
scene.add( light3 );


window.addEventListener('resize', onWindowResize, false); //auto update size of window
function onWindowResize() {
    currentCamera.aspect = window.innerWidth / window.innerHeight;
    currentCamera.updateProjectionMatrix();
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
const speed=0.6;
const riseImpulseStrength = 25;
const forwardImpulseStrength = 20;
const sideImpulseStrength = 20;
function onKeyDown(event) {
    if(event.key == '1'){
        currentCamera = rearCamera;
    }
    if(event.key == '2'){
        currentCamera = frontCamera;
    }
    if(event.key == '3'){
        currentCamera = topCamera;
    }
    if(event.key == '4'){
        currentCamera = bottomCamera;
    }
    if(event.key == 'j' || event.key == 'J'){
        if(legsDown === 1){
            downLegs.stop();
            upLegss.clampWhenFinished = true; 
            upLegss.setLoop(THREE.LoopOnce);
            upLegss.play();
            legsDown = 0;
        }
        else if(legsDown === 0){
            upLegss.stop();
            downLegs.clampWhenFinished = true; 
            downLegs.setLoop(THREE.LoopOnce);
            downLegs.play();
            legsDown = 1;
        }
        
            
    }
    if(event.key === 's' || event.key === 'S'){
        const forwardImpulse = new CANNON.Vec3(0, 0, -forwardImpulseStrength);  
        bodyPhisical.applyImpulse(forwardImpulse, bodyPhisical.position);
        bladesHorizontal = 0;

        if(!bladesHorizontal){
            body.turnBladesVertical();
        }
    }
    if(event.key == 'w' || event.key === 'W'){
        const backwardsImpulse = new CANNON.Vec3(0, 0, forwardImpulseStrength);  
        bodyPhisical.applyImpulse(backwardsImpulse, bodyPhisical.position);
        bladesHorizontal = 0;

        if(!bladesHorizontal){
            body.turnBladesVertical();
        }
    }
    if(event.key === ' ' || event.key === 'Spacebar'){
        const upwardImpulse = new CANNON.Vec3(0, riseImpulseStrength, 0); 
        bodyPhisical.applyImpulse(upwardImpulse, bodyPhisical.position);
        bladesHorizontal = 1;

        if(bladesHorizontal){
            body.turnBladesHorizontal();
        }
    }
    if(event.key == 'a' || event.key == 'A'){
        const sideImpulse = new CANNON.Vec3(sideImpulseStrength, 0, 0); 
        bodyPhisical.applyImpulse(sideImpulse, bodyPhisical.position);
        bladesHorizontal = 0;

        if(!bladesHorizontal){
            body.turnBladesVertical();
        }
    }
    if(event.key == 'd' || event.key == 'D'){
        const sideImpulse = new CANNON.Vec3(-sideImpulseStrength, 0, 0); 
        bodyPhisical.applyImpulse(sideImpulse, bodyPhisical.position);
        bladesHorizontal = 0;

        if(!bladesHorizontal){
            body.turnBladesVertical();
        }
    }
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

/* function onClick(){
    bladesHorizontal = !bladesHorizontal;
    if(bladesHorizontal){
        body.turnBladesHorizontal();
    }
    else{
        body.turnBladesVertical();
    }
}
window.addEventListener('click',onClick,false); */


const body = new Vehicle();
body.scale.set(2,2,2);
/*-- Add cameras to the models so they move with it!  --*/
body.add(frontCamera);
body.add(rearCamera);
body.add(topCamera);
body.add(bottomCamera);
frontCamera.lookAt(body.position.x+2, body.position.y, body.position.z);
rearCamera.lookAt(body.position.x+2, body.position.y, body.position.z);
topCamera.lookAt(body.position.x+2, body.position.y, body.position.z);
bottomCamera.lookAt(body.position.x+2, body.position.y, body.position.z);
//body.rotateY(-Math.PI);

scene.add(body);

const stars = createStars();

scene.add(stars);

const box = new THREE.Box3().setFromObject(body);

const size = new THREE.Vector3();
const center = new THREE.Vector3();
box.getSize(size); // Get the size of the bounding box
box.getCenter(center); // Get the center of the bounding box

// Create a Cannon.js body
const bodyPhisical = new CANNON.Body({
    mass: 5, // Adjust mass as needed
    position: new CANNON.Vec3(center.x, center.y, center.z), // Set the position to the center of the bounding box
});

// Create a shape from the bounding box dimensions
const shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2 + 0.5, size.z / 2));
bodyPhisical.addShape(shape);
bodyPhisical.fixedRotation = false; 
bodyPhisical.linearDamping = 0.5; 
bodyPhisical.angularDamping = 1; 

// Now add the body to your Cannon.js world
world.addBody(bodyPhisical);



bodyPhisical.position.z = 0;
bodyPhisical.position.y = 800;
bodyPhisical.position.x += 2;
body.position.copy(bodyPhisical.position);

document.body.appendChild(renderer.domElement);

const planet = createPlanet(world);
scene.add(planet);
const planetPhisical = getPlanetPhisical();


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


const mixer3 = new THREE.AnimationMixer(body.legs);
const upLegss = mixer3.clipAction(body.legs.children[0].animations[0]);

const mixer4 = new THREE.AnimationMixer(body.legs);
const downLegs = mixer4.clipAction(body.legs.children[0].animations[1]);

const clock = new THREE.Clock();

// Create a contact material
const planetMaterial = new CANNON.Material('planetMaterial');
const bodyMaterial = new CANNON.Material('bodyMaterial');

// Define the contact material properties
 const contactMaterial = new CANNON.ContactMaterial(planetMaterial, bodyMaterial, {
    friction: 0.9, 
    restitution: 0
}); 
world.addContactMaterial(contactMaterial);
bodyPhisical.material = bodyMaterial;



createMountainMeshesAndBodies(scene, world);
const mountains = getMountains();
for(let i = 0 ; i < mountains.length  ; i++){
    mountains[i][1].material = planetMaterial;
}
planetPhisical.material = planetMaterial;


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
    mixer3.update(delta);
    mixer4.update(delta);

    if (bodyPhisical.angle > 0.1) {
        bodyPhisical.angle = 0; // Simple stabilization
    }
    //currentCamera.lookAt(bodyPhisical.position.x+2, bodyPhisical.position.y, bodyPhisical.position.z);

    body.position.copy(bodyPhisical.position);
    body.quaternion.copy(bodyPhisical.quaternion);

/*     planet.position.copy(planetPhisical.position);
    planet.quaternion.copy(planetPhisical.quaternion);

    for(var i = 0; i< mountains.length; i++){
        mountains[i][0].position.copy(mountains[i][1].position);
        mountains[i][0].quaternion.copy(mountains[i][1].quaternion);
    }
 */
	renderer.render( scene, currentCamera );
}





