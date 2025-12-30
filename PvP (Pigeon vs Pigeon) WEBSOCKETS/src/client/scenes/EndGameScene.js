import Phaser from 'phaser';
import { connectionManager } from '../services/ConnectionManager.js';

export class EndGameScene extends Phaser.Scene {
    constructor() {
        super('EndGameScene');
    }

    init(data) {
        this.ws = data.ws;
    }

    preload() {
        this.load.audio('SweetVictory', 'assets/sounds/SweetVictory.mp3');
        this.load.image('DovenandoVictory', 'assets/sprites/pantalla victoria dovenando.png');
        this.load.image('PalomonVictory', 'assets/sprites/pantalla victoria palomon.png');
        this.load.image('botonEncima', 'assets/sprites/boton_encima.png');
        this.load.image('boton', 'assets/sprites/boton.png');
    }

    create(data) {
        console.log('[EndGameScene] create called, data:', data);
        this.cameras.main.setAlpha(0);

        this.events.on('shutdown', () => {
            console.log('[EndGameScene] SHUTDOWN');
        }, this);

        this.events.on('destroy', () => {
            console.log('[EndGameScene] DESTROY');
        }, this);


        // Identificar ganador y jugador local
        const winnerIsP1 = data.winnerId === 'player1';
        const playerIsP1 = data.localPlayerId === 'player1';
        const playerWon = winnerIsP1 === playerIsP1;

        // Imagen de victoria según el ganador
        const bgKey = winnerIsP1 ? 'DovenandoVictory' : 'PalomonVictory';
        this.add.image(480, 270, bgKey);

        // Fade-in de cámara
        this.tweens.add({
            targets: this.cameras.main,
            alpha: 1,
            duration: 800
        });

        // Texto principal
        const mainText = playerWon ? 'SUPREME VICTORY!' : 'CRUSHING DEFEAT';
        const mainColor = playerWon ? '#ffffffff' : '#ffffffff';
        this.add.text(480, 200, mainText, {
            fontSize: '104px',
            color: mainColor,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Texto secundario
        const winnerText = winnerIsP1 ? 'Dovenando Wins!' : 'Palomón Wins!';
        this.add.text(480, 300, winnerText, {
            fontSize: '60px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Música de fondo
        this.bgMusic = this.sound.add('SweetVictory', {
            loop: true,
            volume: 0.6
        });
        this.bgMusic.play();

        this.events.on('shutdown', this.onShutdown, this);
        this.events.on('destroy', this.onShutdown, this);

        // Botón para volver al menú
        const menuBtnSprite = this.add.image(480, 460, 'boton')
            .setInteractive({ useHandCursor: true });
        const menuBtnText = this.add.text(480, 460, 'Return to menu', {
            fontSize: '24px',
            color: 'ffffff'
        }).setOrigin(0.5).setDepth(10);

        menuBtnSprite.on('pointerover', () => menuBtnSprite.setTexture('botonEncima'));
        menuBtnSprite.on('pointerout', () => menuBtnSprite.setTexture('boton'));
        menuBtnSprite.on('pointerdown', () => {
            console.log('[EndGameScene] Return to menu clicked');
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.close();
            }
            this.cameras.main.setAlpha(1);
            this.scene.start('MenuScene');
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
