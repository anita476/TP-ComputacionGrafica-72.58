import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import SimplexNoise from 'simplex-noise';



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