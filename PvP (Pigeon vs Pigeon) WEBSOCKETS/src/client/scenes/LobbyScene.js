/**
 * Lobby Scene - Waiting for multiplayer matchmaking
 */
export default class LobbyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LobbyScene' });
    this.ws = null;
  }

  preload() {
    this.load.audio('Ascensor', 'assets/sounds/CancionEspera.mp3');
    this.load.image('Fondo', 'assets/sprites/pantalla inicio.png');
  }
  create() {
    this.cameras.main.setAlpha(0);

    this.tweens.add({
      targets: this.cameras.main,
      alpha: 1,
      duration: 800
    });

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.image(480, 270, 'Fondo');

    if (!this.bgMusic) {
      this.bgMusic = this.sound.add('Ascensor', {
        loop: true,
        volume: 0.5
      });
      this.bgMusic.play();
    }

    // Title
    this.add.text(width / 2, 100, 'Online Multiplayer', {
      fontSize: '64px',
      color: '#ffffffff',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5);

    // Status text
    this.statusText = this.add.text(480, 200, 'Connecting to server...', {
      fontSize: '32px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Player count text
    this.playerCountText = this.add.text(480, 300, '', {
      fontSize: '32px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Cancel button
    const backBtnSprite = this.add.image(480, 450, 'boton')
      .setInteractive({ useHandCursor: true });

    const backButtonText = this.add.text(480, 450, 'Back to Menu', {
      fontSize: '24px',
      color: '#000000',
    }).setOrigin(0.5);

    backBtnSprite.on('pointerover', () => backBtnSprite.setTexture('botonEncima'));
    backBtnSprite.on('pointerout', () => backBtnSprite.setTexture('boton'));

    backBtnSprite.on('pointerdown', () => {
      this.leaveQueue();
      this.bgMusic.stop();
      this.bgMusic.destroy();
      this.bgMusic = null;
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

    // Connect to WebSocket server
    this.connectToServer();
  }

  connectToServer() {
    try {
      // Connect to WebSocket server (same host as web server)
      const wsUrl = `ws://${window.location.host}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('Connected to WebSocket server');
        this.statusText.setText('Waiting for opponent...');

        // Join matchmaking queue
        this.ws.send(JSON.stringify({ type: 'joinQueue' }));
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleServerMessage(data);
        } catch (error) {
          console.error('Error parsing server message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.statusText.setText('Connection error!');
        this.statusText.setColor('#ff0000');
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        if (this.scene.isActive('LobbyScene')) {
          this.statusText.setText('Connection lost!');
          this.statusText.setColor('#ff0000');
        }
      };
    } catch (error) {
      console.error('Error connecting to server:', error);
      this.statusText.setText('Failed to connect!');
      this.statusText.setColor('#ff0000');
    }
  }

  handleServerMessage(data) {
    switch (data.type) {
      case 'queueStatus':
        this.playerCountText.setText(`Players in queue: ${data.position}/2`);
        break;

      case 'gameStart':
        console.log('Game starting!', data);
        this.bgMusic.stop();

        // Store game data and transition to multiplayer game scene
        this.scene.start('MultiplayerGameScene', {
          ws: this.ws,
          playerRole: data.role,
          roomId: data.roomId,
        });
        break;

      default:
        console.log('Unknown message type:', data.type);
    }
  }

  leaveQueue() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'leaveQueue' }));
      this.ws.close();
    }
  }

  shutdown() {
    this.leaveQueue();
  }
}
