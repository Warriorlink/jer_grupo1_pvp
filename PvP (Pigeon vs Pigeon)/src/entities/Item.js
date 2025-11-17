export class Item {

    constructor(scene, x, y, sprite) {
        this.scene = scene;

        this.sprite = scene.physics.add.sprite(x, y, sprite);
        this.sprite.setDisplaySize(40, 40);
        this.sprite.setImmovable(true);
        this.sprite.body.allowGravity = false;

        // Referencia inversa útil para saber qué objeto se recogió
        this.sprite.item = this;
    }

    // 💡 Cada ítem tendrá SU PROPIO efecto
    applyEffect(pigeon) {
        console.warn("applyEffect() no implementado en el item");
    }

    destroy() {
        this.sprite.destroy();
    }
}