import Phaser from 'phaser';

export class EndGameScene extends Phaser.Scene {
    constructor() {
        super('EndGameScene');
    }
    preload() {
        this.load.audio('SweetVictory', 'assets/sounds/SweetVictory.mp3');
        this.load.image('DovenandoVictory', 'assets/sprites/pantalla victoria dovenando.png');
        this.load.image('PalomonVictory', 'assets/sprites/pantalla victoria palomon.png');
        this.load.image('botonEncima', 'assets/sprites/boton_encima.png');
        this.load.image('boton', 'assets/sprites/boton.png');
    }

    create(data) {
        this.cameras.main.setAlpha(0);

        const winnerIsP1 = data.winnerId === 'player1';
        const bgKey = winnerIsP1 ? 'DovenandoVictory' : 'PalomonVictory';

        this.add.image(480, 270, bgKey);

        this.tweens.add({
            targets: this.cameras.main,
            alpha: 1,
            duration: 800
        });


        this.add.text(480, 250, 'SUPREME VICTORY', {
            fontSize: '100px',
            color: '#ffffffff',
            
            stroke: '#000000',
            strokeThickness: 10
        }).setOrigin(0.5);
        const winnerText = data.winnerId === 'player1' ? 'Dovenando Wins!' : 'Palomón Wins!';
        this.add.text(480, 70, winnerText, {
            fontSize: '64px',
            color: '#ffffffff',
            stroke: '#000000',
            strokeThickness: 8
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
        const menuBtnSprite = this.add.image(480, 430, 'boton')
            .setInteractive({ useHandCursor: true });
        const menuBtnText = this.add.text(480, 430, 'Return to menu', {
            fontSize: '24px',
            color: 'ffffff'
        }).setOrigin(0.5).setDepth(10)

        menuBtnSprite.on('pointerover', () => menuBtnSprite.setTexture('botonEncima'))
        menuBtnSprite.on('pointerout', () => menuBtnSprite.setTexture('boton'))
            .on('pointerdown', () => {
                // Asegurar que la cámara está totalmente visible antes de empezar el fade-out
                this.cameras.main.setAlpha(1);

                // Transición a MenuScene
                this.scene.transition({
                    target: 'MenuScene',
                    duration: 1000,
                    moveBelow: true,
                    data: {},

                    // Fade-out progresivo
                    onUpdate: (progress) => {
                        this.cameras.main.setAlpha(1 - progress);
                    }
                });
            });
    }

    onShutdown() {
        if (this.bgMusic) {
            this.bgMusic.stop();
            this.bgMusic.destroy();
            this.bgMusic = null;
        }
    }

}