import {Command} from './Command';

export class PauseCommand extends Command {

    constructor(gameScene, isPaused) {
        super();
        this.gameScene = gameScene;
        this.isPaused = isPaused;
    }

    execute() {
        this.gameScene.setPauseState(this.isPaused);
    }

}