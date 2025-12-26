/**
 * Game Over Scene
 * Frosty's Revenge
 */

import { Scene, Color, Label, Vector, Font, FontUnit, Input } from "excalibur";
import { Config } from "../config";

export class GameOverScene extends Scene {
  private keyHandler?: (evt: any) => void;

  public onInitialize() {
    // Set background color
    this.backgroundColor = Color.Black;

    // Create game over text
    const gameOverText = new Label({
      text: "GAME OVER",
      pos: new Vector(Config.GAME_WIDTH / 2, Config.GAME_HEIGHT / 2 - 50),
      font: new Font({
        family: "Arial",
        size: 48,
        unit: FontUnit.Px,
        color: Color.White,
      }),
    });
    this.add(gameOverText);

    // Create restart instruction text
    const restartText = new Label({
      text: "Press SPACE to restart",
      pos: new Vector(Config.GAME_WIDTH / 2, Config.GAME_HEIGHT / 2 + 50),
      font: new Font({
        family: "Arial",
        size: 24,
        unit: FontUnit.Px,
        color: Color.White,
      }),
    });
    this.add(restartText);
  }

  public onActivate() {
    // Remove old listener if it exists
    if (this.keyHandler) {
      this.engine.input.keyboard.off("press", this.keyHandler);
    }

    // Create new listener
    this.keyHandler = (evt) => {
      if (evt.key === Input.Keys.Space) {
        this.engine.goToScene("level");
      }
    };

    // Listen for space key to restart
    this.engine.input.keyboard.on("press", this.keyHandler);
  }

  public onDeactivate() {
    // Clean up listener when leaving scene
    if (this.keyHandler) {
      this.engine.input.keyboard.off("press", this.keyHandler);
      this.keyHandler = undefined;
    }
  }
}
