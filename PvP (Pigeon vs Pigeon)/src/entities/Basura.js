import {Item} from './Item.js'

export class Basura extends Item {
    
    constructor(scene, x, y) {
        super(scene, x, y,'basura');
    }

    applyEffect(pigeon) {
        this.scene.sound.play('SonidoBasura', {
            volume: 0.5
        });

        const decrease = 100;
        const duration = 5000;

        // Mostrar el icono del powerup
        this.showItemIcon(pigeon, 'iconBasura', duration);

        pigeon.applyModifier('speed',-decrease, duration);
    }
}