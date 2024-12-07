import * as THREE from 'three';

import {BLLeg, BRLeg, createBackLeft, createBackRight, createBody , createBodyRings, createFrontLeft, createFrontRight, createInside, createLeftDoor, createRightDoor, FLLeg, FRLeg} from './vehicleUtils.js';



class Vehicle extends THREE.Group{
    constructor(){
        super();
        this.rings = createBodyRings();
        this.add(this.rings);
        this.body = createBody();
        this.add(this.body);

        this.turbines = new THREE.Group();

        this.add(this.turbines);

        this.turbines.add(createFrontLeft(),createFrontRight(),createBackLeft(),createBackRight());

        this.legs = new THREE.Group();
        this.add(this.legs);
        this.legs.add(FLLeg(),BLLeg(),FRLeg(),BRLeg());

        this.doors = new Door();
        this.add(this.doors);
        

    }
    turnBladesVertical(){
        this.turbines.children.forEach(child => { child.turnBladesVertical()});
    }

    turnBladesHorizontal(){
        this.turbines.children.forEach(child => { child.turnBladesHorizontal()});
    }
    animationHorizontal(rotationSpeed){
        this.turbines.children.forEach(child => { child.animationHorizontal(rotationSpeed)});
    }

    turnBackLightGreen(){
        this.body.traverse((child) => {
            if (child.isPointLight) {
              child.color.set(0x25a608);  
            }
          });
    }
    turnBackLightRed(){
        this.body.traverse((child) => {
            if (child.isPointLight) {
              child.color.set(0xcf1208);  
            }
          });
    }
    turnBackLightNormal(){
        this.body.traverse((child) => {
            if (child.isPointLight) {
              child.color.set(0xFCF9D9);  
            }
          });
    }
    turnLightsOff(){
        this.body.traverse((child)=>{
            if(child.isPointLight) {
                child.intensity = 0;
            }
        });
        this.rings.traverse((child)=>{
            if(child.isPointLight) {
                child.intensity = 0;
            }
        })
    }
    turnLightsOn(){
        this.body.traverse((child)=>{
            if(child.isPointLight){
                child.intensity = 0.5;
            }
        });
        this.rings.traverse((child)=>{
            if(child.isPointLight){
                child.intensity = 0.5;
            }
        })
    }
    animationVertical(rotationSpeed){
        this.turbines.children.forEach(child => { child.animationVertical(rotationSpeed)});
    }
}
export {Vehicle};

class Door extends THREE.Group{
    
    constructor(){
        super();
        this.inside = createInside();
        this.add(this.inside);
        

        this.door1 = createLeftDoor(); 
        this.add(this.door1);

        this.door2 = createRightDoor();
        this.add(this.door2);

    }
}
