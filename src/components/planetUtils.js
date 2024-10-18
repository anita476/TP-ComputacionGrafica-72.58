import * as THREE from 'three';
import SimplexNoise from 'simplex-noise';

const radius = 800; 
const widthSegments = 64;
const heightSegments = 64;
const simplex = new SimplexNoise();

export function createPlanet(){
    /* Create planet */

const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

const positions = sphereGeometry.attributes.position.array;

for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];

    const noise = simplex.noise3D(x / 6, y / 20, z / 6); //distance between which to apply
    
    positions[i] *= (1 + noise * 0.1);     // x
    positions[i + 1] *= (1 + noise * 0.08); // y
    positions[i + 2] *= (1 + noise * 0.1); // z
}

sphereGeometry.attributes.position.needsUpdate = true;

const textureLoader = new THREE.TextureLoader();
const planetTexture = textureLoader.load('mars_texture.jpg'); 
const planetMaterial = new THREE.MeshPhongMaterial({ map: planetTexture });
const planetMesh = new THREE.Mesh(sphereGeometry, planetMaterial);
planetMesh.position.y -= radius;

return planetMesh;
}