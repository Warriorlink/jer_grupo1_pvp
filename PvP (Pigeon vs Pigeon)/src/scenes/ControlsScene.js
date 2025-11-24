import Phaser from "phaser";

export class ControlsScene extends Phaser.Scene {
    constructor() {
        super('ControlsScene');
    }
    preload() {
        this.load.image('fondo', 'assets/sprites/pantalla inicio.png');
        this.load.image('botonEncima', 'assets/sprites/boton_encima.png');
        this.load.image('boton', 'assets/sprites/boton.png');
    }
    create() {
        this.cameras.main.setAlpha(0);

        this.tweens.add({
        targets: this.cameras.main,
        alpha: 1,
        duration: 800
        });
        this.add.image(480, 270, 'fondo');

        this.add.text(480, 50, 'Controls', { 
            fontSize: '64px', 
            color: '#ffffffff',
            stroke: '#000000',
            strokeThickness: 8
    }).setOrigin(0.5);
    // Controles Jugador 1
        this.add.text(480, 150, 'Player 1', {
            fontSize: '32px',
            color: '#ffff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(480, 200, 'Move: W - A - D (Up, Left, Right)', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(480, 240, 'Attack: F', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Controles Jugador 2
        this.add.text(480, 360, 'Player 2 (Local)', {
            fontSize: '32px',
            color: '#ffff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(480, 410, 'Move: ↑ - ← - → (Up, Left, Right)', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(480, 450, 'Attack: Shift', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Botón para volver al menú
         const backBtnSprite = this.add.image(480, 500, 'boton')
            .setInteractive({ useHandCursor: true });   
        const backButtonText = this.add.text(480, 500, 'Back to Menu', {
            fontSize: '24px',
            color: '#ffff00',
        }).setOrigin(0.5);
        backBtnSprite.on('pointerover', () => backBtnSprite.setTexture('botonEncima'))
        backBtnSprite.on('pointerout', () => backBtnSprite.setTexture('boton'))
        backBtnSprite.on('pointerdown', () => { 
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