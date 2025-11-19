import Phaser from 'phaser';

export class EndGameScene extends Phaser.Scene {
    constructor() {
        super('EndGameScene');
    }
    preload() {
        this.load.audio('SweetVictory', 'assets/sounds/SweetVictory.mp3');
    }

    create(data) {
        this.add.rectangle(480, 270, 960, 540, 0x000000, 0.7);

        const winnerText = data.winnerId === 'player1' ? 'Dovenando Wins!' : 'Palomón Wins!';
        this.add.rectangle(480, 270, 960, 540, 0x000000, 0.7);
        this.add.text(480, 250, winnerText, {
            fontSize: '64px',
            color: '#ffffffff'
        }).setOrigin(0.5);

        //Musica de fondo
        this.bgMusic = this.sound.add('SweetVictory', {
            loop: true,
            volume: 0.6
        });
        this.bgMusic.play();

        this.events.on('shutdown', this.onShutdown, this);
        this.events.on('destroy', this.onShutdown, this);

        //Botón
        const menuBtn = this.add.text(480, 350, 'Return to Menu', {
            fontSize: '32px',
            color: '#ffffff',
        }).setOrigin(0.5).setInteractive()
            .on('pointerdown', () => { this.scene.start('MenuScene') })
            .on('pointerover', () => menuBtn.setStyle({ fill: '#707673ff' }))
            .on('pointerout', () => menuBtn.setStyle({ fill: '#ffffff' }));
    }

onShutdown() {
        if (this.bgMusic) {
            this.bgMusic.stop();
            this.bgMusic.destroy();
            this.bgMusic = null;
        }
    }

}