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
        const pigeon = this.pigeon;
        const sprite = pigeon.sprite;

        // Si está stunado no permite moverse ni reproducir caminata
        if (pigeon.stunned) {
            sprite.setVelocityX(0);
            // usar el método del pigeon para reproducir la animación correcta
            pigeon.playAnimation('idle');
            return;
        }

        // --- Flip según movimiento, teniendo en cuenta sprites invertidos ---
        // Si pigeon.invertFlipForMovement === false (normal):
        //    flipX = true cuando moveX < 0 (mirar izquierda)
        // Si pigeon.invertFlipForMovement === true (sprite invertido):
        //    flipX = true cuando moveX > 0 (mirar derecha)
        if (this.moveX > 0) {
            pigeon.facing = 'right';
        } else if (this.moveX < 0) {
            pigeon.facing = 'left';
        }

        if (this.moveX !== 0) {
    const desiredFlip = pigeon.invertFlipForMovement ? (this.moveX > 0) : (this.moveX < 0);
    sprite.setFlipX(desiredFlip);
}

        // Velocidad horizontal
        sprite.setVelocityX(this.moveX * pigeon.baseSpeed);

        // Reproducir animación correcta desde el pigeon (prefijo por personaje)
        if (this.moveX !== 0) {
            pigeon.playAnimation('walk');
        } else {
            pigeon.playAnimation('idle');
        }

        // Salto únicamente si está en el suelo
        if (this.jump) {
            const body = sprite.body;
            const onGround = body && (typeof body.onFloor === 'function'
                ? body.onFloor()
                : ((body.blocked && body.blocked.down) || (body.touching && body.touching.down)));

            if (onGround) {
                sprite.setVelocityY(-pigeon.baseJumpSpeed);
            }
        }
    }
}
