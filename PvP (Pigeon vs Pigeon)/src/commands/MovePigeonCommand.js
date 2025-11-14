import {Command} from './Command';

export class MovePigeonCommand extends Command {

    constructor(pigeon, direction) {
        super();
        this.pigeon = pigeon;
        this.direction = direction; // 'up', 'down'
    }

    execute() {
        if (this.direction === 'up') {
            this.pigeon.sprite.setVelocityY(-this.pigeon.baseSpeed);
        } else if (this.direction === 'down') {
            this.pigeon.sprite.setVelocityY(this.pigeon.baseSpeed);
            } else {
                this.pigeon.sprite.setVelocityX(0);
            }
        }
    
}