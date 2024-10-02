import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { createTurbine } from './components/drone';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z += 5; //starting pos for camera
camera.position.y += 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement )
const orbitcontrols = new OrbitControls(camera, renderer.domElement);

const helper = new THREE.AxesHelper(10); // add helpers

scene.add(helper)

// add music  -> commented for later
/*  const listener = new THREE.AudioListener();
 camera.add(listener);
 const sound = new THREE.Audio(listener);
 const audioLoader = new THREE.AudioLoader();
 audioLoader.load('/OuterWilds.mp3', (buffer) => {
     sound.setBuffer(buffer);
     sound.setLoop(true); 
     sound.setVolume(0.3); 
     sound.play(); 
 }); */


//Add some lights -> provisional  
const ambientLight = new THREE.AmbientLight(0x000000); // Soft white light
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 3); // Bright white light

directionalLight.position.set(5, 5, 5); // Position of the direc. light
scene.add(ambientLight);
scene.add(directionalLight);


window.addEventListener('resize', onWindowResize, false); //auto update size of window
const turbine= createTurbine();
scene.add(turbine);
renderer.setAnimationLoop(animate); //animation loop







function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(){
    requestAnimationFrame( animate );
	orbitcontrols.update();
	renderer.render( scene, camera );
}



