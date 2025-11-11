import Phaser from 'phaser';

export class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');
    }
    create() {
        this.add.text(480, 50, 'Credits', { 
            fontSize: '64px', 
            color: '#ffffffff'
        }).setOrigin(0.5);
        this.add.text(480, 150, 'Game developed by GB3D', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.add.text(480, 250, 'Artist:', {
            fontSize: '28px',
            color: '#ffff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add.text(480, 290, 'Hugo Checa', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.add.text(480, 350, 'Programmers:', {
            fontSize: '28px',
            color: '#ffff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add.text(480, 390, 'Alejandro Marín', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.add.text(480, 425, 'Lucas Lorente', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.add.text(480, 460, 'Miguel Amado', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const backButton = this.add.text(480, 520, 'Back to Menu', {
            fontSize: '24px',
            color: '#ffff00',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}