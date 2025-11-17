export class Pigeon {

    constructor(scene, id, x, y, sprite) {
        this.scene = scene;
        this.id = id;
        this.score = 0;

        this.baseWidth = 20;
        this.baseHeight = 100;
        
        this.baseSpeed = 300; 
        this.baseJumpSpeed = 400;

        //Ataque de las palomas
        this.attackCooldown = 500; // ms
        this.lastAttackTime = 0;
        this.attackRange = 40;
        this.attackForce = 200;

        //Dirección a la que mira la paloma
        this.facing = 'right';

        //Stun
        this.stunned = false;
        this.stunTimeout = null;
        this.defaultStunDuration = 3000;

        this.sprite = this.scene.physics.add.sprite(x, y, sprite);
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.allowGravity = true;

        this.sprite.pigeon = this;
    }

    //Determina si la paloma puede atacar
    canAttack(now) {
        now = now || this.scene.time.now;
        return (now - this.lastAttackTime) >= this.attackCooldown;
    }

    //Marca el tiempo del último ataque
    markAttacked(now) {
        this.lastAttackTime = now || this.scene.time.now;
    }

    //Aplica el efecto de recibir un golpe
    takeHit(knockbackX = 0) {
        // aplicar empuje siempre
        this.sprite.setVelocityX(knockbackX);

        // si ya está stunada, no tocar la tint (para no sobreescribir la animación de stun)
        if (this.stunned) {
            return;
        }

        // efecto visual breve cuando no está stunada
        this.sprite.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
            // sólo limpiar si no quedó stunada mientras tanto
            if (!this.stunned) {
                this.sprite.clearTint();
            }
        });
    }

    //Aplica el efecto de stun a la paloma correspondiente
    stun(durationMs = null) {
        durationMs = durationMs == null ? this.defaultStunDuration : durationMs;

        //Si está stunneada, no reiniciar el stun
        if (this.stunned) {
            return;
        }

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