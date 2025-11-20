import {Item} from './Item.js'

export class Basura extends Item {
    
    constructor(scene, x, y) {
        super(scene, x, y,'basura');
    }

    applyEffect(pigeon) {

        const slowSpeed = 100;
        const normalSpeed = 300;

        // Aplicar velocidad reducida inmediatamente
        pigeon.baseSpeed = slowSpeed;

        // Restaurar velocidad después de 5 segundos
        this.scene.time.addEvent({
            delay: 5000,
            callback: () => {
                pigeon.baseSpeed = normalSpeed;
            }
        });
    }
}