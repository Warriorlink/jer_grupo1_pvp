import {Item} from './Item.js'

export class Basura extends Item {
    
    constructor(scene, x, y) {
        super(scene, x, y,'basura');
    }

    applyEffect(pigeon) {
        this.scene.sound.play('SonidoBasura', {
            volume: 0.5
        });

        const slowSpeed = 100;
        const normalSpeed = 300;
        const duration = 5000;

        // Mostrar el icono del powerup
        this.showItemIcon(pigeon, 'iconBasura', duration);

        // Aplicar velocidad reducida inmediatamente
        pigeon.baseSpeed = slowSpeed;
        // Restaurar velocidad después de 5 segundos
        this.scene.time.addEvent({
            delay: duration,
            callback: () => {
                pigeon.baseSpeed = normalSpeed;
            }
        });
    }
}