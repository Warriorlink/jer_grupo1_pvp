import { Command } from './Command';

export class MovePigeonCommand extends Command {

    // moveX: -1 (izq), 0, 1 (der). jump: true si intenta saltar
    constructor(pigeon, moveX = 0, jump = false) {
        super();
        this.pigeon = pigeon;
        this.moveX = moveX;
        this.jump = jump;
    }

    execute() {
        const sprite = this.pigeon.sprite;

        // si está stunado no permite moverse ni saltar
        if (this.pigeon.stunned) {
            sprite.setVelocityX(0);
            return;
        }

        // actualizar facing según movimiento horizontal
        if (this.moveX > 0) this.pigeon.facing = 'right';
        else if (this.moveX < 0) this.pigeon.facing = 'left';

        // Aplicar velocidad lateral según moveX
        sprite.setVelocityX(this.moveX * this.pigeon.baseSpeed);

        // Si se intenta saltar, sólo aplicar si está en el suelo
        if (this.jump) {
            const body = sprite.body;
            const onGround = body && (typeof body.onFloor === 'function'
                ? body.onFloor()
                : ((body.blocked && body.blocked.down) || (body.touching && body.touching.down)));

            if (onGround) {
                sprite.setVelocityY(-this.pigeon.baseJumpSpeed);
            }
        }
    }
}