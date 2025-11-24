import Phaser from "phaser";

export class StoryScene extends Phaser.Scene {
    constructor() {
        super('StoryScene');
    }
    preload() {
        this.load.image('fondo', 'assets/sprites/pantalla inicio.png');
        this.load.image('botonEncima', 'assets/sprites/boton_encima.png');
        this.load.image('boton', 'assets/sprites/boton.png');
        this.load.image('palomon', 'assets/sprites/palomon.png');
        this.load.image('dovenando', 'assets/sprites/dovenando.png');
    }
    create() {
        this.cameras.main.setAlpha(0);

        this.tweens.add({
        targets: this.cameras.main,
        alpha: 1,
        duration: 800
        });
        this.add.image(480, 270, 'fondo');

        this.add.text(480, 50, 'Story', { 
            fontSize: '64px', 
            color: '#ffffffff',
            stroke: '#000000',
            strokeThickness: 8
    }).setOrigin(0.5);
    // Historia

        this.add.text(480, 120, 'En una ciudad cualquiera, durante una noche húmeda y oscura, dos palomas merodean por los callejones en busca de comida.', {
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center',
            wordWrap: { width: 800, useAdvancedWrap: true }
        }).setOrigin(0.5);

        this.add.text(480, 170, 'El irresistible aroma de unos churros olvidados despierta en ellas un instinto de supervivencia y codicia, y pronto la situación se convierte en una batalla sin cuartel.', {
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center',
            wordWrap: { width: 800, useAdvancedWrap: true }
        }).setOrigin(0.5);

        this.add.text(480, 220, 'Aunque no hay héroes ni villanos, cada una cree firmemente que ese churro le pertenece por derecho propio. No hay moral, tampoco amistad... solo churros.', {
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center',
            wordWrap: { width: 800, useAdvancedWrap: true }
        }).setOrigin(0.5);

        // Dovenando
        this.add.text(200, 270, 'Dovenando', {
            fontSize: '32px',
            color: '#000000',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(220, 430, 'Un ave pícara y escurridiza, maestra del sigilo. Su filosofía es: "Todo churro tiene dueño, y ese dueño soy yo".', {
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center',
            wordWrap: { width: 400, useAdvancedWrap: true }
        }).setOrigin(0.5);

        this.add.image(200, 340, 'dovenando').setOrigin(0.5).setScale(1.5);

        // Palomon
        this.add.text(770, 270, 'Palomón', {
            fontSize: '32px',
            color: '#000000',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(750, 430, 'Una paloma muy dura con un pasado oscuro. Formó parte de la mafia aviar y está habituado a los peligros de las calles y las peleas de bandas.', {
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center',
            wordWrap: { width: 400, useAdvancedWrap: true }
        }).setOrigin(0.5);

        this.add.image(770, 340, 'palomon').setOrigin(0.5).setScale(1.5);

        // Botón para volver al menú
         const menuBtnSprite = this.add.image(480, 500, 'boton')
            .setInteractive({ useHandCursor: true });   
        const menuButtonText = this.add.text(480, 500, 'Back to Menu', {
            fontSize: '24px',
            color: '#000000',
        }).setOrigin(0.5);
        menuBtnSprite.on('pointerover', () => menuBtnSprite.setTexture('botonEncima'))
        menuBtnSprite.on('pointerout', () => menuBtnSprite.setTexture('boton'))
        menuBtnSprite.on('pointerdown', () => { 
                // Asegurar que la cámara está totalmente visible antes de empezar el fade-out
                this.cameras.main.setAlpha(1);

                // Transición a MenuScene
                this.scene.transition({
                    target: 'MenuScene',
                    duration: 1000,
                    moveBelow: true,
                    data: {},

                    // Fade-out progresivo
                    onUpdate: (progress) => {
                        this.cameras.main.setAlpha(1 - progress);
                    } 
                });
            });
    }
}