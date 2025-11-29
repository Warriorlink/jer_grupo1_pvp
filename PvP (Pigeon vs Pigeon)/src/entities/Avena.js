import {Item} from './Item.js'

export class Avena extends Item {
    
    constructor(scene, x, y) {
        super(scene, x, y,'avena');
    }

    applyEffect(pigeon){
        this.scene.sound.play('SonidoAvena', {
            volume: 0.5
        });

        const forceBoost = 300;
        const stunBoost = 1000;        
        const duration = 5000;

        // Mostrar el icono del powerup
        this.showItemIcon(pigeon, 'iconAvena', duration);

        // Aplicar potencia elevada
        pigeon.applyModifier('attackForce', forceBoost, duration);
        pigeon.applyModifier('stunForce',stunBoost,duration);
    }
}