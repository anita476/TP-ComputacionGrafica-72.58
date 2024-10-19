import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import SimplexNoise from 'simplex-noise';

const radius = 800; 
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

    // Modify vertex positions with noise
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];

        const noise = simplex.noise3D(x / 6, y / 20, z / 6);
        positions[i] *= (1 + noise * 0.1);     // x
        positions[i + 1] *= (1 + noise * 0.08); // y
        positions[i + 2] *= (1 + noise * 0.1); // z

        // Collect modified vertices
        vertices.push(positions[i], positions[i + 1], positions[i + 2]);
    }

    sphereGeometry.attributes.position.needsUpdate = true;

    // Create the planet mesh
    const textureLoader = new THREE.TextureLoader();
    const planetTexture = textureLoader.load('mars_texture.jpg'); 
    const planetMaterial = new THREE.MeshBasicMaterial({ map: planetTexture });
    const planetMesh = new THREE.Mesh(sphereGeometry, planetMaterial);
    planetMesh.position.y -= radius;

    // Create the CANNON body with ConvexPolyhedron
    const boundingBox = new CANNON.ConvexPolyhedron(vertices);
    phisicalBody = new CANNON.Body({
        mass: 0, 
        position: new CANNON.Vec3(planetMesh.position.x, planetMesh.position.y, planetMesh.position.z),
        shape: boundingBox,
    });
    id = phisicalBody.id;
    console.log(phisicalBody.id);
    world.addBody(phisicalBody);

    planetMesh.position.copy(phisicalBody.position);

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