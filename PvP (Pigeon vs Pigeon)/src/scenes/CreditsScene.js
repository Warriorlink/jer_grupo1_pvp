import Phaser from 'phaser';

export class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');
    }

    preload() {
        this.load.image('fondoPvP', 'assets/sprites/Logo PvP.png');
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

        this.add.image(480, 270, 'fondoPvP') .setScale(0.5);

        this.add.text(480, 50, 'Credits', { 
            fontSize: '64px', 
            color: '#ffffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);
        this.add.text(480, 150, 'Game developed by GB3D', {
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        this.add.text(480, 250, 'Artist:', {
            fontSize: '28px',
            color: '#000000',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 5
        }).setOrigin(0.5);
        this.add.text(480, 290, 'Hugo Checa', {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        this.add.text(480, 350, 'Programmers:', {
            fontSize: '28px',
            color: '#000000',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 5
        }).setOrigin(0.5);
        this.add.text(480, 390, 'Alejandro Marín', {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        this.add.text(480, 425, 'Lucas Lorente', {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        this.add.text(480, 460, 'Miguel Amado', {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

         const backBtnSprite = this.add.image(480, 510, 'boton')
            .setInteractive({ useHandCursor: true });   
        const backButtonText = this.add.text(480, 510, 'Back to Menu', {
            fontSize: '24px',
            color: '#000000',
        }).setOrigin(0.5)

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