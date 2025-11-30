import { Item } from './Item.js'

export class Pluma extends Item {

    constructor(scene, x, y) {
        super(scene, x, y, 'pluma');
    }

    applyEffect(pigeon) {

        const increase = 200;
        const duration = 5000;

        //Reproducir sonido de recogida de la pluma
        this.scene.sound.play('SonidoPluma', {
            volume: 0.5
        });

        //Mostrar el icono del powerup
        this.showItemIcon(pigeon, 'iconPluma', duration);

        //Aplicar aumento de velocidad
        pigeon.applyModifier('speed', increase, duration);

    }
}
