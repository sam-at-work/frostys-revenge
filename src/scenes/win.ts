/**
 * Win Scene
 * Frosty's Revenge
 */

import { Scene, Color, Label, Vector, Font, FontUnit, Input } from "excalibur";
import { Config } from "../config";

export class WinScene extends Scene {
  public onInitialize() {
    // Set background color
    this.backgroundColor = Color.fromHex("#1a4d2e"); // Dark green for Christmas

    // Create win text
    const winText = new Label({
      text: "YOU WIN!",
      pos: new Vector(Config.GAME_WIDTH / 2, Config.GAME_HEIGHT / 2 - 80),
      font: new Font({
        family: "Arial",
        size: 56,
        unit: FontUnit.Px,
        color: Color.fromHex("#FFD700"), // Gold
      }),
    });
    this.add(winText);

    // Create congratulations text
    const congratsText = new Label({
      text: "You got past Santa!",
      pos: new Vector(Config.GAME_WIDTH / 2, Config.GAME_HEIGHT / 2 - 20),
      font: new Font({
        family: "Arial",
        size: 28,
        unit: FontUnit.Px,
        color: Color.White,
      }),
    });
    this.add(congratsText);

    // Create restart instruction text
    const restartText = new Label({
      text: "Press SPACE to play again",
      pos: new Vector(Config.GAME_WIDTH / 2, Config.GAME_HEIGHT / 2 + 60),
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
    // Listen for space key to restart
    this.engine.input.keyboard.on("press", (evt) => {
      if (evt.key === Input.Keys.Space) {
        this.engine.goToScene("level");
      }
    });
  }
}
