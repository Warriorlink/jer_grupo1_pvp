export class Pigeon {

    constructor(scene, id, x, y, character) {
        this.scene = scene;
        this.id = id;
        this.character = character;
        this.score = 0;

        this.baseSpeed = 300;
        this.baseJumpSpeed = 400;

        this.attackCooldown = 500;
        this.lastAttackTime = 0;
        this.attackRange = 40;
        this.attackForce = 200;
        this.stunForce = 3000;

        this.facing = 'right';
        this.stunned = false;
        this.stunTimeout = null;
        this.defaultStunDuration = 3000;
        this.knockbackExpire = null;

        this.isAttacking = false;

        let textureKey = null;
        if (character === "palomon") {
            textureKey = "palomonSheet";
        } else if (character === "dovenando") {
            textureKey = "dovenandoSheet";
        } else {
            console.error("Personaje desconocido:", character);
            textureKey = "palomonSheet";
        }


        this.sprite = this.scene.physics.add.sprite(x, y, textureKey);
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.allowGravity = true;


        this.sprite.pigeon = this;


        this.invertFlipForMovement = (character === "dovenando");

        this.sprite.setFlipX(this.invertFlipForMovement);
    }

    // Determina si la paloma puede atacar
    canAttack(now) {
        now = now || this.scene.time.now;
        return (now - this.lastAttackTime) >= this.attackCooldown;
    }

    // Marca el tiempo del último ataque
    markAttacked(now) {
        this.lastAttackTime = now || this.scene.time.now;
    }

    // Reproduce la animación correcta según el personaje y el nombre (idle, walk...)
    playAnimation(animName) {
        if (this.isAttacking) return; // NO INTERRUMPIR ATAQUE

        const key = `${this.character}_${animName}`;

        if (!this.scene.anims.exists(key)) {
            console.warn(`Animación no existe: ${key}`);
            return;
        }

        this.sprite.anims.play(key, true);
    }


    // Aplica knockback/efecto visual de recibir golpe
    takeHit(knockbackX = 0) {
        this.sprite.setVelocityX(knockbackX);

        // permitir que el knockback no sea anulado por el update durante un breve tiempo
        this.knockbackExpire = this.scene.time.now + 200;

        if (this.stunned) return;

        this.sprite.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
            if (!this.stunned) this.sprite.clearTint();
        });
    }

    // Aplica stun
    stun(durationMs) {
        durationMs = durationMs == null ? this.defaultStunDuration : durationMs;
        if (this.stunned) return;

        this.stunned = true;
        this.sprite.setTint(0x9999ff);
        this.sprite.setVelocityX(0);

        this.stunTimeout = this.scene.time.delayedCall(durationMs, () => {
            this.stunned = false;
            this.sprite.clearTint();
            this.stunTimeout = null;
        });
    }

    startAttackAnimation() {
        if (this.isAttacking) return;
        this.isAttacking = true;

        const key = `${this.character}_attack`;

        // Usar animación si existe, si no ignorar
        if (this.scene.anims.exists(key)) {
            this.sprite.anims.play(key, true);
        }

        // Si está mirando al contrario, mantener flip
        this.sprite.setFlipX(this.facing === "left" ? !this.invertFlipForMovement : this.invertFlipForMovement);

        // Volver a animación normal tras el ataque
        this.scene.time.delayedCall(250, () => {   // Duración aproximada del ataque
            this.endAttackAnimation();
        });
    }

    endAttackAnimation() {
        this.isAttacking = false;

        // Si está quieto → idle
        if (this.sprite.body.velocity.x === 0) {
            this.playAnimation("idle");
        }
        else {
            this.playAnimation("walk");
        }
    }

    showAttackSprite(durationMs = 250) {
        const scene = this.scene;
        const key = this.character === 'dovenando' ? 'dovenandoAttack' : 'palomonAttack';

        // Crear sprite visual del ataque
        const attackSprite = scene.add.sprite(this.sprite.x, this.sprite.y, key);
        attackSprite.setOrigin(0.5, 0.5);
        attackSprite.setDepth(this.sprite.depth + 1);

        // Ajuste inicial según dirección
        const offsetX = this.facing === 'right' ? 20 : -20; // distancia delante de la paloma
        attackSprite.x += offsetX;

        // Voltear sprite según dirección
        attackSprite.setFlipX(this.facing === 'left');

        // Evento para seguir a la paloma
        const followEvent = scene.time.addEvent({
            delay: 16, // aprox 60fps
            loop: true,
            callback: () => {
                attackSprite.x = this.sprite.x + offsetX;
                attackSprite.y = this.sprite.y; // puedes ajustar vertical si quieres
            }
        });

        // Destruir el sprite y detener seguimiento después de durationMs
        scene.time.delayedCall(durationMs, () => {
            followEvent.remove(false);
            attackSprite.destroy();
        });
    }


}
