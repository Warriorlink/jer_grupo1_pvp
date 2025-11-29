import Phaser from 'phaser';

export class OptionsScene extends Phaser.Scene {
    constructor() {
        super('OptionsScene');
    }

    preload() {
        this.load.image('fondoPvP', 'assets/sprites/Logo PvP.png');
        this.load.image('botonEncima', 'assets/sprites/boton_encima.png');
        this.load.image('boton', 'assets/sprites/boton.png');


        this.load.image('slider_bar', 'assets/sprites/slider_bar.png');
        this.load.image('slider_button', 'assets/sprites/slider_button.png');
    }

    create() {
        this.cameras.main.setAlpha(0);

        this.tweens.add({
            targets: this.cameras.main,
            alpha: 1,
            duration: 800
        });

        this.add.image(480, 270, 'fondoPvP').setScale(0.5);

        this.add.text(480, 50, 'Options', {
            fontSize: '64px',
            color: '#ffffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);



        this.add.text(480, 240, 'Volume', {
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        //Posición del slider
        const barX = 480;
        const barY = 300;

        //Barra
        const bar = this.add.image(barX, barY, 'slider_bar')
            .setDisplaySize(300, 20)
            .setOrigin(0.5);

        //Botón del slider
        const button = this.add.image(barX, barY, 'slider_button')
            .setDisplaySize(40, 40)
            .setInteractive({ draggable: true })
            .setOrigin(0.5);

        // establecer posición inicial según volumen global
        button.x = barX - 150 + (this.sound.volume * 300);

        // interactividad
        this.input.setDraggable(button);

        this.input.on('drag', (pointer, obj, dragX, dragY) => {
            if (obj !== button) return;

            // limitar movimiento en X a la barra
            const left = barX - 150;
            const right = barX + 150;

            button.x = Phaser.Math.Clamp(dragX, left, right);

            // convertir posición a un valor 0 - 1
            const volume = (button.x - left) / 300;

            // aplicar volumen global
            this.sound.volume = volume;
        });


        const backBtnSprite = this.add.image(480, 450, 'boton')
            .setInteractive({ useHandCursor: true });

        const backButtonText = this.add.text(480, 450, 'Back to Menu', {
            fontSize: '24px',
            color: '#000000',
        }).setOrigin(0.5);

        backBtnSprite.on('pointerover', () => backBtnSprite.setTexture('botonEncima'));
        backBtnSprite.on('pointerout', () => backBtnSprite.setTexture('boton'));

        backBtnSprite.on('pointerdown', () => {
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
}
