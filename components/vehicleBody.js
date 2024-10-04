import * as THREE from 'three';

import {createBody , createBodyRings } from './vehicleUtils.js';
import { exp } from 'three/webgpu';



class Vehicle extends THREE.Group{
    constructor(){
        super();
        this.rings = createBodyRings();
        this.add(this.rings);
        this.body = createBody();
        this.add(this.rings);
        //add all 4 turbines -> turbineGroup extends Turbine... redefine methods ... .
        //add landing supports 
        // add opening doors -> method door open, door close animation 
        // add stairs -> method display stairs, hide stairs..

    }

}
export {Vehicle};