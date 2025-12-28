import { Command } from './Command';

export class MovePigeonCommand extends Command {

    constructor(pigeon, moveX = 0, jump = false) {
        super();
        this.pigeon = pigeon;
        this.moveX = moveX;
        this.jump = jump;
    }

    execute() {
        const pigeon = this.pigeon;
        const sprite = pigeon.sprite;

        //Si está stunado no permite moverse ni reproducir caminata
        if (pigeon.stunned) {
            sprite.setVelocityX(0);
            pigeon.playAnimation('idle');
            return;
        }

        //Flip según movimiento, teniendo en cuenta sprites invertidos
        if (this.moveX > 0) {
            pigeon.facing = 'right';
        } else if (this.moveX < 0) {
            pigeon.facing = 'left';
        }

        if (this.moveX !== 0) {
            const desiredFlip = pigeon.invertFlipForMovement ? (this.moveX > 0) : (this.moveX < 0);
            sprite.setFlipX(desiredFlip);
        }

        //Velocidad horizontal
        sprite.setVelocityX(this.moveX * pigeon.speed);

        //Reproducir animación correcta
        if (this.moveX !== 0) {
            pigeon.playAnimation('walk');
            pigeon.currentAnim = 'walk';
        } else {
            pigeon.playAnimation('idle');
            pigeon.currentAnim = 'idle';
        }

        //Saltar únicamente si está en el suelo
        if (this.jump) {
            const body = sprite.body;
            const onGround = body && (typeof body.onFloor === 'function'
                ? body.onFloor()
                : ((body.blocked && body.blocked.down) || (body.touching && body.touching.down)));

            if (onGround) {
                sprite.setVelocityY(-pigeon.jumpSpeed);
            }
        }
    }
}
