import Phaser from 'phaser';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { CreditsScene } from './scenes/CreditsScene.js';
import { ControlsScene } from './scenes/ControlsScene.js';
import { EndGameScene } from './scenes/EndGameScene.js';
import { StoryScene } from './scenes/StoryScene.js';
import { OptionsScene } from './scenes/OptionsScene.js';
import { ConnectionLostScene } from './scenes/ConnectionLostScene.js';
import { LoginScene } from './scenes/LoginScene.js'; 
const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  parent: 'game-container',
  dom: {
    createContainer: true
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1200 },
      debug: false
    }
  },
  scene: [LoginScene, MenuScene, GameScene, PauseScene, CreditsScene, ControlsScene, EndGameScene, StoryScene, OptionsScene, ConnectionLostScene],
  backgroundColor: '#1a2a2e',
}

const game = new Phaser.Game(config);