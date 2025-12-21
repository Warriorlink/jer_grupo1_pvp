import { Item } from './Item.js'

export class Basura extends Item {

    constructor(scene, x, y) {
        super(scene, x, y, 'basura');
    }

    applyEffect(pigeon) {

        const decrease = 100;
        const duration = 5000;

        //Reproducir sonido de recogida de la basura
        this.scene.sound.play('SonidoBasura', {
            volume: 0.5
        });

        //Mostrar el icono del powerup
        this.showItemIcon(pigeon, 'iconBasura', duration);

        //Aplicar reducción de velocidad
        pigeon.applyModifier('speed', -decrease, duration);
    }
}