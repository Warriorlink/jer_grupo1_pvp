import { Command } from './Command';

export class AttackPigeonCommand extends Command {
    constructor(pigeon) {
        super();
        this.pigeon = pigeon;
    }

    execute() {
        const scene = this.pigeon.scene;

        // Animación y feedback (el servidor ya validó)
        this.pigeon.currentAnim = 'attack';
        this.pigeon.startAttackAnimation();
        this.pigeon.showAttackSprite(250);
        scene.sound.play('SonidoAtaque', { volume: 0.7 });

        // Dirección del ataque
        const dir = this.pigeon.facing === 'right' ? 1 : -1;
        const x = this.pigeon.sprite.x + dir * this.pigeon.attackRange;
        const y = this.pigeon.sprite.y;

        // Hitbox temporal
        const hitbox = scene.physics.add.sprite(x, y, null);
        hitbox.setVisible(false);
        hitbox.body.setAllowGravity(false);
        hitbox.body.setImmovable(true);
        hitbox.setSize(this.pigeon.attackRange, this.pigeon.baseHeight * 0.6);

        const overlap = scene.physics.add.overlap(
            hitbox,
            scene.playerSprites,
            (hb, targetSprite) => {
                if (targetSprite === this.pigeon.sprite) return;

                const targetPigeon = targetSprite.pigeon;
                if (!targetPigeon) return;
                if (targetPigeon.id === this.pigeon.id) return;

                const knock = this.pigeon.attackForce * dir;
                targetPigeon.stun(this.pigeon.stunForce);
                targetPigeon.takeHit(knock);

                if (scene.physics?.world && overlap) {
                    scene.physics.world.removeCollider(overlap);
                }
            }
        );

        scene.time.delayedCall(120, () => {
            if (scene.physics?.world && overlap) {
                scene.physics.world.removeCollider(overlap);
            }
            hitbox?.destroy();
        });
    }
}
