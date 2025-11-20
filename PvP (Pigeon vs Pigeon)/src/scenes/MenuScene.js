import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.audio('AveMaria', 'assets/sounds/AveMaria.mp3');
    }

    create() {

        this.add.text(480, 100, 'PvP', {
            fontSize: '64px',
            color: '#ffffffff'
        }).setOrigin(0.5);

        if (!this.bgMusic) {
            this.bgMusic = this.sound.add('AveMaria', {
                loop: true,
                volume: 0.5
            });
            this.bgMusic.play();
        }
        const localBtn = this.add.text(300, 320, 'Local 2 Players', {
            fontSize: '24px',
            color: '#00ff00'
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => localBtn.setStyle({ fill: '#00ff88' }))
            .on('pointerout', () => localBtn.setStyle({ fill: '#00ff00' }))
            .on('pointerdown', () => {

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


        const creditsBtn = this.add.text(300, 400, 'Credits', {
            fontSize: '24px',
            color: '#0000ff'
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => creditsBtn.setStyle({ fill: '#0088ff' }))
            .on('pointerout', () => creditsBtn.setStyle({ fill: '#0000ff' }))
            .on('pointerdown', () => { // Asegurar que la cámara está totalmente visible antes de empezar el fade-out
                this.cameras.main.setAlpha(1);

                // Transición a GameScene
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

        const controlsBtn = this.add.text(650, 400, 'Controls', {
            fontSize: '24px',
            color: '#ff0000'
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => controlsBtn.setStyle({ fill: '#ff8888' }))
            .on('pointerout', () => controlsBtn.setStyle({ fill: '#ff0000' }))
            .on('pointerdown', () => { this.scene.start('ControlsScene') });

        const onlineBtn = this.add.text(650, 320, 'Online (Not available)', {
            fontSize: '24px',
            color: '#7a2eacff'
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => onlineBtn.setStyle({ fill: '#e001a8ff' }))
            .on('pointerout', () => onlineBtn.setStyle({ fill: '#7a2eacff' }))
            .on('pointerdown', () => { this.scene.start() });
    }



}