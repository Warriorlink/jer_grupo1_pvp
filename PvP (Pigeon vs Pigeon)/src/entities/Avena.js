import {Item} from './Item.js'

export class Avena extends Item {
    
    constructor(scene, x, y) {
        super(scene, x, y,'avena');
    }

    applyEffect(pigeon){
        this.scene.sound.play('SonidoAvena', {
            volume: 0.5
        });
 
        // Valores nuevos del power-up (temporalmente)
        const boostedKnockback = 400;       // más empuje
        const boostedStunDuration = 6000;   // stun más largo

        // Valores normales
        const normalKnockback = 200;        // coincide con Pigeon.attackForce inicial
        const normalStunDuration = 3000;    // coincide con Pigeon.defaultStunDuration

        // Aplicar potencia elevada
        pigeon.attackForce = boostedKnockback;
        pigeon.defaultStunDuration = boostedStunDuration;

        // Restaurar después de 10 segundos
        this.scene.time.addEvent({
            
            delay: 10000,
            callback: () => {
                pigeon.attackForce = normalKnockback;
                pigeon.defaultStunDuration = normalStunDuration;
            }
        });
    }
}