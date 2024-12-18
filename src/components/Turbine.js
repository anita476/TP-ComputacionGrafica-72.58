import * as THREE from 'three';

import {createBladeGroup , createTurbine } from './vehicleUtils.js';




class Turbine extends THREE.Group{
    constructor(){
        super();
        this.blades = createBladeGroup();
        this.turbineContainer = createTurbine();
        this.add(this.turbineContainer);
        this.add(this.blades);
        this.isVertical = false;
    }

    turnBladesVertical(){
        if(!this.isVertical){
        this.isVertical = true;
        this.blades.children.forEach(child => {
            child.rotateY(Math.PI /2);
        });
        }
    }
    turnBladesHorizontal(){
        if(this.isVertical){
        this.isVertical = false;
        this.blades.children.forEach(child => {
            child.rotateY(-Math.PI /2);
        });
        }
    }
    animationHorizontal(rotationSpeed){
        if(!this.isVertical){
        this.blades.rotation.z += rotationSpeed;
        }
    }
    animationVertical(rotationSpeed){
        if(this.isVertical){
        this.blades.rotation.z -= rotationSpeed;
        }
    }
    
}

export {Turbine};