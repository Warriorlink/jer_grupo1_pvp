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
        this.input.keyboard.clearCaptures();
        this.input.keyboard.enabled = false;
        this.cameras.main.setAlpha(0);
        let center = this.cameras.main.width/2;
        this.tweens.add({
            targets: this.cameras.main,
            alpha: 1,
            duration: 800
        });
        this.add.image(480, 270, 'fondo');

        this.add.text(center, 50, 'Login', {
            fontSize: '64px',
            color: '#ffffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        const errorText = this.add.text(center, 160, 'Error al conectar con el servidor', {
                            fontSize: '20px',
                            color: '#ff0000ff',
                            stroke: '#000000',
                            strokeThickness: 4
                        }).setOrigin(0.5).setVisible(false);

        // Creamos el objeto DOM en Phaser
        
        const userInput = this.add.dom(435, 200).createElement('input');

        const el = userInput.node;

        el.placeholder = "Usuario"; 
        el.type = "text";

        // Estilos rápidos
        el.style.width = '250px';
        el.style.height = '40px';
        el.style.fontSize = '20px';

        // 3. Para el botón de enviar
        const loginBtnSprite = this.add.image(center, 300, 'boton')
            .setInteractive({ useHandCursor: true });
        const loginButtonText = this.add.text(center, 300, 'Login', {
            fontSize: '24px',
            color: '#000000',
        }).setOrigin(0.5);

        loginBtnSprite.on('pointerover', () => loginBtnSprite.setTexture('botonEncima'))
        loginBtnSprite.on('pointerout', () => loginBtnSprite.setTexture('boton'))
        loginBtnSprite.on('pointerdown', async () => {

            const username = el.value.trim();

            if (!username) {
                errorText.setText('Introduce un nombre de usuario');
                errorText.setColor('#ff0000ff');
                errorText.setVisible(true);
                return;
            }

            try {
                // 1. Obtener lista de usuarios
                const usersRes = await fetch('/api/users');
                if (!usersRes.ok) throw new Error('Error al obtener usuarios');

                const users = await usersRes.json();

                // 2. Buscar usuario por nombre
                let user = users.find(u => u.name === username);

                // 3. Si no existe, lo creamos
                if (!user) {
                    const createRes = await fetch('/api/users', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: username })
                    });

                    if (!createRes.ok) throw new Error('Error al crear usuario');

                    user = await createRes.json();
                }

                // 4. Guardar datos en el registry
                this.registry.set('player1Win', user.player1Win ?? 0);
                this.registry.set('player2Win', user.player2Win ?? 0);
                this.registry.set('name', user.name);
                this.registry.set('userId', user.id);

                // 5. Transición a MenuScene
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

                // 6. Error inesperado → NO cambiar de escena
                errorText.setText('Error al conectar con el servidor');
                errorText.setColor('#ff0000ff');
                errorText.setVisible(true);
                
            }
        });

        const deleteBtnSprite = this.add.image(center, 380, 'boton')
            .setInteractive({ useHandCursor: true });
        const deleteButtonText = this.add.text(center, 380, 'Delete user', {
            fontSize: '24px',
            color: '#000000',
        }).setOrigin(0.5);

        deleteBtnSprite.on('pointerover', () => deleteBtnSprite.setTexture('botonEncima'))
        deleteBtnSprite.on('pointerout', () => deleteBtnSprite.setTexture('boton'))
        deleteBtnSprite.on('pointerdown', async () => {

            const username = el.value.trim();

            if (!username) {
                errorText.setText('Introduce un nombre de usuario para borrar');
                errorText.setColor('#ff0000ff');
                errorText.setVisible(true);
                return;
            }

            try {
                // 1. Obtener lista de usuarios
                const usersRes = await fetch('/api/users');
                if (!usersRes.ok) throw new Error('Error al obtener usuarios');

                const users = await usersRes.json();

                // 2. Buscar usuario por nombre
                let user = users.find(u => u.name === username);

                // 3. Si no existe, lo creamos
                if (!user) {
                    // Error específico: El usuario no existe en la base de datos
                    throw new Error('EL_USUARIO_NO_EXISTE');
                }

                // 4. Guardar datos en el registry
                const deleteRes = await fetch(`/api/users/${user.id}`, {
                    method: 'DELETE'
                });

                if (!deleteRes.ok) throw new Error('Error al eliminar el usuario');

                // 5. Éxito: Feedback visual y limpiar input
                console.log(`Usuario ${username} eliminado`);
                el.value = ''; // Limpiar el input
                errorText.setText(`Usuario "${username}" eliminado correctamente`);
                errorText.setColor('#00ff00ff');
                errorText.setVisible(true);

            } catch (error) {
                console.error(error);

                console.error(error);
        
                // 6. Diferenciar entre "No existe" y "Error de servidor"
                let mensajeError = 'Error inesperado en el servidor';
        
                if (error.message === 'EL_USUARIO_NO_EXISTE') {
                 errorText.setText(`El usuario "${username}" no existe`);
                } else {
                    errorText.setText('Error inesperado en el servidor');
                }
                errorText.setColor('#ff0000ff');
                errorText.setVisible(true);

               
            }
        });

        //Botón para volver al menú
        const backBtnSprite = this.add.image(center, 500, 'boton')
            .setInteractive({ useHandCursor: true });
        const backButtonText = this.add.text(center, 500, 'Play as guest', {
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
            this.registry.set('userId',0)
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

}