import Phaser from 'phaser';
import { Pigeon } from '../entities/Pigeon.js';
import { CommandProcessor } from '../commands/CommandProcessor';
import { MovePigeonCommand } from '../commands/MovePigeonCommand.js';
import { PauseCommand } from '../commands/PauseCommand.js';
import { AttackPigeonCommand } from '../commands/AttackPigeonCommand.js';
import { Churro } from '../entities/Churro.js';

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
    this.churros = [];

    this.churroSpawnPositions = [
        { x: 560, y: 45 },   // Repiso superior
        { x: 415, y: 200 },  // Repiso en medio
        { x: 790, y: 115 },  // Derecha superior
        { x: 790, y: 280 },  // Derecha inferior
        { x: 126, y: 115 },  // Izquierda superior
        { x: 126, y: 280 },  // Izquierda inferior
        { x: 560, y: 455 }   // Suelo
    ];
}


    preload() {
        this.load.image('background', 'assets/sprites/background.png');
        this.load.image('palomon', 'assets/sprites/palomon.png');
        this.load.image('dovenando', 'assets/sprites/dovenando.png');
        this.load.image('churro', 'assets/sprites/Churro JER.png');
    }

    create() {

        this.add.image(480, 270, 'background');

        this.createPlatforms();

        this.setUpPlayers();

        // Crear churros
        //this.createChurros();

        // Overlap para recoger churros
        this.players.forEach(pigeon => {
            this.physics.add.overlap(pigeon.sprite, this.churros.map(c => c.sprite), this.onChurroPickup, null, this);
        });

        this.playerSprites = this.physics.add.group();
        this.players.forEach(pigeon => {
            this.playerSprites.add(pigeon.sprite);
        });

        //Colisiones entre palomas y plataformas
        this.physics.add.collider(this.playerSprites, this.platforms);
        this.physics.add.collider(this.playerSprites, this.playerSprites);

        //Colisiones entre churros y palomas
        this.players.forEach(pigeon => {
        this.physics.add.overlap(pigeon.sprite, this.churros.map(c => c.sprite), this.onChurroPickup, null, this);
        });

        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        
        // Cada 10 segundos intentar generar un churro
        this.time.addEvent({
        delay: 10000,
        loop: true,
        callback: () => {
         if (this.churros.length === 0) {
             this.spawnChurro();
         }
        }
    });

    }

    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();

        //Repiso de arriba
        this.platforms.create(540, 80, null).setDisplaySize(220, 20).refreshBody();

        //Repiso de arriba pequeño
        this.platforms.create(310, 80, null).setDisplaySize(10, 20).refreshBody();

        //Repiso de en medio
        this.platforms.create(415, 237, null).setDisplaySize(220, 20).refreshBody();

        //Repiso de en medio pequeño
        this.platforms.create(650, 237, null).setDisplaySize(10, 20).refreshBody();

        //Suelo
        this.platforms.create(480, 513, null).setDisplaySize(960, 60).refreshBody();

        //Camiseta
        this.platforms.create(640, 360, null).setDisplaySize(90, 5).refreshBody();

        //Pantalones
        this.platforms.create(345, 365, null).setDisplaySize(100, 5).refreshBody();

        //Límite izquierdo
        this.platforms.create(33, 430, null).setDisplaySize(70, 1200).refreshBody();

        //Límite derecho
        this.platforms.create(927, 430, null).setDisplaySize(70, 1200).refreshBody();

        //Acera izquierda
        this.platforms.create(89, 475, null).setDisplaySize(200, 15).refreshBody();

        //Acera derecha
        this.platforms.create(870, 475, null).setDisplaySize(200, 15).refreshBody();

        //Plataforma derecha superior
        this.platforms.create(832, 145, null).setDisplaySize(130, 15).refreshBody();

        //Plataforma derecha inferior
        this.platforms.create(832, 313, null).setDisplaySize(130, 15).refreshBody();

        //Plataforma izquierda superior
        this.platforms.create(126, 145, null).setDisplaySize(130, 15).refreshBody();

        //Plataforma izquierda inferior
        this.platforms.create(126, 313, null).setDisplaySize(130, 15).refreshBody();

        this.platforms.setVisible(false);

    }

    setUpPlayers() {
        const leftPigeon = new Pigeon(this, 'player1', 150, 435, 'dovenando');
        const rightPigeon = new Pigeon(this, 'player2', 800, 435, 'palomon');

        this.players.set('player1', leftPigeon);
        this.players.set('player2', rightPigeon);

        const InputConfig = [
          {
            playerId: 'player1',
            upKey: 'W',
            leftKey: 'A',
            rightKey: 'D',
            attackKey: 'F'
          },
          {
            playerId: 'player2',
            upKey: 'UP',
            leftKey: 'LEFT',
            rightKey: 'RIGHT',
            attackKey: 'SHIFT'
          }
        ];

        this.inputMappings = InputConfig.map(config => {
            return {
                playerId: config.playerId,
                upKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.upKey]),
                rightKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.rightKey]),
                leftKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.leftKey]),
                attackKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.attackKey]),
            };
        });
    }

    /*createChurros() {
        // Crear un churro en el centro para pruebas
        this.churros.push(new Churro(this, 480, 200));
    }*/

    spawnChurro() {

    // Elegir una posición al azar
    const pos = Phaser.Utils.Array.GetRandom(this.churroSpawnPositions);

    const newChurro = new Churro(this, pos.x, pos.y);
    this.churros.push(newChurro);

    // Activar overlap con ambos jugadores
    this.players.forEach(pigeon => {
        this.physics.add.overlap(
            pigeon.sprite,
            newChurro.sprite,
            this.onChurroPickup,
            null,
            this);
    });
    }


    onChurroPickup(pigeonSprite, churroSprite) {

    let playerId = null;

    this.players.forEach((pigeon, id) => {
        if (pigeon.sprite === pigeonSprite) {
            playerId = id;
        }
    });

    if (playerId) {
        const pigeon = this.players.get(playerId);
        pigeon.score++;
        console.log(`${playerId} recogió un churro! Puntuación: ${pigeon.score}`);
    }

    // Eliminar el churro del array
    this.churros = this.churros.filter(churro => {
        if (churro.sprite === churroSprite) {
            churro.destroy();
            return false;
        }
        return true;
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
            if (!pigeon) return;

            // Si la paloma está stunada no puede hacer nada: detener movimiento horizontal
            if (pigeon.stunned) {
                pigeon.sprite.setVelocityX(0);
                return;
            }

            // calcular movimiento horizontal (-1,0,1)
            let moveX = 0;
            if (mapping.leftKeyObj.isDown) moveX = -1;
            else if (mapping.rightKeyObj.isDown) moveX = 1;

            // salto (true si se pulsa)
            const jump = mapping.upKeyObj.isDown;

            // enviar comando con movimiento horizontal y salto
            let moveCommand = new MovePigeonCommand(pigeon, moveX, jump);
            this.processor.process(moveCommand);

            // ataque (si se ha configurado la tecla)
            if (mapping.attackKeyObj && mapping.attackKeyObj.isDown) {
                const attackCmd = new AttackPigeonCommand(pigeon);
                this.processor.process(attackCmd);
            }
        });
    }
}