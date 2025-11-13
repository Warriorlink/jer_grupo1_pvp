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
    }

    create() {

        this.add.image(480, 270, 'background');

        this.createBounds();

        this.setUpPlayers();
        this.players.forEach(pigeon => {
            //this.physics.add.collider(this.ball, pigeon.sprite);
        });

        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    setUpPlayers() {
        const leftPigeon = new Pigeon(this, 'player1', 50, 300);
        const rightPigeon = new Pigeon(this, 'player2', 750, 300);

        this.players.set('player1', leftPigeon);
        this.players.set('player2', rightPigeon);

        const InputConfig = [
            {
                playerId : 'player1',
                upKey: 'W',
                downKey: 'S',
            },
            {
                playerId : 'player2',
                upKey: 'UP',
                downKey: 'DOWN',
            }
        ];
        
        this.inputMappings = InputConfig.map(config => {
            return {
                playerId : config.playerId,
                upKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.upKey]),
                downKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.downKey]),
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

    createBounds() {
        this.leftGoal = this.physics.add.sprite(0, 300, null);
        this.leftGoal.setDisplaySize(10, 600);
        this.leftGoal.body.setSize(10, 600);
        this.leftGoal.setImmovable(true);
        this.leftGoal.setVisible(false);

        this.rightGoal = this.physics.add.sprite(800, 300, null);
        this.rightGoal.setDisplaySize(10, 600);
        this.rightGoal.body.setSize(10, 600);
        this.rightGoal.setImmovable(true);
        this.rightGoal.setVisible(false);
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
            let direction = null;
            if (mapping.upKeyObj.isDown) {
                direction = 'up';
            } else if (mapping.downKeyObj.isDown) {
                direction = 'down';
            } else {
                direction = 'stop';
            }
            let moveCommand = new MovePigeonCommand(pigeon, direction);
            this.processor.process(moveCommand);
        });
    }
}