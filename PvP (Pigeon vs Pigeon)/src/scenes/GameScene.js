import Phaser from 'phaser';
import { Pigeon } from '../entities/Pigeon.js';
import { CommandProcessor } from '../commands/CommandProcessor';
import { MovePigeonCommand } from '../commands/MovePigeonCommand.js';
import { PauseCommand } from '../commands/PauseCommand.js';

export class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
    }

    init() {
        this.players = new Map();
        this.inputMappings = [];
        this.isPaused = false;
        this.escWasDown = false;
        this.gameEnded = false;
        this.processor = new CommandProcessor();
    }

    preload() {
        this.load.image('background', 'assets/sprites/background.png');
        this.load.image('palomon', 'assets/sprites/palomon.png');
    }

    create() {

        this.add.image(480, 270, 'background');

        this.createPlatforms();

        this.setUpPlayers();

        this.playerSprites = this.physics.add.group();
        this.players.forEach(pigeon => {
            this.playerSprites.add(pigeon.sprite);
        });

        //Colisiones entre palomas y plataformas
        this.physics.add.collider(this.playerSprites, this.platforms);
        this.physics.add.collider(this.playerSprites, this.playerSprites);

        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();

        //Repiso de arriba (o como se llame la escalera de incendios)
        this.platforms.create(540, 80, null).setDisplaySize(220, 20).refreshBody();

        //Repiso de en medio
        this.platforms.create(415, 237, null).setDisplaySize(220, 20).refreshBody();

        //Suelo
        this.platforms.create(480, 513, null).setDisplaySize(960, 60).refreshBody();

        //Techo
        this.platforms.create(480, 0, null).setDisplaySize(960, 5).refreshBody();

        //Límite izquierdo
        this.platforms.create(33, 430, null).setDisplaySize(70, 860).refreshBody();

        //Límite derecho
        this.platforms.create(927, 430, null).setDisplaySize(70, 860).refreshBody();

        //Acera izquierda
        this.platforms.create(89, 475, null).setDisplaySize(200, 15).refreshBody();

        //Acera derecha
        this.platforms.create(870, 475, null).setDisplaySize(200, 15).refreshBody();

        //Plataforma derecha superior
        this.platforms.create(832, 148, null).setDisplaySize(130, 22).refreshBody();

        //Plataforma derecha inferior
        this.platforms.create(832, 316, null).setDisplaySize(130, 22).refreshBody();

        //Plataforma izquierda superior
        this.platforms.create(126, 148, null).setDisplaySize(130, 22).refreshBody();

        //Plataforma izquierda inferior
        this.platforms.create(126, 316, null).setDisplaySize(130, 22).refreshBody();

        this.platforms.setVisible(false);

    }

    setUpPlayers() {
        const leftPigeon = new Pigeon(this, 'player1', 150, 435);
        const rightPigeon = new Pigeon(this, 'player2', 800, 435);

        this.players.set('player1', leftPigeon);
        this.players.set('player2', rightPigeon);

        const InputConfig = [
            {
                playerId: 'player1',
                upKey: 'W',
                rightKey: 'D',
                leftKey: 'A',
            },
            {
                playerId: 'player2',
                upKey: 'UP',
                rightKey: 'RIGHT',
                leftKey: 'LEFT',
            }
        ];

        this.inputMappings = InputConfig.map(config => {
            return {
                playerId: config.playerId,
                upKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.upKey]),
                rightKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.rightKey]),
                leftKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.leftKey]),
            };
        });
    }

    endGame(winnerId) {
        this.gameEnded = true;
        this.players.forEach(pigeon => {
            pigeon.sprite.setVelocity(0, 0);
        });
        this.physics.pause();

        const winnerText = winnerId === 'player1' ? 'Player 1 Wins!' : 'Player 2 Wins!';
        this.add.text(400, 250, winnerText, {
            fontSize: '64px',
            color: '#00ff00'
        }).setOrigin(0.5);

        const menuBtn = this.add.text(400, 350, 'Return to Menu', {
            fontSize: '32px',
            color: '#ffffff',
        }).setOrigin(0.5).setInteractive()
            .on('pointerdown', () => { this.scene.start('MenuScene') })
            .on('pointerover', () => menuBtn.setStyle({ fill: '#707673ff' }))
            .on('pointerout', () => menuBtn.setStyle({ fill: '#ffffff' }));
    }

    setPauseState(isPaused) {
        this.isPaused = isPaused;
        if (isPaused) {
            this.scene.launch('PauseScene', { originalScene: 'GameScene' });
            this.scene.pause();
        }
    }

    resume() {
        this.isPaused = false;
    }

    togglePause() {
        if (!this.gameEnded) {
            const newPausedState = !this.isPaused;
            this.processor.process(
                new PauseCommand(this, newPausedState)
            );
        }
    }

    update() {

        if (this.escKey.isDown && !this.escWasDown) {
            this.togglePause();
        }

        this.inputMappings.forEach(mapping => {
            const pigeon = this.players.get(mapping.playerId);

            // calcular movimiento horizontal (-1,0,1)
            let moveX = 0;
            if (mapping.leftKeyObj.isDown) moveX = -1;
            else if (mapping.rightKeyObj.isDown) moveX = 1;

            // salto (true si se pulsa)
            const jump = mapping.upKeyObj.isDown;

            // enviar comando con movimiento horizontal y salto
            let moveCommand = new MovePigeonCommand(pigeon, moveX, jump);
            this.processor.process(moveCommand);
        });
    }
}