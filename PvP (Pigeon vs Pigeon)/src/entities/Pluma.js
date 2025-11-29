import {Item} from './Item.js'

export class Pluma extends Item {
    
    constructor(scene, x, y) {
        super(scene, x, y,'pluma');
    }

    applyEffect(pigeon){

        this.scene.sound.play('SonidoPluma', {
            volume: 0.5
        });
 
       
        const increase = 200;
        const duration = 5000;

        // Mostrar el icono del powerup
        this.showItemIcon(pigeon, 'iconPluma', duration);
        pigeon.applyModifier('speed',increase, duration);
      
    }
}