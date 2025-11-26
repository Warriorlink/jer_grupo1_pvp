import {Item} from './Item.js'

export class Churro extends Item {
    
    constructor(scene, x, y) {
        super(scene, x, y,'churroSheet');
        
        this.sprite.play('churro_anim');
    }

    applyEffect(pigeon){
        this.scene.sound.play('SonidoChurro', {
            volume: 0.5
        });
        pigeon.score++;
        console.log(`${pigeon.id} recogió un Churro → score: ${pigeon.score}`);
    }
}