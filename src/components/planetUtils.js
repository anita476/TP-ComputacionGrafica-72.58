import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import SimplexNoise from 'simplex-noise';

const radius = 400; 
const widthSegments = 64;
const heightSegments = 64;
const simplex = new SimplexNoise();
let id;
let phisicalBody;
var mountains =[]; /* not used rn */

export function createPlanet(world) {
    // Create sphere geometry
    const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const positions = sphereGeometry.attributes.position.array;
    const vertices = [];

   
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];
        vertices.push(positions[i], positions[i + 1], positions[i + 2]);
    }

    sphereGeometry.attributes.position.needsUpdate = true;

    const textureLoader = new THREE.TextureLoader();
    const planetTexture = textureLoader.load('cliff.jpg'); 
    const planetMaterial = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff , roughness:0, metalness:0.9 });
    const planetMesh = new THREE.Mesh(sphereGeometry, planetMaterial);

    const boundingBox = new CANNON.Sphere(radius);
    phisicalBody = new CANNON.Body({
        mass: 0, 
        position: new CANNON.Vec3(planetMesh.position.x, planetMesh.position.y, planetMesh.position.z),
        shape: boundingBox,
    });
    id = phisicalBody.id;
    world.addBody(phisicalBody);



    return planetMesh;
}

export function getPlanetId() {
    if (id) {
        return id;
    }
}

export function getPlanetPhisical() {
    if(phisicalBody){
    return phisicalBody;
    }
}
export function getMountains(){
    if(mountains){
        return mountains;
    }
}

/* returns a pair [mesh, cannon-body] */
function createRandomCone(minHeight, maxHeight, minRadius, maxRadius) {

    const height = Math.random() * (maxHeight - minHeight) + minHeight;
    const radius = Math.random() * (maxRadius - minRadius) + minRadius;
    const coneGeometry = new THREE.ConeGeometry(radius, height, 200);
    const coneMaterial = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff , roughness:0, metalness:0.9});
    const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);

    const coneBody = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(coneMesh.position.x, coneMesh.position.y, coneMesh.position.z) 
    }); 
    
    // Create a cylinder shape for the cone
    const coneShape = new CANNON.Cylinder(radius/2,radius,height,20);
    coneBody.addShape(coneShape);


    return [coneMesh, coneBody];
}



//add all mountains
export function createMountainMeshesAndBodies(scene, world){
    const planetGroup = new THREE.Group;
    const planetPhisicalGroup = new THREE.Group;
    //first group
    const refCirc =  new THREE.EllipseCurve(0,0,radius,radius);
    for(var i = 0; i < 1 ; i+= (1/8)){
        const position = refCirc.getPointAt(i);
        const cone = createRandomCone(200,300,100,150);
        cone[0].position.x += position.x;
        cone[0].position.y += position.y;
        cone[0].position.z = 0;
        cone[0].rotation.z += Math.PI * i*2;
        cone[0].rotation.z  -= Math.PI/2;
        //body at same position as cone mesh
        cone[1].position.copy(cone[0].position);
        cone[1].quaternion.copy(cone[0].quaternion);

        scene.add(cone[0]); 
        world.addBody(cone[1]);

        mountains.push(cone);


    }
    for(var i = 1/6; i < 1 ; i+= (1/6)){
        const position = refCirc.getPointAt(i);
        const cone = createRandomCone(200,300,100,150);
        cone[0].position.x += position.x;
        cone[0].position.y += position.y;
        cone[0].position.z += radius/4;
        cone[0].rotation.z += Math.PI * i*2;
        cone[0].rotation.z  -= Math.PI/2;
        //body at same position as cone mesh
        cone[1].position.copy(cone[0].position);
        cone[1].quaternion.copy(cone[0].quaternion);

        scene.add(cone[0]); 
        world.addBody(cone[1]);

        mountains.push(cone);
    }
    for(var i = 0; i < 1 ; i+= (1/10)){
        const position = refCirc.getPointAt(i);
        const cone = createRandomCone(200,300,100,150);
        cone[0].position.x += position.x;
        cone[0].position.y += position.y;
        cone[0].position.z -= radius/4;
        cone[0].rotation.z += Math.PI * i*2;
        cone[0].rotation.z  -= Math.PI/2;
        //body at same position as cone mesh
        cone[1].position.copy(cone[0].position);
        cone[1].quaternion.copy(cone[0].quaternion);

        scene.add(cone[0]); 
        world.addBody(cone[1]);

        mountains.push(cone);
    }

    // second group 
    const refCirc2=  new THREE.EllipseCurve(0,0,radius * 7/8 , radius * 7/8);
    for(var i = 0; i < 1 ; i+= (1/8)){
        const position = refCirc2.getPointAt(i);
        const cone = createRandomCone(200,300,100,150);
        cone[0].position.x += position.x;
        cone[0].position.y += position.y;
        cone[0].position.z += radius/2;
        cone[0].rotation.z += Math.PI * i*2;
        cone[0].rotation.z  -= Math.PI/2;
        cone[0].rotateX(Math.PI/4);

        //body at same position as cone mesh
        cone[1].position.copy(cone[0].position);
        cone[1].quaternion.copy(cone[0].quaternion);

        scene.add(cone[0]);
        world.addBody(cone[1]);

        mountains.push(cone);

    }
    // third group 
    const refCirc3=  new THREE.EllipseCurve(0,0,radius * 7/8 , radius * 7/8);
    for(var i = 0; i < 1 ; i+= (1/8)){
        const position = refCirc3.getPointAt(i);
        const cone = createRandomCone(200,300,100,150);
        cone[0].position.x += position.x;
        cone[0].position.y += position.y;
        cone[0].position.z -= radius/2;
        cone[0].rotation.z += Math.PI * i*2;
        cone[0].rotation.z  -= Math.PI/2;
        cone[0].rotateX(-Math.PI/4);

        // body at the same position as cone mesh
        cone[1].position.copy(cone[0].position);
        cone[1].quaternion.copy(cone[0].quaternion);

        scene.add(cone[0]);
        world.addBody(cone[1]);

        mountains.push(cone);

    }
    // fourth group 
    const refCirc4=  new THREE.EllipseCurve(0,0,radius /2 , radius / 2);
    for(var i = 0; i < 1 ; i+= (1/8)){
        const position = refCirc4.getPointAt(i);
        const cone = createRandomCone(200,300,100,150);
        cone[0].position.x += position.x;
        cone[0].position.y += position.y;
        cone[0].position.z += radius * 7/8;
        cone[0].rotation.z += Math.PI * i*2;
        cone[0].rotation.z  -= Math.PI/2;
        cone[0].rotateX(Math.PI/4);

        //body at same position as cone mesh
        cone[1].position.copy(cone[0].position);
        cone[1].quaternion.copy(cone[0].quaternion);

        scene.add(cone[0]);
        world.addBody(cone[1]);

        mountains.push(cone);

    }
    // fifth group 
    const refCirc5=  new THREE.EllipseCurve(0,0,radius /2 , radius / 2);
    for(var i = 0; i < 1 ; i+= (1/8)){
        const position = refCirc5.getPointAt(i);
        const cone = createRandomCone(200,300,100,150);
        cone[0].position.x += position.x;
        cone[0].position.y += position.y;
        cone[0].position.z -= radius * 7/8;
        cone[0].rotation.z += Math.PI * i*2;
        cone[0].rotation.z  -= Math.PI/2;
        cone[0].rotateX(-Math.PI/4);

        //body at same position as cone mesh
        cone[1].position.copy(cone[0].position);
        cone[1].quaternion.copy(cone[0].quaternion);

        scene.add(cone[0]);
        world.addBody(cone[1]);

        mountains.push(cone);

    }

    // create cones for poles
        const cone = createRandomCone(200,300,100,150);
        cone[0].position.x = 0;
        cone[0].position.y = 0;
        cone[0].position.z = radius;
        cone[0].rotation.x += Math.PI/2;

        //body at same position as cone mesh
        cone[1].position.copy(cone[0].position);
        cone[1].quaternion.copy(cone[0].quaternion);

        scene.add(cone[0]);
        world.addBody(cone[1]);

        mountains.push(cone);

        const cone2 = createRandomCone(200,300,100,150);
        cone2[0].position.x = 0;
        cone2[0].position.y = 0;
        cone2[0].position.z = -radius;
        cone2[0].rotation.x -= Math.PI/2;

        //body at same position as cone mesh
        cone2[1].position.copy(cone2[0].position);
        cone2[1].quaternion.copy(cone2[0].quaternion);

        scene.add(cone2[0]);
        world.addBody(cone2[1]);

        mountains.push(cone2);
    
}


export function createStars() {
    const cloudParticles = 100000; 
    const cloudRadius = 1000;       //cover the whole space
    const points = new Float32Array(cloudParticles * 3);  

    for (let i = 0; i < cloudParticles; i++) {
        const theta = Math.random() * Math.PI * 2; 
        const phi = Math.acos(Math.random() * 2 - 1); 
        const radius = Math.cbrt(Math.random()) * cloudRadius; 

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        points[i * 3] = x; 
        points[i * 3 + 1] = y; 
        points[i * 3 + 2] = z;  
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));

    const material = new THREE.PointsMaterial({
        size: 0.5,  
        color: 0xffffff,  
        opacity: 0.6, 
        transparent: true,  
        sizeAttenuation: true 
    });
    const cloud = new THREE.Points(geometry, material);
    return cloud;
}