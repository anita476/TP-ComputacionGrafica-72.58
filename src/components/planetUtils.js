import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import SimplexNoise from 'simplex-noise';

const radius = 700; 
const widthSegments = 64;
const heightSegments = 64;
const simplex = new SimplexNoise();
let id;
let phisicalBody;

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
    const planetMaterial = new THREE.MeshBasicMaterial({ map: planetTexture });
    const planetMesh = new THREE.Mesh(sphereGeometry, planetMaterial);

    const boundingBox = new CANNON.Sphere(radius);
    phisicalBody = new CANNON.Body({
        mass: 0, 
        position: new CANNON.Vec3(planetMesh.position.x, planetMesh.position.y, planetMesh.position.z),
        shape: boundingBox,
    });
    id = phisicalBody.id;
    console.log(phisicalBody.id);
    world.addBody(phisicalBody);



    return planetMesh;
}

export function getPlanetId() {
    if (id) {
        return id;
    }
}

export function getPlanetPhisical() {
    return phisicalBody;
}