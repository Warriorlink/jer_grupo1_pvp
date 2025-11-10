import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.add.text(400, 100, 'PvP', { 
            fontSize: '64px', 
            color: '#ffffffff'
        }).setOrigin(0.5);

        const localBtn = this.add.text(200, 320, 'Local 2 Players', {
            fontSize: '24px',
            color: '#00ff00'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => localBtn.setStyle({ fill: '#00ff88' }))
        .on('pointerout', () => localBtn.setStyle({ fill: '#00ff00' }))
        .on('pointerdown', () => { this.scene.start('GameScene') });

        const creditsBtn = this.add.text(200, 400, 'Credits', {
            fontSize: '24px',
            color: '#0000ff'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => creditsBtn.setStyle({ fill: '#0088ff' }))
        .on('pointerout', () => creditsBtn.setStyle({ fill: '#0000ff' }))
        .on('pointerdown', () => { this.scene.start('CreditsScene') });

        const controlsBtn = this.add.text(500, 400, 'Controls', {
            fontSize: '24px',
            color: '#ff0000'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => controlsBtn.setStyle({ fill: '#ff8888' }))
        .on('pointerout', () => controlsBtn.setStyle({ fill: '#ff0000' }))
        .on('pointerdown', () => { this.scene.start('ControlsScene') });

        const onlineBtn = this.add.text(500, 320, 'Online (Not available)', {
        fontSize: '24px',
        color: '#7a2eacff'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => onlineBtn.setStyle({ fill: '#e001a8ff' }))
        .on('pointerout', () => onlineBtn.setStyle({ fill: '#7a2eacff' }))
        .on('pointerdown', () => { this.scene.start() });
        }

    }