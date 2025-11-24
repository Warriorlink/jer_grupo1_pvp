import Phaser from 'phaser';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { CreditsScene } from './scenes/CreditsScene.js';
import { ControlsScene } from './scenes/ControlsScene.js';
import { EndGameScene } from './scenes/EndGameScene.js';

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scene: [MenuScene, GameScene, PauseScene, CreditsScene, ControlsScene, EndGameScene],
  backgroundColor: '#1a2a2e',
}

const game = new Phaser.Game(config);