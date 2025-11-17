import {Item} from './Item.js'

export class Basura extends Item {
    
    constructor(scene, x, y) {
        super(scene, x, y,'basura');
    }

    applyEffect(pigeon){
 
        console.log(`${pigeon.id} recogió basura`);
    }
}