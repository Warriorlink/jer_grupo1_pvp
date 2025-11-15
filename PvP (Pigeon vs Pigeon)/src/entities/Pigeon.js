export class Pigeon {

    constructor(scene, id, x, y) {
        this.scene = scene;
        this.id = id;
        this.score = 0;

        this.baseWidth = 20;
        this.baseHeight = 100;
        this.baseSpeed = 300; 
        this.baseJumpSpeed = 470;

        this.sprite = this.scene.physics.add.sprite(x, y, 'palomon');
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.allowGravity = true;
    }
}