import {Item} from './Item.js'

export class Avena extends Item {
    
    constructor(scene, x, y) {
        super(scene, x, y,'avena');
    }

    applyEffect(pigeon){
 
        console.log(`${pigeon.id} recogió avena`);
    }
}