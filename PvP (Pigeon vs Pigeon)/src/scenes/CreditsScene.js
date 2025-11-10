import Phaser from 'phaser';

export class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');
    }
    create() {
        this.add.text(400, 100, 'Credits', { 
            fontSize: '64px', 
            color: '#ffffffff'
        }).setOrigin(0.5);
        this.add.text(400, 250, 'Game developed by GB3D', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }
}