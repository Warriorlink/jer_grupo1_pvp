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

        this.facing = 'right';
        this.stunned = false;
        this.stunTimeout = null;
        this.defaultStunDuration = 3000;
        this.knockbackExpire = null;

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

        
        const initialFlip = this.invertFlipForMovement ? true : false;
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
        const key = `${this.character}_${animName}`; // ej. palomon_walk
        // comprobación para evitar errores "missing animation" y loguearlo
        if (!this.scene.anims.exists(key)) {
            // WARNING en consola para depuración
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
    stun(durationMs = null) {
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
}
