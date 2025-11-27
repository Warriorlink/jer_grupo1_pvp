import { Command } from './Command';

export class AttackPigeonCommand extends Command {
    constructor(pigeon) {
        super();
        this.pigeon = pigeon;
    }

    execute() {
        const scene = this.pigeon.scene;
        const now = scene.time.now;

        //No puede atacar si está stunada
        if (this.pigeon.stunned) return;

        //Comprobar si puede atacar
        if (!this.pigeon.canAttack(now)) return;

        //Marcar ataque
        this.pigeon.markAttacked(now);
        this.pigeon.startAttackAnimation();
        this.pigeon.showAttackSprite(250);
        scene.sound.play('SonidoAtaque', { volume: 0.7 });

        const dir = this.pigeon.facing === 'right' ? 1 : -1;
        const x = this.pigeon.sprite.x + dir * this.pigeon.attackRange;
        const y = this.pigeon.sprite.y;

        //Crear hitbox físico temporal (invisible)
        const hitbox = scene.physics.add.sprite(x, y, null);
        hitbox.setVisible(false);
        hitbox.body.setAllowGravity(false);
        hitbox.body.setImmovable(true);
        hitbox.setSize(this.pigeon.attackRange, this.pigeon.baseHeight * 0.6);

        //Comprobar colisiones con otras palomas
        const overlap = scene.physics.add.overlap(hitbox, scene.playerSprites, (hb, targetSprite) => {
            if (targetSprite === this.pigeon.sprite) return;
            const targetPigeon = targetSprite.pigeon;
            if (!targetPigeon) return;

            // Knockback según dirección del atacante
            const knock = this.pigeon.attackForce * dir;

            // 1) STUN primero
            targetPigeon.stun();

            // 2) y DESPUÉS aplicar knockback final
            targetPigeon.takeHit(knock);
            
            //Evitar múltiples impactos por el mismo ataque
            if (overlap && scene.physics && scene.physics.world) {
                scene.physics.world.removeCollider(overlap);
            }
        });

        //Destruir hitbox pasado un tiempo corto
        scene.time.delayedCall(120, () => {
            if (overlap && scene.physics && scene.physics.world) {
                scene.physics.world.removeCollider(overlap);
            }
            if (hitbox && hitbox.destroy) hitbox.destroy();
        });
    }
}