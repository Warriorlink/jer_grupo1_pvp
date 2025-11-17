export class Churro {
    
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, 'churro');
        this.sprite.setDisplaySize(40, 40);
        this.sprite.setImmovable(true);
        this.sprite.body.allowGravity = false;
    }

    destroy() {
        this.sprite.destroy();
    }
}