/**
 * Level Scene - Main gameplay scene
 * Frosty's Revenge
 */

import {
  Scene,
  Color,
  Actor,
  Vector,
  Label,
  Font,
  FontUnit,
  CollisionType,
} from "excalibur";
import { Config } from "../config";
import { Player } from "../actors/player";

export class LevelScene extends Scene {
  private player!: Player;
  private livesLabel!: Label;

  public onInitialize() {
    // Set background color
    this.backgroundColor = Color.fromHex(Config.COLORS.SKY);

    // Create ground platform
    this.createGround();

    // Create player
    this.createPlayer();

    // Create UI
    this.createUI();
  }

  public onActivate() {
    // Reset player when scene activates
    if (this.player) {
      this.player.kill();
    }
    this.createPlayer();
  }

  private createGround() {
    const ground = new Actor({
      pos: new Vector(
        Config.LEVEL.LENGTH / 2,
        Config.GAME_HEIGHT - Config.LEVEL.GROUND_HEIGHT / 2,
      ),
      width: Config.LEVEL.LENGTH,
      height: Config.LEVEL.GROUND_HEIGHT,
      color: Color.fromHex(Config.COLORS.GROUND),
    });

    ground.body.collisionType = CollisionType.Fixed;
    this.add(ground);
  }

  private createPlayer() {
    const startPos = new Vector(100, Config.GAME_HEIGHT / 2);
    this.player = new Player(startPos);
    this.add(this.player);
  }

  private createUI() {
    // Lives display
    this.livesLabel = new Label({
      text: "Lives: 3",
      pos: new Vector(10, 10),
      font: new Font({
        family: "Arial",
        size: 20,
        unit: FontUnit.Px,
        color: Color.White,
      }),
    });

    // Make UI element stay in screen space (not world space)
    this.livesLabel.z = 100;
    this.add(this.livesLabel);
  }

  public onPreUpdate() {
    // Update lives display
    if (this.player && this.livesLabel) {
      this.livesLabel.text = `Lives: ${this.player.getLives()}`;

      // Keep UI fixed to camera
      this.livesLabel.pos = new Vector(
        this.camera.pos.x - Config.GAME_WIDTH / 2 + 10,
        this.camera.pos.y - Config.GAME_HEIGHT / 2 + 10,
      );
    }
  }
}
