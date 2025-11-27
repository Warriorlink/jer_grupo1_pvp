export class Item {

    constructor(scene, x, y, sprite) {
        this.scene = scene;

        this.sprite = scene.physics.add.sprite(x, y, sprite);
        this.sprite.setDisplaySize(40, 40);
        this.sprite.setImmovable(true);
        this.sprite.body.allowGravity = false;

        // Referencia inversa útil para saber qué objeto se recogió
        //this.sprite.item = this;

        this.expireTimer=null;
        
        // NOTE: Los iconos se gestionan ahora en la instancia `Pigeon`,
        // para que sobrevivan a la eliminación inmediata del Item.
    }

    // Cada ítem tendrá SU PROPIO efecto
    applyEffect(pigeon) {
        console.warn("applyEffect() no implementado en el item");
    }

    // Crear y mostrar el icono del powerup debajo del texto de puntuación
    showItemIcon(pigeon, iconKey, duration) {
        // Limpia cualquier icono anterior del pigeon
        if (pigeon.activeIconSprite) {
            pigeon.activeIconSprite.destroy();
            pigeon.activeIconSprite = null;
        }
        if (pigeon.activeIconTimer) {
            pigeon.activeIconTimer.remove();
            pigeon.activeIconTimer = null;
        }

        // Posicionar el icono relativo al texto de puntuación para mayor robustez
        let iconX = null;
        let iconY = 85;
        if (this.scene.scoreTextP1 && this.scene.scoreTextP2) {
            iconX = pigeon.id === 'player1' ? this.scene.scoreTextP1.x + 25 : this.scene.scoreTextP2.x + 175;
        } else {
            // fallback a coordenadas conocidas
            iconX = pigeon.id === 'player1' ? 40 : 850;
        }

        pigeon.activeIconSprite = this.scene.add.image(iconX, iconY, iconKey);
        pigeon.activeIconSprite.setDisplaySize(50, 50);

        // Guardar un timer en el pigeon para eliminar el icono al expirar
        pigeon.activeIconTimer = this.scene.time.addEvent({
            delay: duration,
            callback: () => {
                if (pigeon.activeIconSprite) {
                    pigeon.activeIconSprite.destroy();
                    pigeon.activeIconSprite = null;
                }
                if (pigeon.activeIconTimer) {
                    pigeon.activeIconTimer.remove();
                    pigeon.activeIconTimer = null;
                }
            }
        });
    }

    destroy() {
        this.sprite.destroy();
    }
}