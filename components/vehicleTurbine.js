import * as THREE from 'three';

import {createBladeGroup , createTurbine } from './vehicleUtils.js';




class turbineGroup extends THREE.Group{
    
    constructor(){
        super();
        this.blades = createBladeGroup();
        this.turbineContainer = createTurbine();
        this.add(this.turbineContainer);
        this.add(this.blades);
        this.isVertical = false;
    }

    turnBladesVertical(){
        this.isVertical = true;
        this.blades.children.forEach(child => {
            child.rotateY(Math.PI /2);
        });
    }
    turnBladesHorizontal(){
        this.isVertical = false;
        this.blades.children.forEach(child => {
            child.rotateY(-Math.PI /2);
        });
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

export {turbineGroup};