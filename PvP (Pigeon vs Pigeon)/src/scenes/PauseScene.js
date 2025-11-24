import Phaser from 'phaser';

export class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }

    preload() {
        this.load.image('botonEncima', 'assets/sprites/boton_encima.png');
        this.load.image('boton', 'assets/sprites/boton.png');
    }

    create(data) {
        this.add.rectangle(480, 270, 960, 540, 0x000000, 0.7);

        this.add.text(480, 200, 'Game Paused', { 
            fontSize: '64px', 
            color: '#ffffff', 
            fontStyle: 'bold',
            stroke: '#000000', 
            strokeThickness: 8
        }).setOrigin(0.5);

        const resumeBtnSprite = this.add.image(250, 430, 'boton')
            .setInteractive({ useHandCursor: true });
        const resumeBtnText = this.add.text(250, 430, 'Resume', {
            fontSize: '24px',
            color: 'ffffff'
        }).setOrigin(0.5).setDepth(10)

            resumeBtnSprite.on('pointerover', () => resumeBtnSprite.setTexture('botonEncima'))
            resumeBtnSprite.on('pointerout', () => resumeBtnSprite.setTexture('boton'))
        .on('pointerdown', () => { 
            this.scene.stop(); 
            this.scene.resume(data.originalScene);
            this.scene.get(data.originalScene).resume(); 
        });

        const menuBtnSprite = this.add.image(700, 430, 'boton')
            .setInteractive({ useHandCursor: true });
        const menuBtnText = this.add.text(700, 430, 'Return to Menu', {
            fontSize: '24px',
            color: 'ffffff'
        }).setOrigin(0.5).setDepth(10)

            menuBtnSprite.on('pointerover', () => menuBtnSprite.setTexture('botonEncima'))
            menuBtnSprite.on('pointerout', () => menuBtnSprite.setTexture('boton'))
        .on('pointerdown', () => { 
            this.scene.stop(data.originalScene);
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