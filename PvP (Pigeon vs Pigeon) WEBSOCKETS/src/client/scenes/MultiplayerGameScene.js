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


export class MultiplayerGameScene extends Phaser.Scene {

    constructor() {
        super('MultiplayerGameScene');
    }

    init(data) {
        this.ws = data.ws;
        this.roomId = data.roomId;

        this.players = new Map();
        this.isPaused = false;
        this.escWasDown = false;
        this.gameEnded = false;
        this.processor = new CommandProcessor();
        this.churro = null;
        this.powerUp = null;

        this.playerRole = data.playerRole;
        this.localPaloma = null;
        this.remotePaloma = null;
        this.localScore = 0;
        this.remoteScore = 0;
        //Keys para los controles
        /** @type {{ up: Phaser.Input.Keyboard.Key, left: Phaser.Input.Keyboard.Key, right: Phaser.Input.Keyboard.Key, attack: Phaser.Input.Keyboard.Key }} */
        this.keys;

        this.churroOverlap = null;
        this.powerUpOverlap = null;






    }

    #region //Preloads
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
        this.load.image('Desconexion', 'assets/sprites/desconexion.png');

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
    #endregion

    create() {

        this.connectionListener = (data) => {
            if (!data.connected && this.scene.isActive()) {
                this.onConnectionLost();
            }
        };


        this.events.on('shutdown', () => {
            console.log('[MultiplayerGameScene] SHUTDOWN event fired');
        }, this);

        this.events.on('destroy', () => {
            console.log('[MultiplayerGameScene] DESTROY event fired');
        }, this);

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

        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            attack: Phaser.Input.Keyboard.KeyCodes.F
        });
        this.createPlatforms();



        this.pigeonIndicators = {
            player1: this.add.image(10, 60, 'Icon_d').setVisible(false).setDepth(999),
            player2: this.add.image(10, 60, 'Icon_p').setVisible(false).setDepth(999)
        };

        this.createAnimations();

        //Puntuaciones
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

        //Indicador de que paloma es el jugador local
        this.youLabel = this.add.text(0, 0, 'You', {
            fontSize: '20px',
            color: '#ffffffff',
            stroke: '#000000ff',
            strokeThickness: 4
        });

        //Posicion del "You"
        this.updateYouLabel();

        this.playerSprites = this.physics.add.group();
        this.setUpPlayers();
        this.players.forEach(pigeon => {
            this.playerSprites.add(pigeon.sprite);
        });

        //Colisiones entre palomas y plataformas
        this.physics.add.collider(this.playerSprites, this.platforms);
        this.physics.add.overlap(this.playerSprites, this.playerSprites);

        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        //Set up WebSocket listeners
        this.setupWebSocketListeners();


    }

    onConnectionLost() {
        this.scene.pause();
        this.scene.launch('ConnectionLostScene', { previousScene: 'GameScene' });
    }

    updateYouLabel() {
        if (!this.youLabel) return;
        this.youLabel.setVisible(true);

        if (this.playerRole === 'player1') {
            //Dovenando
            const x = this.scoreTextP1.x + (this.scoreTextP1.width || this.scoreTextP1.getBounds().width) + 5;
            const y = this.scoreTextP1.y + 5;
            this.youLabel.setPosition(x, y);
        } else {
            //Palomón
            const x = this.scoreTextP2.x - (this.youLabel.width || this.youLabel.getBounds().width) - 5;
            const y = this.scoreTextP2.y + 5;
            this.youLabel.setPosition(x, y);
        }
    }

    createAnimations() {
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
        if (this.playerRole === 'player1') {
            this.localPaloma = new Pigeon(this, 'player1', 150, 435, 'dovenando');
            this.remotePaloma = new Pigeon(this, 'player2', 800, 435, 'palomon');
        } else {
            this.localPaloma = new Pigeon(this, 'player2', 800, 435, 'palomon');
            this.remotePaloma = new Pigeon(this, 'player1', 150, 435, 'dovenando');
        }

        this.players.set(this.localPaloma.id, this.localPaloma);
        this.players.set(this.remotePaloma.id, this.remotePaloma);

        this.remotePaloma.sprite.flipX = true;
        this.remotePaloma.facing = 'left';
    }

    setupWebSocketListeners() {
        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleServerMessage(data);
            } catch (error) {
                console.error('Error parsing server message:', error);
            }
        };

        this.ws.onclose = () => {
            console.log('WebSocket connection closed');
            if (!this.gameEnded) {
                this.handleDisconnection('Server closed the connection');
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            if (!this.gameEnded) {
                this.handleDisconnection();
            }
        };
    }

    handleServerMessage(data) {
        switch (data.type) {
            case 'pigeonUpdate':
                const p = this.remotePaloma;

                p.sprite.x = data.x;
                p.sprite.y = data.y;

                p.facing = data.facing;
                p.sprite.flipX = data.facing === 'left' ? !p.invertFlipForMovement : p.invertFlipForMovement;

                const animKey = p.character === 'palomon' ? `palomon_${data.anim}` : `dovenando_${data.anim}`;

                if (!p.sprite.anims.isPlaying ||
                    p.sprite.anims.currentAnim.key !== animKey) {
                    p.sprite.play(animKey, true);
                }
                break;

            case 'scoreUpdate':
                this.localScore = this.playerRole === 'player1' ? data.player1Score : data.player2Score;
                this.remoteScore = this.playerRole === 'player1' ? data.player2Score : data.player1Score;

                this.scoreTextP1.setText(`Dovenando: ${data.player1Score}`);
                this.scoreTextP2.setText(`Palomón: ${data.player2Score}`);

                this.updateYouLabel();
                break;

            case 'attackResolve': {
                const attacker = this.players.get(data.attackerId);
                if (!attacker) return;

                attacker.facing = data.facing;
                attacker.sprite.flipX = data.facing === 'left';

                const cmd = new AttackPigeonCommand(attacker);
                this.processor.process(cmd);
                break;
            }

            case 'itemSpawn':
                this.spawnItemFromServer(data.item);
                break;

            case 'itemDespawn':
                if (data.itemType === 'churro' && this.churro) {
                    if (this.churroOverlap) {
                        this.physics.world.removeCollider(this.churroOverlap);
                        this.churroOverlap = null;
                    }
                    this.churro.destroy();
                    this.churro = null;
                }

                if (data.itemType === 'powerUp' && this.powerUp) {
                    if (this.powerUpOverlap) {
                        this.powerUpOverlap.destroy();
                        this.powerUpOverlap = null;
                    }
                    this.powerUp.destroy();
                    this.powerUp = null;
                }
                break;

            case 'gameOver':
                this.endGame(data.winner, data.player1Score, data.player2Score);
                break;


            case 'playerDisconnected':
                this.handleDisconnection('Opponent Disconnected');
                break;

            case 'itemCollected': {
                const pigeon = data.playerId === this.localPaloma.id ? this.localPaloma : this.remotePaloma;

                if (data.itemType === 'churro') {
                    this.sound.play('SonidoChurro', {
                        volume: 0.5
                    });
                    pigeon.addScore(1);

                    //Actualizar textos de puntuación
                    this.scoreTextP1.setText(`Dovenando: ${this.playerRole === 'player1' ? this.localPaloma.score : this.remotePaloma.score}`);
                    this.scoreTextP2.setText(`Palomón: ${this.playerRole === 'player1' ? this.remotePaloma.score : this.localPaloma.score}`);

                } else {
                    //Aplicar efectos según power-up
                    switch (data.itemType) {
                        case 'avena':
                            this.sound.play('SonidoAvena', {
                                volume: 0.5
                            });
                            this.showItemIcon(pigeon, 'iconAvena', 5000);
                            pigeon.stunForce += 500;
                            pigeon.attackForce += 200;
                            this.time.delayedCall(5000, () => {
                                pigeon.stunForce -= 500;
                                pigeon.attackForce -= 200;
                            });
                            break;
                        case 'pluma':
                            this.sound.play('SonidoPluma', {
                                volume: 0.5
                            });
                            this.showItemIcon(pigeon, 'iconPluma', 5000);
                            pigeon.applyModifier('speed', 150, 5000);
                            break;
                        case 'basura':
                            this.sound.play('SonidoBasura', {
                                volume: 0.5
                            });
                            this.showItemIcon(pigeon, 'iconBasura', 5000);
                            pigeon.applyModifier('speed', -150, 5000);
                            break;
                    }
                }
                break;
            }

            default:
                console.log('Unknown message type:', data.type);
        }
    }

    handleDisconnection(reason) {
        this.gameEnded = true;
        this.localPaloma.sprite.setVelocity(0, 0);
        this.remotePaloma.sprite.setVelocity(0, 0);
        this.physics.pause();

        this.add.image(480, 270, 'Desconexion');

        this.add.text(480, 250, `${reason}`, {
            fontSize: '48px',
            color: '#ff0000ff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.createMenuButton();
    }

    createMenuButton() {
        const backBtnSprite = this.add.image(480, 450, 'boton')
            .setInteractive({ useHandCursor: true });

        const backButtonText = this.add.text(480, 450, 'Return to Menu', {
            fontSize: '24px',
            color: '#000000',
        }).setOrigin(0.5);

        backBtnSprite.on('pointerover', () => backBtnSprite.setTexture('botonEncima'));
        backBtnSprite.on('pointerout', () => backBtnSprite.setTexture('boton'));
        backBtnSprite.on('pointerdown', () => {
            this.bgMusic.stop();
            this.bgMusic.destroy();
            this.bgMusic = null;

            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.close();
            }
            this.cameras.main.setAlpha(1);

            this.scene.transition({
                target: 'MenuScene',
                duration: 1000,
                moveBelow: true,
                data: {},
                onUpdate: (progress) => {
                    this.cameras.main.setAlpha(1 - progress);
                }
            });
        });
    }

    spawnItemFromServer(itemData) {
        const { type, x, y } = itemData;

        let ItemClass = null;
        let refName = null;

        switch (type) {
            case 'churro': ItemClass = Churro; refName = 'churro'; break;
            case 'avena': ItemClass = Avena; refName = 'powerUp'; break;
            case 'pluma': ItemClass = Pluma; refName = 'powerUp'; break;
            case 'basura': ItemClass = Basura; refName = 'powerUp'; break;
            default: return;
        }

        const item = new ItemClass(this, x, y);
        this[refName] = item;

        if (refName === 'churro' && this.churroOverlap) {
            this.churroOverlap.destroy();
            this.churroOverlap = null;
        }
        if (refName === 'powerUp' && this.powerUpOverlap) {
            this.powerUpOverlap.destroy();
            this.powerUpOverlap = null;
        }

        const overlap = this.physics.add.overlap(
            this.localPaloma.sprite,
            item.sprite,
            () => {
                this.sendMessage({
                    type: 'itemTouch',
                    itemId: itemData.id
                });
            },
            null,
            this
        );


        if (refName === 'churro') this.churroOverlap = overlap;
        else this.powerUpOverlap = overlap;
    }

    showItemIcon(pigeon, iconKey, duration) {

        if (pigeon.activeIconSprite) {
            pigeon.activeIconSprite.destroy();
            pigeon.activeIconSprite = null;
        }

        if (pigeon.activeIconTimer) {
            pigeon.activeIconTimer.remove();
            pigeon.activeIconTimer = null;
        }

        let iconX;
        const iconY = 85;

        if (this.scoreTextP1 && this.scoreTextP2) {
            iconX = pigeon.id === 'player1'
                ? this.scoreTextP1.x + 25
                : this.scoreTextP2.x + 175;
        } else {
            iconX = pigeon.id === 'player1' ? 40 : 850;
        }

        pigeon.activeIconSprite = this.add.image(iconX, iconY, iconKey)
            .setDisplaySize(50, 50)
            .setDepth(1000);

        pigeon.activeIconTimer = this.time.addEvent({
            delay: duration,
            callback: () => {
                if (pigeon.activeIconSprite) {
                    pigeon.activeIconSprite.destroy();
                    pigeon.activeIconSprite = null;
                }
                pigeon.activeIconTimer = null;
            }
        });
    }

    sendMessage(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    endGame(winnerId, player1Score, player2Score) {
        this.gameEnded = true;
        this.bgMusic.stop();
        this.bgMusic.destroy();
        this.bgMusic = null;

        this.scene.start('EndGameScene', {
                winnerId,
                localPlayerId: this.playerRole,
                player1Score,
                player2Score,
                ws: this.ws
        });
    }

    update() {

        if (this.gameEnded) return;

        const pigeon = this.localPaloma;
        if (!pigeon) return;

        //Si la paloma está stuneada no puede hacer nada: detener movimiento horizontal
        if (pigeon.stunned) {
            //Permitir knockback durante un corto periodo tras recibir el golpe
            if (!pigeon.knockbackExpire || this.time.now > pigeon.knockbackExpire) {
                pigeon.sprite.setVelocityX(0);
            }
            return;
        }

        //Movimiento horizontal (A - D)
        let moveX = 0;

        if (this.keys.left.isDown) {
            moveX = -1;
            pigeon.sprite.flipX = true;
            pigeon.facing = 'left';
        }
        else if (this.keys.right.isDown) {
            moveX = 1;
            pigeon.sprite.flipX = false;
            pigeon.facing = 'right';
        }

        //Salto (W)
        const jump = Phaser.Input.Keyboard.JustDown(this.keys.up);

        //Enviar comando con movimiento horizontal y salto
        let moveCommand = new MovePigeonCommand(pigeon, moveX, jump);
        this.processor.process(moveCommand);

        //Mandar posición al server
        this.sendMessage({
            type: 'pigeonMove',
            x: this.localPaloma.sprite.x,
            y: this.localPaloma.sprite.y,
            anim: this.localPaloma.currentAnim,
            facing: this.localPaloma.facing
        });

        //Ataque (F)
        if (Phaser.Input.Keyboard.JustDown(this.keys.attack)) {
            this.sendMessage({
                type: 'attackRequest',
                facing: pigeon.facing,
                x: pigeon.sprite.x,
                y: pigeon.sprite.y
            });
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

    };



    //Eliminar música al cerrar la escena y cerrar listeners
    shutdown() {
        console.log('[MultiplayerGameScene] shutdown called');
        console.log(
            '[MultiplayerGameScene] WS state on shutdown:',
            this.ws.readyState
        );

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.close();
        }
        

        if (this.bgMusic) {
            this.bgMusic.stop();
            this.bgMusic.destroy();
            this.bgMusic = null;
        }
    }
}