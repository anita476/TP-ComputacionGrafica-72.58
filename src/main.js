import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import { Vehicle } from './components/Vehicle';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createStars} from './components/planetUtils.js';
import SimplexNoise from 'https://cdn.skypack.dev/simplex-noise@3.0.0';


const textureCube = new THREE.CubeTextureLoader().load( [
    '/env/px.png',
    '/env/nx.png',
    '/env/py.png',
    '/env/ny.png',
    '/env/pz.png',
    '/env/nz.png'
]);

textureCube.mapping = THREE.CubeRefractionMapping;

let bladesHorizontal = true;
let retractedTurbines = false;
let click = 0;
let model;
let legsDown = 1;
let lightsOn = 1;
const zoomFactor = 0.5;
const width = 400;
const height = 400;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xAAAAAA, 0.002);

const simplex = new SimplexNoise();


scene.background = textureCube;

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(512, {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipMapLinearFilter,
    magFilter: THREE.LinearFilter,
});



//Create cameras
const rearCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
    rearCamera.position.set(1,2,-3);
const frontCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
    frontCamera.position.set(1,2,7);
const topCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
    topCamera.position.set(1, 10,-1);
const bottomCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
    bottomCamera.position.set(1, -2, -2);
const lateralCameraLeft = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    lateralCameraLeft.position.set(5,1,1);
const lateralCameraRight = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
lateralCameraRight.position.set(-3,1,1); 

const CubeCamera =new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);


let currentCamera = rearCamera;


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement )

renderer.setPixelRatio(window.devicePixelRatio * 0.75); // Reduce to 75% of device pixel ratio -> optimize system resources usage
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

/* Dont need the helper anymore */
const helper = new THREE.AxesHelper(1000); 
scene.add(helper)
const world = new CANNON.World();
world.gravity.set(0, -12, 0);

const ambientLight = new THREE.AmbientLight( 0x555555,1 );
ambientLight.shadow = true;
scene.add( ambientLight );

const light2 = new THREE.DirectionalLight( 0xfc7703, 1.5 );
light2.position.set( 100, 150, 0 );
light2.castShadow = true;
scene.add( light2 );

/* to increment the rectangle where the shadows are shown*/
light2.shadow.camera.left = -200;   
light2.shadow.camera.right = 200;   
light2.shadow.camera.top = 200;     
light2.shadow.camera.bottom = -200; 
light2.shadow.camera.near = 1;   
light2.shadow.camera.far = 1000;  

light2.shadow.mapSize.width = 2048; 
light2.shadow.mapSize.height = 2048;


const light3 = new THREE.DirectionalLight( 0xffffff, 0.1 );
light3.position.set( -10, 100, -100 );
light3.castShadow = true;
scene.add( light3 );

/* to increment the rectangle where the shadows are shown*/
light3.shadow.camera.left = -200;   
light3.shadow.camera.right = 200;   
light3.shadow.camera.top = 200;     
light3.shadow.camera.bottom = -200; 
light3.shadow.camera.near = 1;   
light3.shadow.camera.far = 1000;  

light3.shadow.mapSize.width = 2048; 
light3.shadow.mapSize.height = 2048;




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
const riseImpulseStrength = 25;
const forwardImpulseStrength = 20;
const sideImpulseStrength = 20;
function onKeyDown(event) {
    if(event.key == '1'){
        currentCamera = rearCamera;
        currentCamera.updateProjectionMatrix();
    }
    if(event.key == '2'){
        currentCamera = frontCamera;
        currentCamera.updateProjectionMatrix();
    }
    if(event.key == '3'){
        currentCamera = topCamera;
        currentCamera.updateProjectionMatrix();
    }
    if(event.key == '4'){
        currentCamera = bottomCamera;
        currentCamera.updateProjectionMatrix();
    }
    if(event.key == '5'){
        currentCamera = lateralCameraLeft;
        currentCamera.updateProjectionMatrix();
    }
    if(event.key == '6'){
        currentCamera = lateralCameraRight;
        currentCamera.updateProjectionMatrix();
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
            body.turnBackLightRed();
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
                                    child.castShadow = true;

                                }
                            });
                            body.turnBackLightGreen();
                        });
            
        } else if (click === 1) {
            body.turnBackLightRed();
            
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
                        child.castShadow = false;

                    }
                });
            }
            Promise.all([
                waitForAnimation(closeDoorsAc1),
                waitForAnimation(closeDoorsAc2)
            ]).then(() => {
                body.turnBackLightNormal();
            });
        }
    }
    if(event.key == 'k' || event.key == 'K'){
        if(retractedTurbines){
            retractedTurbines = 0;
            forwardTurbines1.stop();
            backwardTurbines1.clampWhenFinished = true; 
            backwardTurbines1.setLoop(THREE.LoopOnce);
            backwardTurbines1.play();

            forwardTurbines2.stop();
            backwardTurbines2.clampWhenFinished = true; 
            backwardTurbines2.setLoop(THREE.LoopOnce);
            backwardTurbines2.play();

            forwardTurbines3.stop();
            backwardTurbines3.clampWhenFinished = true; 
            backwardTurbines3.setLoop(THREE.LoopOnce);
            backwardTurbines3.play();

            forwardTurbines4.stop();
            backwardTurbines4.clampWhenFinished = true; 
            backwardTurbines4.setLoop(THREE.LoopOnce);
            backwardTurbines4.play();
        }
        else{
            retractedTurbines = 1;
            backwardTurbines1.stop();
            forwardTurbines1.clampWhenFinished = true; 
            forwardTurbines1.setLoop(THREE.LoopOnce);
            forwardTurbines1.play();

            backwardTurbines2.stop();
            forwardTurbines2.clampWhenFinished = true; 
            forwardTurbines2.setLoop(THREE.LoopOnce);
            forwardTurbines2.play();

            backwardTurbines3.stop();
            forwardTurbines3.clampWhenFinished = true; 
            forwardTurbines3.setLoop(THREE.LoopOnce);
            forwardTurbines3.play();

            backwardTurbines4.stop();
            forwardTurbines4.clampWhenFinished = true; 
            forwardTurbines4.setLoop(THREE.LoopOnce);
            forwardTurbines4.play();


        }

        
    }
    if(event.key == 'l' || event.key == 'L'){
        if(lightsOn){
            body.turnLightsOff();
            lightsOn = 0;
        }
        else if(lightsOn == 0){
            body.turnLightsOn();
            lightsOn = 1;
        }
    }
    if(event.key == '+'){
        currentCamera.zoom += zoomFactor;
        currentCamera.updateProjectionMatrix();
    }
    if(event.key == '-'){
        currentCamera.zoom -= zoomFactor;
        currentCamera.updateProjectionMatrix();
    }
}
window.addEventListener('keydown', onKeyDown);

const body = new Vehicle();
body.scale.set(2,2,2);

/*-- Add cameras to the models so they move with it!  --*/
body.add(frontCamera);
body.add(rearCamera);
body.add(topCamera);
body.add(bottomCamera);
body.add(lateralCameraLeft);
body.add(lateralCameraRight);
frontCamera.lookAt(body.position.x+2, body.position.y, body.position.z);
rearCamera.lookAt(body.position.x+2, body.position.y, body.position.z);
topCamera.lookAt(body.position.x+2, body.position.y, body.position.z);
bottomCamera.lookAt(body.position.x+2, body.position.y, body.position.z);
lateralCameraLeft.lookAt(body.position.x+2, body.position.y, body.position.z+1);
lateralCameraRight.lookAt(body.position.x+2, body.position.y, body.position.z+1);



const windowGeo = new THREE.BoxGeometry(2, 1, 0.1);
const material2 = new THREE.MeshStandardMaterial({
    color: 0xffffff, 
    metalness: 0.8,   
    roughness: 0.05,  
    envMap: cubeRenderTarget.texture,
    envMapIntensity: 1,
});


const windowMesh = new THREE.Mesh(windowGeo, material2);
windowMesh.rotation.x = (-Math.PI/4);


scene.add(windowMesh);
scene.add(body);
 
const stars = createStars();

scene.add(stars);

const box = new THREE.Box3().setFromObject(body);

const size = new THREE.Vector3();
const center = new THREE.Vector3();
box.getSize(size); 
box.getCenter(center); 

const bodyPhisical = new CANNON.Body({
    mass: 5, 
    position: new CANNON.Vec3(center.x, center.y, center.z), 
});


// Create a shape from the bounding box dimensions
const shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2 + 0.5, size.z / 2));
bodyPhisical.addShape(shape);
bodyPhisical.fixedRotation = false; 
bodyPhisical.linearDamping = 0.5; 
bodyPhisical.angularDamping = 1; 

world.addBody(bodyPhisical);


bodyPhisical.position.z = 0;
bodyPhisical.position.y = 200;
bodyPhisical.position.x += 2;
body.position.copy(bodyPhisical.position);
document.body.appendChild(renderer.domElement);

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
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    scene.add(model);
    body.add(model);
});
  

const heightmap = generateHeightmap(width, height);  
const shape2 = new CANNON.Heightfield(heightmap, { elementSize: 1 });
const groundBody = new CANNON.Body({
    mass: 0, // Static body (no movement)
    position: new CANNON.Vec3(0, 0, 0)
});
groundBody.addShape(shape2);
world.addBody(groundBody);
  
const textureLoader = new THREE.TextureLoader();
const terrainTexture = textureLoader.load('sand.jpg');  
terrainTexture.wrapS = terrainTexture.wrapT = THREE.RepeatWrapping;
terrainTexture.repeat.set(10, 10);  
const bumpTexture = textureLoader.load('bump.jpg');
bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;
bumpTexture.repeat.set(10, 10);

const geometry = new THREE.BufferGeometry();
const positions = [];
const uvs = [];  
const normals = [];
const indices = [];

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        const px = x;
        const py = y;
        const pz = heightmap[y][x]; 
        positions.push(px, pz, py);
        
        const u = x / width;
        const v = y / height;
        uvs.push(u, v);

        // Temporarily set normals to zero. They will be recalculated later.
        normals.push(0, 0, 0);

        if (x < width - 1 && y < height - 1) {
            const i = y * width + x;
            const i1 = i + 1;
            const i2 = i + width;
            const i3 = i2 + 1;

            indices.push(i, i1, i2);
            indices.push(i1, i3, i2);
        }
    }
}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));  // Set UVs
geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
geometry.setIndex(indices);

geometry.computeVertexNormals();

const material = new THREE.MeshStandardMaterial({
    map: terrainTexture,
    bumpScale: 1.5,
    bumpMap: bumpTexture,
    side: THREE.DoubleSide,
    roughness: 1,
});

const terrainMesh = new THREE.Mesh(geometry, material);
terrainMesh.castShadow = true;
terrainMesh.receiveShadow = true;

scene.add(terrainMesh);

const rotationAngle = Math.PI / 2; 
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), rotationAngle); 

terrainMesh.position.x = -height/2;
terrainMesh.position.z = -height/2;
groundBody.position.copy(terrainMesh.position);

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

/* turbines animation */
//front left turbine
const mixer5 = new THREE.AnimationMixer(body.turbines.children[0]);
const forwardTurbines1 = mixer5.clipAction(body.turbines.children[0].animations[0]);
const backwardTurbines1 = mixer5.clipAction(body.turbines.children[0].animations[1]);
//back left turbine
const mixer6 = new THREE.AnimationMixer(body.turbines.children[2]);
const forwardTurbines2 = mixer6.clipAction(body.turbines.children[0].animations[0]);
const backwardTurbines2 = mixer6.clipAction(body.turbines.children[0].animations[1]);

//front right turbine
const mixer7 = new THREE.AnimationMixer(body.turbines.children[1]);
const forwardTurbines3 = mixer7.clipAction(body.turbines.children[1].animations[0]);
const backwardTurbines3 = mixer7.clipAction(body.turbines.children[1].animations[1]);

//back rigth turbine
const mixer8 = new THREE.AnimationMixer(body.turbines.children[3]);
const forwardTurbines4 = mixer8.clipAction(body.turbines.children[1].animations[0]);
const backwardTurbines4 = mixer8.clipAction(body.turbines.children[1].animations[1]);

const clock = new THREE.Clock();


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
    mixer5.update(delta);
    mixer6.update(delta);
    mixer7.update(delta);
    mixer8.update(delta);

    if (bodyPhisical.angle > 0.1) {
        bodyPhisical.angle = 0; // Simple stabilization
    }

    body.position.copy(bodyPhisical.position);
    body.quaternion.copy(bodyPhisical.quaternion);

    windowMesh.position.set(bodyPhisical.position.x + 2,bodyPhisical.position.y+0.5, bodyPhisical.position.z + 4.6);

    CubeCamera.position.copy(windowMesh.position);
    CubeCamera.update(renderer,scene);


    renderer.render( scene, currentCamera );

}




function generateHeightmap(width, height, scale = 50) {
    const data = [];
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        const value = simplex.noise2D(x / scale , y / scale );
        row.push(value * scale / 2);
      }
      data.push(row);
    }
    return data;
}