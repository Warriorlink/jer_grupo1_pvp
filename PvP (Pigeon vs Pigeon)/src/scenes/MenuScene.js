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

        const localBtn = this.add.text(400, 320, 'Local 2 Players', {
            fontSize: '24px',
            color: '#00ff00'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => localBtn.setStyle({ fill: '#00ff88' }))
        .on('pointerout', () => localBtn.setStyle({ fill: '#35db1fff' }))
        .on('pointerdown', () => { this.scene.start('GameScene') });

        const onlineBtn = this.add.text(400, 390, 'Online Multiplayer (Not available)', {
        fontSize: '24px',
        color: '#7a2eacff'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => onlineBtn.setStyle({ fill: '#e001a8ff' }))
        .on('pointerout', () => onlineBtn.setStyle({ fill: '#7a2eacff' }))
        .on('pointerdown', () => { this.scene.start() });
        }

    }