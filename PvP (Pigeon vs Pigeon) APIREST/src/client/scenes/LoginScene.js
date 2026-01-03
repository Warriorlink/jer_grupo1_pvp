import Phaser from "phaser";

export class LoginScene extends Phaser.Scene {
    constructor() {
        super('LoginScene');
    }
    preload() {
        this.load.image('fondo', 'assets/sprites/pantalla inicio.png');
        this.load.image('botonEncima', 'assets/sprites/boton_encima.png');
        this.load.image('boton', 'assets/sprites/boton.png');
    }
    create() {
        this.cameras.main.setAlpha(0);

        this.tweens.add({
            targets: this.cameras.main,
            alpha: 1,
            duration: 800
        });
        this.add.image(480, 270, 'fondo');

        this.add.text(480, 50, 'Login', {
            fontSize: '64px',
            color: '#ffffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // 1. Creamos el objeto DOM en Phaser
        const userInput = this.add.dom(400, 200).createElement('input');

        // 2. Accedemos directamente a la propiedad 'node'
        // En JS no necesitas decir qué tipo de elemento es
        const el = userInput.node;

        el.placeholder = "Usuario"; // Funcionará sin problemas
        el.type = "text";

        // Estilos rápidos
        el.style.width = '250px';
        el.style.height = '40px';
        el.style.fontSize = '20px';

        // 3. Para el botón de enviar
        const loginBtnSprite = this.add.image(480, 300, 'boton')
            .setInteractive({ useHandCursor: true });
        const loginButtonText = this.add.text(480, 300, 'Login', {
            fontSize: '24px',
            color: '#000000',
        }).setOrigin(0.5);

        loginBtnSprite.on('pointerover', () => loginBtnSprite.setTexture('botonEncima'))
        loginBtnSprite.on('pointerout', () => loginBtnSprite.setTexture('boton'))
        loginBtnSprite.on('pointerdown', async () => {

            const username = el.value.trim();

            if (!username) {
                alert('El nombre no puede estar vacío');
                return;
            }

            try {
                let user;

                // 1. Intentar obtener el usuario por nombre
                const getRes = await fetch(`/api/users?name=${encodeURIComponent(username)}`);

                if (getRes.ok) {
                    // Usuario existe
                    user = await getRes.json();
                }
                else if (getRes.status === 404) {
                    // 2. Usuario NO existe → crearlo
                    const createRes = await fetch('/api/users', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: username })
                    });

                    if (!createRes.ok) {
                        throw new Error('Error al crear el usuario');
                    }

                    user = await createRes.json();
                }
                else {
                    // Error inesperado
                    throw new Error('Error al buscar el usuario');
                }

                // 3. Guardar datos en el registry
                this.registry.set('player1Win', user.player1Win);
                this.registry.set('player2Win', user.player2Win);
                this.registry.set('name', user.name);

                // 4. Transición a MenuScene
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

            } catch (error) {
                console.error(error);
                alert('No se pudo conectar con el servidor');
            }
        });


        //Botón para volver al menú
        const backBtnSprite = this.add.image(480, 500, 'boton')
            .setInteractive({ useHandCursor: true });
        const backButtonText = this.add.text(480, 500, 'Play as guest', {
            fontSize: '24px',
            color: '#000000',
        }).setOrigin(0.5);
        backBtnSprite.on('pointerover', () => backBtnSprite.setTexture('botonEncima'))
        backBtnSprite.on('pointerout', () => backBtnSprite.setTexture('boton'))
        backBtnSprite.on('pointerdown', () => {
            //Pasar datos por defecto al iniciar como invitado.
            this.registry.set('player1Win', 0);
            this.registry.set('player2Win', 0);
            this.registry.set('name', 'Invitado');
            //Asegurar que la cámara está totalmente visible antes de empezar el fade-out
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
    // Función auxiliar para no repetir estilos CSS

}