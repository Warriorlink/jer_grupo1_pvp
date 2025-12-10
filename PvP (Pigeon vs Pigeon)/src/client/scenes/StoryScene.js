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

        //Historia general
        this.add.text(480, 120, 'In some nameless city, on a damp and murky night, two pigeons wandered through the alleys in search of something to calm their hunger.', {
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center',
            wordWrap: { width: 800, useAdvancedWrap: true }
        }).setOrigin(0.5);

        this.add.text(480, 170, 'The alluring fragrance of a few forgotten churros awakens in them a fierce blend of survival and greed, and before long the situation erupts into open warfare.', {
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center',
            wordWrap: { width: 800, useAdvancedWrap: true }
        }).setOrigin(0.5);

        this.add.text(480, 230, 'Though there are neither heroes nor villains, each firmly believes that the churro is hers by birthright. Morality falters, friendship fades… there are only churros left.', {
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center',
            wordWrap: { width: 800, useAdvancedWrap: true }
        }).setOrigin(0.5);

        //Historia Dovenando
        this.add.text(200, 270, 'Dovenando', {
            fontSize: '32px',
            color: '#000000',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(220, 430, 'A cunning, slippery bird, skilled in the art of stealth. His guiding principle: "All churros belong to someone… and that someone is me."', {
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center',
            wordWrap: { width: 400, useAdvancedWrap: true }
        }).setOrigin(0.5);

        this.add.image(200, 340, 'dovenando').setOrigin(0.5).setScale(1.5);

        //Historia Palomon
        this.add.text(770, 270, 'Palomón', {
            fontSize: '32px',
            color: '#000000',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(750, 430, 'A tough pigeon with a dark history. He once belonged to the avian mafia and is well acquainted with the perils of the streets and gang fights.', {
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center',
            wordWrap: { width: 400, useAdvancedWrap: true }
        }).setOrigin(0.5);

        this.add.image(770, 340, 'palomon').setOrigin(0.5).setScale(1.5);

        //Botón para volver al menú
        const menuBtnSprite = this.add.image(480, 500, 'boton')
            .setInteractive({ useHandCursor: true });
        const menuButtonText = this.add.text(480, 500, 'Back to Menu', {
            fontSize: '24px',
            color: '#000000',
        }).setOrigin(0.5);
        menuBtnSprite.on('pointerover', () => menuBtnSprite.setTexture('botonEncima'))
        menuBtnSprite.on('pointerout', () => menuBtnSprite.setTexture('boton'))
        menuBtnSprite.on('pointerdown', () => {
            
            this.cameras.main.setAlpha(1);

            //Transición a MenuScene
            this.scene.transition({
                target: 'MenuScene',
                duration: 1000,
                moveBelow: true,
                data: {},

                //Fade-out progresivo
                onUpdate: (progress) => {
                    this.cameras.main.setAlpha(1 - progress);
                }
            });
        });
    }
}