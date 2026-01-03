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

        this.updateWins(data.winnerId);

        const winnerIsP1 = data.winnerId === 'player1';
        const bgKey = winnerIsP1 ? 'DovenandoVictory' : 'PalomonVictory';

        this.add.image(480, 270, bgKey);

        this.tweens.add({
            targets: this.cameras.main,
            alpha: 1,
            duration: 800
        });

        //Textos de victoria
        this.add.text(480, 250, 'SUPREME VICTORY', {
            fontSize: '100px',
            color: '#4444ff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 10
        }).setOrigin(0.5);
        const winnerText = data.winnerId === 'player1' ? 'Dovenando Wins!' : 'Palomón Wins!';
        this.add.text(480, 350, winnerText, {
            fontSize: '64px',
            color: '#ffffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        //Música de fondo
        this.bgMusic = this.sound.add('SweetVictory', {
            loop: true,
            volume: 0.6
        });
        this.bgMusic.play();

        this.events.on('shutdown', this.onShutdown, this);
        this.events.on('destroy', this.onShutdown, this);

        //Botón para volver al menú
        const menuBtnSprite = this.add.image(480, 460, 'boton')
            .setInteractive({ useHandCursor: true });
        const menuBtnText = this.add.text(480, 460, 'Return to menu', {
            fontSize: '24px',
            color: 'ffffff'
        }).setOrigin(0.5).setDepth(10)

        menuBtnSprite.on('pointerover', () => menuBtnSprite.setTexture('botonEncima'))
        menuBtnSprite.on('pointerout', () => menuBtnSprite.setTexture('boton'))
            .on('pointerdown', () => {

                this.cameras.main.setAlpha(1);
                //Transición a MenuScene
                this.scene.transition({
                    target: 'MenuScene',
                    duration: 1000,
                    moveBelow: true,
                    data: {},

                    //Fade-out progresivo
                    onUpdate: (progress) => {
                        this.cameras.main.setAlpha(1 - progress);
                    }
                });
            });
    }

    //Parar la música al salir de la escena
    onShutdown() {
        if (this.bgMusic) {
            this.bgMusic.stop();
            this.bgMusic.destroy();
            this.bgMusic = null;
        }
    }

    //Para actualizar las victorias en el server y en local
    async updateWins(winnerId) {
    const userId = this.registry.get('userId');

    let player1Win = this.registry.get('player1Win');
    let player2Win = this.registry.get('player2Win');

    if (winnerId === 'player1') {
        player1Win++;
        this.registry.set('player1Win', player1Win);
    } else {
        player2Win++;
        this.registry.set('player2Win', player2Win);
    }

    if (!userId) {
        console.log("no hay usuario")
        return}; // Invitado → no guardar¡
        
    try {
        await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                player1Win,
                player2Win
            })
        });
    } catch (error) {
        console.error('Error actualizando victorias:', error);
    }
}

}