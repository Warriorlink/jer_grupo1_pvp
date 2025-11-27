import {Item} from './Item.js'

export class Pluma extends Item {
    
    constructor(scene, x, y) {
        super(scene, x, y,'pluma');
    }

    applyEffect(pigeon){

        this.scene.sound.play('SonidoPluma', {
            volume: 0.5
        });
 
        const fastSpeed = 500;
        const normalSpeed = 300;
        const duration = 5000;

        // Mostrar el icono del powerup
        this.showItemIcon(pigeon, 'iconPluma', duration);

        // Aplicar velocidad reducida inmediatamente
        pigeon.baseSpeed = fastSpeed;

        // Restaurar velocidad después de 5 segundos
        this.scene.time.addEvent({
            delay: duration,
            callback: () => {
                pigeon.baseSpeed = normalSpeed;
            }
        });
    }
}