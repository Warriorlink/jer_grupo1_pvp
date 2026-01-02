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

        //Botón para jugar local (deshabilitado)
        this.localBtnSprite = this.add.image(250, 360, 'botonEncima')
            .setInteractive({ useHandCursor: true });

        this.localBtnText = this.add.text(250, 360, 'Local (Not Available)', {
            fontSize: '24px',
            color: 'ffffff',
        }).setOrigin(0.5).setDepth(10);

        //Botón para jugar online
        this.onlineBtnSprite = this.add.image(700, 360, 'boton')
            .setInteractive({ useHandCursor: true });
        this.onlineBtnText = this.add.text(700, 360, 'Online', {
            fontSize: '24px',
            color: '#000000ff'
        }).setOrigin(0.5).setDepth(10)

        this.onlineBtnSprite.on('pointerover', () => this.onlineBtnSprite.setTexture('botonEncima'))
        this.onlineBtnSprite.on('pointerout', () => this.onlineBtnSprite.setTexture('boton'))
        this.onlineBtnSprite.on('pointerdown', () => {
            if (!this.onlineBtnSprite.input || !this.onlineBtnSprite.input.enabled) return;

            //Apagar música
            if (this.bgMusic) {
                this.bgMusic.stop();
                this.bgMusic.destroy();
                this.bgMusic = null;
            }
            this.scene.stop('LobbyScene');
            this.cameras.main.setAlpha(1);

            //Start a LobbyScene
            this.scene.start('LobbyScene');
        });

        //Botón de creditos
        this.creditsBtnSprite = this.add.image(250, 500, 'boton')
            .setInteractive({ useHandCursor: true });
        this.creditsBtnText = this.add.text(250, 500, 'Credits', {
            fontSize: '24px',
            color: 'ffffff'
        }).setOrigin(0.5).setDepth(10)

        this.creditsBtnSprite.on('pointerover', () => this.creditsBtnSprite.setTexture('botonEncima'))
        this.creditsBtnSprite.on('pointerout', () => this.creditsBtnSprite.setTexture('boton'))
        this.creditsBtnSprite.on('pointerdown', () => {
            if (!this.creditsBtnSprite.input || !this.creditsBtnSprite.input.enabled) return;

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
        this.optionsBtnSprite = this.add.image(700, 500, 'boton')
            .setInteractive({ useHandCursor: true });
        this.optionsBtnText = this.add.text(700, 500, 'Options', {
            fontSize: '24px',
            color: 'ffffff'
        }).setOrigin(0.5).setDepth(10)

        this.optionsBtnSprite.on('pointerover', () => this.optionsBtnSprite.setTexture('botonEncima'))
        this.optionsBtnSprite.on('pointerout', () => this.optionsBtnSprite.setTexture('boton'))
        this.optionsBtnSprite.on('pointerdown', () => {
            if (!this.optionsBtnSprite.input || !this.optionsBtnSprite.input.enabled) return;

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
        this.controlsBtnSprite = this.add.image(700, 430, 'boton')
            .setInteractive({ useHandCursor: true });
        this.controlsBtnText = this.add.text(700, 430, 'Controls', {
            fontSize: '24px',
            color: '#000000'
        }).setOrigin(0.5).setDepth(10)

        this.controlsBtnSprite.on('pointerover', () => this.controlsBtnSprite.setTexture('botonEncima'))
        this.controlsBtnSprite.on('pointerout', () => this.controlsBtnSprite.setTexture('boton'))
        this.controlsBtnSprite.on('pointerdown', () => {
            if (!this.controlsBtnSprite.input || !this.controlsBtnSprite.input.enabled) return;

            this.cameras.main.setAlpha(1);

            //Transición a ControlsScene
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
        this.storyBtnSprite = this.add.image(250, 430, 'boton')
            .setInteractive({ useHandCursor: true });
        this.storyBtnText = this.add.text(250, 430, 'Story', {
            fontSize: '24px',
            color: '#000000'
        }).setOrigin(0.5).setDepth(10)

        this.storyBtnSprite.on('pointerover', () => this.storyBtnSprite.setTexture('botonEncima'))
        this.storyBtnSprite.on('pointerout', () => this.storyBtnSprite.setTexture('boton'))
        this.storyBtnSprite.on('pointerdown', () => {
            if (!this.storyBtnSprite.input || !this.storyBtnSprite.input.enabled) return;

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

        //Array de botones para habilitar/deshabilitar
        this.buttons = [
            this.localBtnSprite,
            this.onlineBtnSprite,
            this.creditsBtnSprite,
            this.optionsBtnSprite,
            this.controlsBtnSprite,
            this.storyBtnSprite
        ];

        //Establecer estado inicial según conexión
        this.setButtonsEnabled(connectionManager.getStatus().isConnected);



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
                // Rehabilitar botones si la conexión vuelve
                this.setButtonsEnabled(true);
            } else {
                this.connectionText.setText('Server: Disconnected');
                this.connectionText.setColor('#ff0000ff');
                // Deshabilitar todos los botones al perder la conexión
                this.setButtonsEnabled(false);
            }
        } catch (error) {
            console.error('[MenuScene] Error updating connection display:', error);
        }
    }

    //Función para habilitar o deshabilitar todos los botones del menú si el servidor está desconectado
    setButtonsEnabled(enabled) {
        if (!this.buttons || !Array.isArray(this.buttons)) return;

        const alpha = enabled ? 1 : 0.5;

        for (const btn of this.buttons) {
            if (!btn) continue;

            if (enabled) {
                if (!btn.input || !btn.input.enabled) {
                    btn.setInteractive({ useHandCursor: true });
                }
                btn.clearTint();
            } else {
                if (btn.input && btn.input.enabled) {
                    btn.disableInteractive();
                }
                btn.setTexture('boton');
                btn.setTint(0x888888);
            }

            btn.setAlpha(alpha);
        }
    }

    shutdown() {
        //Quitar el listener
        if (this.connectionListener) {
            connectionManager.removeListener(this.connectionListener);
        }
    }
}