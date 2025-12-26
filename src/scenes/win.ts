/**
 * Win Scene
 * Frosty's Revenge
 */

import { Scene, Color, Label, Vector, Font, FontUnit, Input } from "excalibur";
import { Config } from "../config";
import { LevelScene } from "./level";

export class WinScene extends Scene {
  private keyHandler?: (evt: any) => void;

  public onInitialize() {
    // Set background color
    this.backgroundColor = Color.fromHex("#1a4d2e"); // Dark green for Christmas

    // Create win text
    const winText = new Label({
      text: "YOU WIN!",
      pos: new Vector(Config.GAME_WIDTH / 2, Config.GAME_HEIGHT / 2 - 80),
      font: new Font({
        family: '"Jacquard 12", system-ui',
        size: 72,
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
        family: '"Jacquard 12", system-ui',
        size: 36,
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
        family: '"Jacquard 12", system-ui',
        size: 32,
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
        // Remove the old level scene and create a new one to ensure clean restart
        const oldLevelScene = this.engine.scenes["level"];
        if (oldLevelScene) {
          this.engine.removeScene("level");
        }
        // Create a new level scene
        this.engine.addScene("level", new LevelScene());
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
