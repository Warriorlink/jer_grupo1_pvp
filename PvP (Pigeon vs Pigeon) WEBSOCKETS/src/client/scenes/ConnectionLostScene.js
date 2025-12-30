import Phaser from 'phaser';
import { connectionManager } from '../services/ConnectionManager';

/**
 * Escena que se muestra cuando se pierde la conexión con el servidor
 * Pausa el resto de escenas y comprueba continuamente hasta que se restablezca
 */
export class ConnectionLostScene extends Phaser.Scene {
    constructor() {
        super('ConnectionLostScene');
        this.reconnectCheckInterval = null;
    }

    init(data) {
        // Guardar la escena que estaba activa cuando se perdió la conexión
        this.previousScene = data.previousScene;
    }

    create() {
        // Fondo semi-transparente
        this.add.rectangle(480, 270, 960, 540, 0x000000, 0.7);

        // Título
        this.add.text(480, 200, 'CONNECTION LOST', {
            fontSize: '64px',
            color: '#ff0000ff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Mensaje
        this.statusText = this.add.text(480, 300, 'Attempting to reconnect...', {
            fontSize: '24px',
            color: '#ffffffff',
            fontStyle: 'bold',
            stroke: '#000000',
        }).setOrigin(0.5);

        // Contador de intentos
        this.attemptCount = 0;
        this.attemptText = this.add.text(480, 350, 'Attempts: 0', {
            fontSize: '18px',
            color: '#ffffffff',
            fontStyle: 'bold',
            stroke: '#000000',
        }).setOrigin(0.5);

        // Indicador parpadeante
        this.dotCount = 0;
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.dotCount = (this.dotCount + 1) % 4;
                const dots = '.'.repeat(this.dotCount);
                this.statusText.setText(`Attempting to reconnect${dots}`);
            },
            loop: true
        });

        // Listener para cambios de conexión
        this.connectionListener = (data) => {
            if (data.connected) {
                this.onReconnected();
            }
        };
        connectionManager.addListener(this.connectionListener);

        // Intentar reconectar cada 2 segundos
        this.reconnectCheckInterval = setInterval(() => {
            this.attemptReconnect();
        }, 2000);

        // Primer intento inmediato
        this.attemptReconnect();
    }

    async attemptReconnect() {
        this.attemptCount++;
        this.attemptText.setText(`Attempts: ${this.attemptCount}`);
        await connectionManager.checkConnection();
    }

    onReconnected() {
        // Limpiar interval
        if (this.reconnectCheckInterval) {
            clearInterval(this.reconnectCheckInterval);
        }

        // Remover listener
        connectionManager.removeListener(this.connectionListener);

        // Mensaje de éxito
        this.statusText.setText('Connection restored!');
        this.statusText.setColor('#00ff00');

        // Volver a la escena anterior
        this.time.delayedCall(1000, () => {
            this.scene.stop();
            if (this.previousScene) {
                this.scene.resume(this.previousScene);
            }
        });
    }

    shutdown() {
        // Limpiar el interval al cerrar la escena
        if (this.reconnectCheckInterval) {
            clearInterval(this.reconnectCheckInterval);
        }
        // Remover el listener
        if (this.connectionListener) {
            connectionManager.removeListener(this.connectionListener);
        }
    }
}
