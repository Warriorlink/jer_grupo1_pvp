import Phaser from 'phaser';

export class EndGameScene extends Phaser.Scene {
    constructor() {
        super('EndGameScene');
    }

    create(data) {
        this.add.rectangle(480, 270, 960, 540, 0x000000, 0.7);

        const winnerText = data.winnerId === 'player1' ? 'Dovenando Wins!' : 'Palomón Wins!';
        this.add.rectangle(480, 270, 960, 540, 0x000000, 0.7);
        this.add.text(480, 250, winnerText, {
            fontSize: '64px',
            color: '#ffffffff'
        }).setOrigin(0.5);

        const menuBtn = this.add.text(480, 350, 'Return to Menu', {
            fontSize: '32px',
            color: '#ffffff',
        }).setOrigin(0.5).setInteractive()
            .on('pointerdown', () => { this.scene.start('MenuScene') })
            .on('pointerover', () => menuBtn.setStyle({ fill: '#707673ff' }))
            .on('pointerout', () => menuBtn.setStyle({ fill: '#ffffff' }));
    }
}