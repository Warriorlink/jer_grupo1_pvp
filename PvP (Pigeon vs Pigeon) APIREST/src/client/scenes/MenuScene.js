import Phaser from 'phaser';
import { connectionManager } from '../services/ConnectionManager';

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
        let center = this.cameras.main.width/2;
        let left = center/2;
        let right = center*1.5;
        this.cameras.main.setAlpha(0);

        this.add.image(480, 270, 'Fondo');


        this.tweens.add({
            targets: this.cameras.main,
            alpha: 1,
            duration: 800
        });

        //Textos de la escena
        this.add.text(center, 100, 'PvP', {
            fontSize: '64px',
            color: '#ffffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        this.connectionText = this.add.text(center, 150, 'Servidor: Comprobando...', {
            fontSize: '20px',
            color: '#ffffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        this.usernameText = this.add.text(center,230, `Bienvenido, ${this.registry.get('name')}`, {
            fontSize: '25px',
            color: '#ffffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.player1Text = this.add.text(left,280, `Victorias Dovenardo: ${this.registry.get('player1Win')}`, {
            fontSize: '25px',
            color: '#ffffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.player2Text = this.add.text(right,280, `Victorias Palomón: ${this.registry.get('player2Win')}`, {
            fontSize: '25px',
            color: '#ffffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);



            //, con ${this.registry.get('player1Win')} victorias para Dovenando y ${this.registry.get('player2Win')} para Palomón
        if (!this.bgMusic) {
            this.bgMusic = this.sound.add('AveMaria', {
                loop: true,
                volume: 0.5
            });
            this.bgMusic.play();
        }

        

        //Botón para jugar local
        const localBtnSprite = this.add.image(left, 360, 'boton')
            .setInteractive({ useHandCursor: true });

        const localBtnText = this.add.text(left, 360, 'Local 2 Players', {
            fontSize: '24px',
            color: 'ffffff',
        }).setOrigin(0.5).setDepth(10)

        localBtnSprite.on('pointerover', () => localBtnSprite.setTexture('botonEncima'))
        localBtnSprite.on('pointerout', () => localBtnSprite.setTexture('boton'))
        localBtnSprite.on('pointerdown', () => {

            //Apagar música
            if (this.bgMusic) {
                this.bgMusic.stop();
                this.bgMusic.destroy();
                this.bgMusic = null;
            }

            this.cameras.main.setAlpha(1);

            //Transición a GameScene
            this.scene.transition({
                target: 'GameScene',
                duration: 1000,
                moveBelow: true,
                data: {},

                //Fade-out progresivo
                onUpdate: (progress) => {
                    this.cameras.main.setAlpha(1 - progress);
                }
            });
        });

        //Botón de creditos
        const creditsBtnSprite = this.add.image(left, 500, 'boton')
            .setInteractive({ useHandCursor: true });
        const creditsBtnText = this.add.text(left, 500, 'Credits', {
            fontSize: '24px',
            color: 'ffffff'
        }).setOrigin(0.5).setDepth(10)

        creditsBtnSprite.on('pointerover', () => creditsBtnSprite.setTexture('botonEncima'))
        creditsBtnSprite.on('pointerout', () => creditsBtnSprite.setTexture('boton'))
        creditsBtnSprite.on('pointerdown', () => {

            this.cameras.main.setAlpha(1);

            //Transición a CreditsScene
            this.scene.transition({
                target: 'CreditsScene',
                duration: 1000,
                moveBelow: true,
                data: {},

                //Fade-out progresivo
                onUpdate: (progress) => {
                    this.cameras.main.setAlpha(1 - progress);
                }
            });
        });

        //Botón de opciones
        const optionsBtnSprite = this.add.image(right, 500, 'boton')
            .setInteractive({ useHandCursor: true });
        const optionsBtnText = this.add.text(right, 500, 'Options', {
            fontSize: '24px',
            color: 'ffffff'
        }).setOrigin(0.5).setDepth(10)

        optionsBtnSprite.on('pointerover', () => optionsBtnSprite.setTexture('botonEncima'))
        optionsBtnSprite.on('pointerout', () => optionsBtnSprite.setTexture('boton'))
        optionsBtnSprite.on('pointerdown', () => {

            this.cameras.main.setAlpha(1);

            //Transición a CreditsScene
            this.scene.transition({
                target: 'OptionsScene',
                duration: 1000,
                moveBelow: true,
                data: {},

                //Fade-out progresivo
                onUpdate: (progress) => {
                    this.cameras.main.setAlpha(1 - progress);
                }
            });
        });

        //Botón de controles
        const controlsBtnSprite = this.add.image(right, 430, 'boton')
            .setInteractive({ useHandCursor: true });
        const controlsBtnText = this.add.text(right, 430, 'Controls', {
            fontSize: '24px',
            color: '#000000'
        }).setOrigin(0.5).setDepth(10)

        controlsBtnSprite.on('pointerover', () => controlsBtnSprite.setTexture('botonEncima'))
        controlsBtnSprite.on('pointerout', () => controlsBtnSprite.setTexture('boton'))
        controlsBtnSprite.on('pointerdown', () => {

            this.cameras.main.setAlpha(1);

            // ransición a ControlsScene
            this.scene.transition({
                target: 'ControlsScene',
                duration: 1000,
                moveBelow: true,
                data: {},

                //Fade-out progresivo
                onUpdate: (progress) => {
                    this.cameras.main.setAlpha(1 - progress);
                }
            });
        });

        //Botón de historia
        const storyBtnSprite = this.add.image(left, 430, 'boton')
            .setInteractive({ useHandCursor: true });
        const storyBtnText = this.add.text(left, 430, 'Story', {
            fontSize: '24px',
            color: '#000000'
        }).setOrigin(0.5).setDepth(10)

        storyBtnSprite.on('pointerover', () => storyBtnSprite.setTexture('botonEncima'))
        storyBtnSprite.on('pointerout', () => storyBtnSprite.setTexture('boton'))
        storyBtnSprite.on('pointerdown', () => {

            this.cameras.main.setAlpha(1);

            //Transición a StoryScene
            this.scene.transition({
                target: 'StoryScene',
                duration: 1000,
                moveBelow: true,
                data: {},

                //Fade-out progresivo
                onUpdate: (progress) => {
                    this.cameras.main.setAlpha(1 - progress);
                }
            });
        });

        //Botón para jugar online (no funciona)
        const loginBtnSprite = this.add.image(right, 360, 'boton')
            .setInteractive({ useHandCursor: true });
        const loginBtnText = this.add.text(right, 360, 'Return to login', {
            fontSize: '24px',
            color: '#000000'
        }).setOrigin(0.5)

        loginBtnSprite.on('pointerover', () => loginBtnSprite.setTexture('botonEncima'))
        loginBtnSprite.on('pointerout', () => loginBtnSprite.setTexture('boton'))
        loginBtnSprite.on('pointerdown', () => {

            //Apagar música
            if (this.bgMusic) {
                this.bgMusic.stop();
                this.bgMusic.destroy();
                this.bgMusic = null;
            }

            this.cameras.main.setAlpha(1);

            //Transición a StoryScene
            this.scene.transition({
                target: 'LoginScene',
                duration: 1000,
                moveBelow: true,
                data: {},

                //Fade-out progresivo
                onUpdate: (progress) => {
                    this.cameras.main.setAlpha(1 - progress);
                }
            });
        });


        this.connectionListener = (data) => {
            this.updateConnectionDisplay(data);
        };
        connectionManager.addListener(this.connectionListener);
        
    }

    updateConnectionDisplay(data) {
        // Solo actualizar si el texto existe (la escena está creada)
        if (!this.connectionText || !this.scene || !this.scene.isActive('MenuScene')) {
            return;
        }

        try {
            if (data.connected) {
                this.connectionText.setText(`Servidor: ${data.count} usuario(s) conectado(s)`);
                this.connectionText.setColor('#ffffffff');
                this.connectionText.setStroke('#000000',4);
            } else {
                this.connectionText.setText('Servidor: Desconectado');
                this.connectionText.setColor('#000000ff');
                this.connectionText.setStroke('#ffffff',3);
            }
        } catch (error) {
            console.error('[MenuScene] Error updating connection display:', error);
        }
    }

    shutdown() {
        // Remover el listener
        if (this.connectionListener) {
            connectionManager.removeListener(this.connectionListener);
        }
    }
}