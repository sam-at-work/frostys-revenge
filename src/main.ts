/**
 * Frosty's Revenge - Main Entry Point
 * A Super Mario-inspired platformer using Excalibur.js
 */

import { Engine, DisplayMode, Color, Loader, Vector } from "excalibur";
import { Config } from "./config";
import { LevelScene } from "./scenes/level";
import { GameOverScene } from "./scenes/gameover";

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

    // Start with the level scene
    this.goToScene("level");
  }
}

// Create the game instance
const game = new Game();

// Create loader with all resources
const loader = new Loader();
// Resources object is currently empty (placeholder graphics being used)
// We'll add resources in Phase 7 when we add actual assets

// Hide loading text and start the game
game.start(loader).then(() => {
  const loadingElement = document.getElementById("loading");
  if (loadingElement) {
    loadingElement.style.display = "none";
  }
  game.initialize();
});
