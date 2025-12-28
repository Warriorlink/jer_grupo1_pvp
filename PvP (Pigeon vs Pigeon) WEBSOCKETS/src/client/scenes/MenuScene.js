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
        this.cameras.main.setAlpha(0);

        this.add.image(480, 270, 'Fondo');


        this.tweens.add({
            targets: this.cameras.main,
            alpha: 1,
            duration: 800
        });

        //Textos de la escena
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

        this.connectionText = this.add.text(480, 180, 'Server: Checking...', {
            fontSize: '24px',
            color: '#ffffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        //Botón para jugar local
        const localBtnSprite = this.add.image(250, 360, 'boton')
            .setInteractive({ useHandCursor: true });

        const localBtnText = this.add.text(250, 360, 'Local 2 Players', {
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

        //Botón para jugar online (no funciona)
        const onlineBtnSprite = this.add.image(700, 360, 'boton')
            .setInteractive({ useHandCursor: true });
        const onlineBtnText = this.add.text(700, 360, 'Online', {
            fontSize: '24px',
            color: '#000000ff'
        }).setOrigin(0.5).setDepth(10)

        onlineBtnSprite.on('pointerover', () => onlineBtnSprite.setTexture('botonEncima'))
        onlineBtnSprite.on('pointerout', () => onlineBtnSprite.setTexture('boton'))
        onlineBtnSprite.on('pointerdown', () => {

            //Apagar música
            if (this.bgMusic) {
                this.bgMusic.stop();
                this.bgMusic.destroy();
                this.bgMusic = null;
            }

            this.cameras.main.setAlpha(1);

            //Transición a GameScene
            this.scene.transition({
                target: 'LobbyScene',
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
        const creditsBtnSprite = this.add.image(250, 500, 'boton')
            .setInteractive({ useHandCursor: true });
        const creditsBtnText = this.add.text(250, 500, 'Credits', {
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
        const optionsBtnSprite = this.add.image(700, 500, 'boton')
            .setInteractive({ useHandCursor: true });
        const optionsBtnText = this.add.text(700, 500, 'Options', {
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
        const controlsBtnSprite = this.add.image(700, 430, 'boton')
            .setInteractive({ useHandCursor: true });
        const controlsBtnText = this.add.text(700, 430, 'Controls', {
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
        const storyBtnSprite = this.add.image(250, 430, 'boton')
            .setInteractive({ useHandCursor: true });
        const storyBtnText = this.add.text(250, 430, 'Story', {
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
                this.connectionText.setText(`Server: ${data.count} user(s) connected`);
                this.connectionText.setColor('#ffffffff');
            } else {
                this.connectionText.setText('Server: Disconnected');
                this.connectionText.setColor('#ff0000ff');
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