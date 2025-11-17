import {Item} from './Item.js'

export class Churro extends Item {
    
    constructor(scene, x, y) {
        super(scene, x, y,'churro');
    }

    applyEffect(pigeon){
        pigeon.score++;
        console.log(`${pigeon.id} recogió un Churro → score: ${pigeon.score}`);
    }
}