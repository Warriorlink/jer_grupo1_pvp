import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.audio('AveMaria', 'assets/sounds/AveMaria.mp3');
        this.load.image('Fondo', 'assets/sprites/pantalla inicio.png');
        this.load.image('botonEncima', 'assets/sprites/boton_encima.png');
        this.load.image('boton', 'assets/sprites/boton.png');

    }

    create() {
        this.cameras.main.setAlpha(0);

        this.add.image(480, 270, 'Fondo');


        this.tweens.add({
        targets: this.cameras.main,
        alpha: 1,
        duration: 800
        });
        
        this.add.text(480, 100, 'PvP', {
            fontSize: '64px',
            color: '#ffffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        if (!this.bgMusic) {
            this.bgMusic = this.sound.add('AveMaria', {
                loop: true,
                volume: 0.5
            });
            this.bgMusic.play();
        }

        ////////////////Boton local////////////////
        
        const localBtnSprite = this.add.image(250, 350, 'boton')
            .setInteractive({ useHandCursor: true });

        const localBtnText = this.add.text(250, 350, 'Local 2 Players', {
            fontSize: '24px',
            color: 'ffffff',
        }).setOrigin(0.5).setDepth(10)

            localBtnSprite.on('pointerover', () => localBtnSprite.setTexture('botonEncima'))
            localBtnSprite.on('pointerout', () => localBtnSprite.setTexture('boton'))
            localBtnSprite.on('pointerdown', () => {

                // Apagar música como antes
                if (this.bgMusic) {
                    this.bgMusic.stop();
                    this.bgMusic.destroy();
                    this.bgMusic = null;
                }

                // Asegurar que la cámara está totalmente visible antes de empezar el fade-out
                this.cameras.main.setAlpha(1);

                // Transición a GameScene
                this.scene.transition({
                    target: 'GameScene',
                    duration: 1000,
                    moveBelow: true,
                    data: {},

                    // Fade-out progresivo
                    onUpdate: (progress) => {
                        this.cameras.main.setAlpha(1 - progress);
                    }
                });
            });

            ///////////////Boton credits////////////////


            const creditsBtnSprite = this.add.image(250, 430, 'boton')
            .setInteractive({ useHandCursor: true });
        const creditsBtnText = this.add.text(250, 430, 'Credits', {
            fontSize: '24px',
            color: 'ffffff'
        }).setOrigin(0.5).setDepth(10)

            creditsBtnSprite.on('pointerover', () => creditsBtnSprite.setTexture('botonEncima'))
            creditsBtnSprite.on('pointerout', () => creditsBtnSprite.setTexture('boton'))
            creditsBtnSprite.on('pointerdown', () => { 
                // Asegurar que la cámara está totalmente visible antes de empezar el fade-out
                this.cameras.main.setAlpha(1);

                // Transición a CreditsScene
                this.scene.transition({
                    target: 'CreditsScene',
                    duration: 1000,
                    moveBelow: true,
                    data: {},

                    // Fade-out progresivo
                    onUpdate: (progress) => {
                        this.cameras.main.setAlpha(1 - progress);
                    } 
                });
            });

            //////////////Boton controls////////////////

         const controlsBtnSprite = this.add.image(700, 430, 'boton')
            .setInteractive({ useHandCursor: true });   
        const controlsBtnText = this.add.text(700, 430, 'Controls', {
            fontSize: '24px',
            color: '#000000'
        }).setOrigin(0.5).setDepth(10)

            controlsBtnSprite.on('pointerover', () => controlsBtnSprite.setTexture('botonEncima'))
            controlsBtnSprite.on('pointerout', () => controlsBtnSprite.setTexture('boton'))
            controlsBtnSprite.on('pointerdown', () => { 
                // Asegurar que la cámara está totalmente visible antes de empezar el fade-out
                this.cameras.main.setAlpha(1);

                // Transición a ControlsScene
                this.scene.transition({
                    target: 'ControlsScene',
                    duration: 1000,
                    moveBelow: true,
                    data: {},

                    // Fade-out progresivo
                    onUpdate: (progress) => {
                        this.cameras.main.setAlpha(1 - progress);
                    } 
                });
            });

            //////////////Boton online (no funcional)////////////////

            const onlineBtnSprite = this.add.image(700, 350, 'boton')
            .setInteractive({ useHandCursor: true });   
        const onlineBtnText = this.add.text(700, 350, 'Online (Not available)', {
            fontSize: '24px',
            color: '#7a2eacff'
        }).setOrigin(0.5)

            onlineBtnSprite.on('pointerover', () => onlineBtnSprite.setTexture('botonEncima'))
            onlineBtnSprite.on('pointerout', () => onlineBtnSprite.setTexture('boton'))
    }



}