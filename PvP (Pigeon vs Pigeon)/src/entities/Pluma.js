import {Item} from './Item.js'

export class Pluma extends Item {
    
    constructor(scene, x, y) {
        super(scene, x, y,'pluma');
    }

    applyEffect(pigeon){
 
        console.log(`${pigeon.id} recogió pluma`);
    }
}