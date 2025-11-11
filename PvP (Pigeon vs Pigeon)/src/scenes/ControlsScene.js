import Phaser from "phaser";

export class ControlsScene extends Phaser.Scene {
    constructor() {
        super('ControlsScene');
    }
    create() {
        this.add.text(480, 50, 'Controls', { 
            fontSize: '64px', 
            color: '#ffffffff'
    }).setOrigin(0.5);
    // Controles Jugador 1
        this.add.text(480, 150, 'Player 1', {
            fontSize: '32px',
            color: '#ffff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(480, 200, 'Move: W - A - D (Up, Left, Right)', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(480, 240, 'Power-up: E', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(480, 280, 'Attack: F', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Controles Jugador 2
        this.add.text(480, 360, 'Player 2 (Local)', {
            fontSize: '32px',
            color: '#ffff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(480, 410, 'Move: I - J - L (Up, Left, Right)', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(480, 450, 'Power-up: O', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(480, 490, 'Attack: Ñ', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Botón para volver al menú
        const backButton = this.add.text(480, 520, 'Back to Menu', {
            fontSize: '24px',
            color: '#ffff00',
        }).setOrigin(0.5);
        backButton.setInteractive({ useHandCursor: true });
        backButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}