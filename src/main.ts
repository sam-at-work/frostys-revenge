/**
 * Frosty's Revenge - Main Entry Point
 * A Super Mario-inspired platformer using Excalibur.js
 */

import { Engine, DisplayMode, Color, Vector } from "excalibur";
import { Config } from "./config";
import { LevelScene } from "./scenes/level";
import { GameOverScene } from "./scenes/gameover";
import { WinScene } from "./scenes/win";
import { IntroScene } from "./scenes/intro";
import { TaglineScene } from "./scenes/tagline";
import { Resources } from "./resources/resources";
import { CustomLoader } from "./loaders/CustomLoader";

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
      // Enable debug mode to show collision boxes
      configurePerformanceCanvas2DFallback: {
        allow: true,
      },
    });

    // Show debug information including collision boxes
    this.showDebug(false);
  }

  public initialize() {
    // Add scenes
    this.addScene("intro", new IntroScene());
    this.addScene("tagline", new TaglineScene());
    this.addScene("level", new LevelScene());
    this.addScene("gameover", new GameOverScene());
    this.addScene("win", new WinScene());

    // Start with the intro scene
    this.goToScene("intro");
  }
}

// Create the game instance
const game = new Game();

// Create custom loader with all resources
const loader = new CustomLoader();

// Add background images to loader
loader.addResource(Resources.Mountain1);
loader.addResource(Resources.Mountain2);
loader.addResource(Resources.Mountain3);

// Add sprite sheets to loader
loader.addResource(Resources.ElfSpriteSheet);
loader.addResource(Resources.SnowmanSpriteSheet);
loader.addResource(Resources.BananaSpriteSheet);
loader.addResource(Resources.SantaSpriteSheet);
loader.addResource(Resources.SantaDyingSpriteSheet);

// Add sound effects to loader
loader.addResource(Resources.JumpSound);
loader.addResource(Resources.SnowballThrowSound);
loader.addResource(Resources.SnowballHitSound);
loader.addResource(Resources.EnemyDefeatSound);
loader.addResource(Resources.PowerUpSound);
loader.addResource(Resources.PlayerHurtSound);
loader.addResource(Resources.BlockHitSound);
loader.addResource(Resources.RespawnSound);

// Add music to loader (currently using placeholder sounds)
loader.addResource(Resources.BackgroundMusic);
loader.addResource(Resources.BossMusic);
loader.addResource(Resources.BananaSong);

// Hide loading text and start the game
game.start(loader).then(() => {
  const loadingElement = document.getElementById("loading");
  if (loadingElement) {
    loadingElement.style.display = "none";
  }
  game.initialize();
});
