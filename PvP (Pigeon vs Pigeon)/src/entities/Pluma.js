import {Item} from './Item.js'

export class Pluma extends Item {
    
    constructor(scene, x, y) {
        super(scene, x, y,'pluma');
    }

    applyEffect(pigeon){
 
        const fastSpeed = 500;
        const normalSpeed = 300;

        // Aplicar velocidad reducida inmediatamente
        pigeon.baseSpeed = fastSpeed;

        // Restaurar velocidad después de 5 segundos
        this.scene.time.addEvent({
            delay: 5000,
            callback: () => {
                pigeon.baseSpeed = normalSpeed;
            }
        });
    }
}