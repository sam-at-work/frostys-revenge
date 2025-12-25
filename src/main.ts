/**
 * Frosty's Revenge - Main Entry Point
 * A Super Mario-inspired platformer using Excalibur.js
 */

import { Engine, DisplayMode, Color, Loader, Vector } from "excalibur";
import { Config } from "./config";
import { LevelScene } from "./scenes/level";
import { GameOverScene } from "./scenes/gameover";
import { WinScene } from "./scenes/win";
import { Resources } from "./resources/resources";

class Game extends Engine {
  constructor() {
    super({
      width: Config.GAME_WIDTH,
      height: Config.GAME_HEIGHT,
      displayMode: DisplayMode.FitScreen,
      backgroundColor: Color.fromHex(Config.COLORS.SKY),
      pixelArt: true,
      fixedUpdateFps: 60,
      physics: {
        gravity: new Vector(0, Config.GRAVITY),
      },
    });
  }

  public initialize() {
    // Add scenes
    this.addScene("level", new LevelScene());
    this.addScene("gameover", new GameOverScene());
    this.addScene("win", new WinScene());

    // Start with the level scene
    this.goToScene("level");
  }
}

// Create the game instance
const game = new Game();

// Create loader with all resources
const loader = new Loader();
// Add elf sprite sheet to loader
loader.addResource(Resources.ElfSpriteSheet);

// Hide loading text and start the game
game.start(loader).then(() => {
  const loadingElement = document.getElementById("loading");
  if (loadingElement) {
    loadingElement.style.display = "none";
  }
  game.initialize();
});
