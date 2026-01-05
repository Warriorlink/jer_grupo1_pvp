import Phaser from 'phaser';
import { Pigeon } from '../entities/Pigeon.js';
import { CommandProcessor } from '../commands/CommandProcessor.js';
import { MovePigeonCommand } from '../commands/MovePigeonCommand.js';
import { PauseCommand } from '../commands/PauseCommand.js';
import { AttackPigeonCommand } from '../commands/AttackPigeonCommand.js';
import { Churro } from '../entities/Churro.js';
import { Avena } from '../entities/Avena.js';
import { Pluma } from '../entities/Pluma.js';
import { Basura } from '../entities/Basura.js';

import { connectionManager } from '../services/ConnectionManager';

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
        this.churro = null;
        this.powerUp = null;

        //Posiciones de aparición de objetos y churros
        this.itemSpawnPositions = [
            { x: 560, y: 45 },
            { x: 415, y: 200 },
            { x: 790, y: 115 },
            { x: 790, y: 280 },
            { x: 126, y: 115 },
            { x: 126, y: 280 },
            { x: 560, y: 455 }
        ];

        this.powerUps = [
            'avena',
            'basura',
            'pluma'
        ];
    }


    preload() {
        //Sprites e imágenes de fondo
        this.load.image('background', 'assets/sprites/background.png');
        this.load.image('palomon', 'assets/sprites/palomon.png');
        this.load.image('dovenando', 'assets/sprites/dovenando.png');
        this.load.image('churro', 'assets/sprites/Churro JER.png');
        this.load.image('avena', 'assets/sprites/Avena.png');
        this.load.image('pluma', 'assets/sprites/Pluma.png');
        this.load.image('basura', 'assets/sprites/Basura.png');
        this.load.image('dovenandoAttack', 'assets/sprites/Dovenando_attack.png');
        this.load.image('palomonAttack', 'assets/sprites/Palomon_attack.png');
        this.load.image('iconPluma', 'assets/sprites/Icon_fast.png');
        this.load.image('iconBasura', 'assets/sprites/Icon_slow.png');
        this.load.image('iconAvena', 'assets/sprites/Icon_strong.png');
        this.load.image('Icon_p', 'assets/sprites/Icon_Palomon.png');
        this.load.image('Icon_d', 'assets/sprites/Icon_Dovenando.png');
        this.load.image('fondoDesc', 'assets/sprites/desconexion.png');

        //Música y sonidos
        this.load.audio('Numb', 'assets/sounds/Numb.mp3');
        this.load.audio('SonidoPluma', 'assets/sounds/sonidoPluma.mp3');
        this.load.audio('SonidoChurro', 'assets/sounds/sonidoChurro.mp3');
        this.load.audio('SonidoBasura', 'assets/sounds/sonidoBasura.mp3');
        this.load.audio('SonidoAtaque', 'assets/sounds/sonidoAtaque.mp3');
        this.load.audio('SonidoAvena', 'assets/sounds/sonidoAlpiste.mp3');

        this.load.spritesheet('palomonSheet', 'assets/sprites/Palomon_walk.png', {
            frameWidth: 66,
            frameHeight: 66
        });
        this.load.spritesheet('dovenandoSheet', 'assets/sprites/Dovenando_walk.png', {
            frameWidth: 66,
            frameHeight: 66
        });
        this.load.spritesheet('churroSheet', 'assets/sprites/Churro JER-sheet.png', {
            frameWidth: 25,
            frameHeight: 25
        });
        this.load.spritesheet('palomonAttackSheet', 'assets/sprites/Palomon_walk_noWing.png', {
            frameWidth: 66,
            frameHeight: 66
        });
        this.load.spritesheet('dovenandoAttackSheet', 'assets/sprites/Dovenando_walk_noWing.png', {
            frameWidth: 66,
            frameHeight: 66
        });
    }

    create() {

        this.connectionListener = (data) => {
            if (!data.connected && this.scene.isActive()) {
                this.onConnectionLost();
            }
        };
        connectionManager.addListener(this.connectionListener);

        
        this.cameras.main.setAlpha(0);

        this.tweens.add({
            targets: this.cameras.main,
            alpha: 1,
            duration: 800
        });

        this.add.image(480, 270, 'background');

        //Musica de fondo
        this.bgMusic = this.sound.add('Numb', {
            loop: true,
            volume: 0.5
        });
        this.bgMusic.play();

        this.createPlatforms();

        this.setUpPlayers();

        this.pigeonIndicators = {
            player1: this.add.image(10, 60, 'Icon_d').setVisible(false).setDepth(999),
            player2: this.add.image(10, 60, 'Icon_p').setVisible(false).setDepth(999)
        };

        //Animaciones de los spritesheets
        this.anims.create({
            key: 'palomon_idle',
            frames: [{ key: 'palomonSheet', frame: 0 }],
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'palomon_walk',
            frames: this.anims.generateFrameNumbers('palomonSheet', { start: 1, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'dovenando_idle',
            frames: [{ key: 'dovenandoSheet', frame: 0 }],
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'dovenando_walk',
            frames: this.anims.generateFrameNumbers('dovenandoSheet', { start: 1, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'churro_anim',
            frames: this.anims.generateFrameNumbers('churroSheet', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'palomon_attack',
            frames: this.anims.generateFrameNumbers('palomonAttackSheet', { start: 1, end: 3 }), // ajusta end si hay más frames
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'dovenando_attack',
            frames: this.anims.generateFrameNumbers('dovenandoAttackSheet', { start: 1, end: 3 }), // ajusta end si hay más frames
            frameRate: 8,
            repeat: -1
        });


        //Puntuacione
        this.scoreTextP1 = this.add.text(10, 20, 'Dovenando: 0', {
            fontSize: '32px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        });

        this.scoreTextP2 = this.add.text(750, 20, 'Palomón: 0', {
            fontSize: '32px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        });

        this.playerSprites = this.physics.add.group();
        this.players.forEach(pigeon => {
            this.playerSprites.add(pigeon.sprite);
        });

        //Colisiones entre palomas y plataformas
        this.physics.add.collider(this.playerSprites, this.platforms);
        this.physics.add.overlap(this.playerSprites, this.playerSprites);

        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        //Cada 5 segundos intentar generar un churro
        this.time.addEvent({
            delay: 5000,
            loop: true,
            callback: () => {
                if (this.churro === null) {
                    this.spawnItem("churro");
                }
            }
        });

        //Cada 7 segundos intentar generar un churro
        this.time.addEvent({
            delay: 7000,
            loop: true,
            callback: () => {
                if (this.powerUp === null) {
                    this.spawnItem(Phaser.Utils.Array.GetRandom(this.powerUps));
                }
            }
        })

        this.events.on('shutdown', this.onShutdown, this);
        this.events.on('destroy', this.onShutdown, this);

    }

    onConnectionLost() {
            this.scene.pause();
            this.scene.launch('ConnectionLostScene', { previousScene: 'GameScene' });
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

    //Configuración de palomas y controles
    setUpPlayers() {
        const leftPigeon = new Pigeon(this, 'player1', 150, 435, 'dovenando');
        const rightPigeon = new Pigeon(this, 'player2', 800, 435, 'palomon');

        rightPigeon.sprite.flipX = true;
        rightPigeon.facing = 'left';

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

    //Generar un objeto en una posición aleatoria disponible
    spawnItem(type) {

        let refName = null;
        let ItemClass = null;

        //Decidir qué clase instanciar y qué referencia usar
        switch (type) {
            case "churro":
                refName = "churro";
                ItemClass = Churro;
                break;

            case "avena":
                refName = "powerUp";
                ItemClass = Avena;
                break;

            case "pluma":
                refName = "powerUp";
                ItemClass = Pluma;
                break;

            case "basura":
                refName = "powerUp";
                ItemClass = Basura;
                break;

            default:
                console.warn("Tipo desconocido:", type);
                return;
        }

        const availablePositions = this.itemSpawnPositions.filter(pos => {

            //Evitar posición donde hay churro
            if (this.churro && this.churro.sprite.x === pos.x && this.churro.sprite.y === pos.y) {
                return false;
            }

            // Evitar posición donde hay power-up
            if (this.powerUp && this.powerUp.sprite.x === pos.x && this.powerUp.sprite.y === pos.y) {
                return false;
            }

            return true;
        });

        //Elegir una posición al azar
        const pos = Phaser.Utils.Array.GetRandom(availablePositions);

        const item = new ItemClass(this, pos.x, pos.y);
        this[refName] = (item);

        //Activar overlap con ambos jugadores
        this.players.forEach(pigeon => {
            this.physics.add.overlap(
                pigeon.sprite,
                item.sprite,
                this.onItemPickup,
                null,
                this);
        });


        if (refName === "powerUp") {

            //Tiempo de vida del power-up 
            const lifetime = 9000;

            //Guardar el timer en el propio objeto para poder cancelarlo si hace falta
            item.expireTimer = this.time.delayedCall(lifetime, () => {

                if (this.powerUp === item) {
                    this.deleteItem(item);
                }
            });
        }
    }

    //Manejo de recogida de objetos
    onItemPickup(pigeonSprite, itemSprite) {

        let playerId = null;

        this.players.forEach((pigeon, id) => {
            if (pigeon.sprite === pigeonSprite) {
                playerId = id;
            }
        });

        if (!playerId) return;

        const pigeon = this.players.get(playerId);
        const item = this.getItemBySprite(itemSprite);

        item.applyEffect(pigeon);

        //Actualizar puntuaciones
        this.scoreTextP1.setText('Dovenando: ' + this.players.get('player1').score);
        this.scoreTextP2.setText('Palomón: ' + this.players.get('player2').score);

        this.deleteItem(item);
        if (pigeon.score >= 5) {

            this.cameras.main.setAlpha(1);

            //Transición a EndGameScene
            this.scene.transition({
                target: 'EndGameScene',
                duration: 1000,
                moveBelow: true,
                data: { winnerId: playerId },

                //Fade-out progresivo
                onUpdate: (progress) => {
                    this.cameras.main.setAlpha(1 - progress);
                }
            });
        }
    }

    //Devuelve el objeto al que pertenece un sprite
    getItemBySprite(sprite) {
        if (this.churro && this.churro.sprite === sprite) return this.churro;
        if (this.powerUp && this.powerUp.sprite === sprite) return this.powerUp;
        return null;
    }

    //Elimina de la escena un objeto dado
    deleteItem(item) {
        if (item === this.churro) {
            this.churro.destroy();
            this.churro = null;
        }

        if (item === this.powerUp) {
            this.powerUp.destroy();
            this.powerUp = null;
        }
    }

    //Establece el estado de pausa del juego
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

            //Si la paloma está stunada no puede hacer nada: detener movimiento horizontal
            if (pigeon.stunned) {
                //Permitir knockback durante un corto periodo tras recibir el golpe
                if (!pigeon.knockbackExpire || this.time.now > pigeon.knockbackExpire) {
                    pigeon.sprite.setVelocityX(0);
                }
                return;
            }

            //Calcular movimiento horizontal
            let moveX = 0;
            if (mapping.leftKeyObj.isDown) moveX = -1;
            else if (mapping.rightKeyObj.isDown) moveX = 1;

            const jump = mapping.upKeyObj.isDown;

            //Enviar comando con movimiento horizontal y salto
            let moveCommand = new MovePigeonCommand(pigeon, moveX, jump);
            this.processor.process(moveCommand);

            //Ataque
            if (mapping.attackKeyObj && mapping.attackKeyObj.isDown) {
                const attackCmd = new AttackPigeonCommand(pigeon);
                this.processor.process(attackCmd);
            }

            this.players.forEach((pigeon, id) => {

                const indicator = this.pigeonIndicators[id];
                const sprite = pigeon.sprite;

                if (sprite.y < -5) {
                    //Si la paloma esta fuera por arriba muestra el indicador
                    indicator.setVisible(true);
                    indicator.x = sprite.x;
                    indicator.y = 50;

                } else {
                    //Si vuelve a entrar se oculta el icono
                    indicator.setVisible(false);
                }
            });
        });
    }
    

    //Eliminar música al cerrar la escena y cerrrar listeners
    onShutdown() {
        // Remover el listener
        if (this.connectionListener) {
            connectionManager.removeListener(this.connectionListener);
        }

        if (this.bgMusic) {
            this.bgMusic.stop();
            this.bgMusic.destroy();
            this.bgMusic = null;
        }
    }
    
    
}