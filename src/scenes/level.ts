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
  Engine,
} from "excalibur";
import { Config } from "../config";
import { Player } from "../actors/player";
import { SnowEmitter } from "../effects/snow";

export class LevelScene extends Scene {
  private player!: Player;
  private livesLabel!: Label;
  private snowEmitter!: SnowEmitter;

  public onInitialize() {
    // Set background color
    this.backgroundColor = Color.fromHex(Config.COLORS.SKY);

    // Create level platforms
    this.createLevel();

    // Create decorative elements
    this.createDecorations();

    // Create player
    this.createPlayer();

    // Create UI
    this.createUI();

    // Initialize snow effect
    this.snowEmitter = new SnowEmitter();
  }

  public onActivate() {
    // Reset player when scene activates
    if (this.player) {
      this.player.kill();
    }
    this.createPlayer();
  }

  private createLevel() {
    // Main ground - spans most of the level with some gaps
    this.createPlatform(0, Config.GAME_HEIGHT - 32, 800, 64);

    // Gap 1
    this.createPlatform(1000, Config.GAME_HEIGHT - 32, 800, 64);

    // Gap 2
    this.createPlatform(2000, Config.GAME_HEIGHT - 32, 1200, 64);

    // Gap 3
    this.createPlatform(3400, Config.GAME_HEIGHT - 32, 1600, 64);

    // Elevated platforms - for jumping variety
    this.createPlatform(600, Config.GAME_HEIGHT - 180, 200, 32);
    this.createPlatform(900, Config.GAME_HEIGHT - 250, 150, 32);

    this.createPlatform(1400, Config.GAME_HEIGHT - 200, 250, 32);
    this.createPlatform(1750, Config.GAME_HEIGHT - 280, 180, 32);

    this.createPlatform(2400, Config.GAME_HEIGHT - 220, 200, 32);
    this.createPlatform(2700, Config.GAME_HEIGHT - 300, 150, 32);

    this.createPlatform(3200, Config.GAME_HEIGHT - 180, 180, 32);

    // Higher platforms for extra challenge
    this.createPlatform(1200, Config.GAME_HEIGHT - 350, 120, 32);
    this.createPlatform(2900, Config.GAME_HEIGHT - 400, 150, 32);

    // Steps near the end
    this.createPlatform(4200, Config.GAME_HEIGHT - 120, 150, 32);
    this.createPlatform(4400, Config.GAME_HEIGHT - 180, 150, 32);
    this.createPlatform(4600, Config.GAME_HEIGHT - 240, 300, 32);

    // Boss area platform at the end
    this.createPlatform(4800, Config.GAME_HEIGHT - 32, 200, 64);
  }

  private createPlatform(x: number, y: number, width: number, height: number) {
    const platform = new Actor({
      pos: new Vector(x + width / 2, y + height / 2),
      width: width,
      height: height,
      color: Color.fromHex(Config.COLORS.GROUND),
    });

    platform.body.collisionType = CollisionType.Fixed;
    this.add(platform);
  }

  private createDecorations() {
    // Pine trees in the background (darker green, no collision)
    const treeColor = Color.fromRGB(34, 139, 34, 0.6); // Semi-transparent green

    // Trees along the ground
    this.createPineTree(150, Config.GAME_HEIGHT - 96, treeColor);
    this.createPineTree(350, Config.GAME_HEIGHT - 96, treeColor);
    this.createPineTree(550, Config.GAME_HEIGHT - 96, treeColor);

    this.createPineTree(1100, Config.GAME_HEIGHT - 96, treeColor);
    this.createPineTree(1300, Config.GAME_HEIGHT - 96, treeColor);
    this.createPineTree(1600, Config.GAME_HEIGHT - 96, treeColor);

    this.createPineTree(2200, Config.GAME_HEIGHT - 96, treeColor);
    this.createPineTree(2500, Config.GAME_HEIGHT - 96, treeColor);
    this.createPineTree(2800, Config.GAME_HEIGHT - 96, treeColor);

    this.createPineTree(3500, Config.GAME_HEIGHT - 96, treeColor);
    this.createPineTree(3800, Config.GAME_HEIGHT - 96, treeColor);
    this.createPineTree(4100, Config.GAME_HEIGHT - 96, treeColor);

    // Background trees (higher up, smaller, more transparent)
    const bgTreeColor = Color.fromRGB(34, 139, 34, 0.3);
    this.createPineTree(250, Config.GAME_HEIGHT - 150, bgTreeColor, 0.7);
    this.createPineTree(700, Config.GAME_HEIGHT - 170, bgTreeColor, 0.7);
    this.createPineTree(1500, Config.GAME_HEIGHT - 160, bgTreeColor, 0.7);
    this.createPineTree(2300, Config.GAME_HEIGHT - 155, bgTreeColor, 0.7);
    this.createPineTree(3000, Config.GAME_HEIGHT - 165, bgTreeColor, 0.7);
    this.createPineTree(3700, Config.GAME_HEIGHT - 150, bgTreeColor, 0.7);
  }

  private createPineTree(
    x: number,
    y: number,
    color: Color,
    scale: number = 1,
  ) {
    const treeHeight = 60 * scale;
    const treeWidth = 40 * scale;

    // Tree trunk (brown rectangle)
    const trunk = new Actor({
      pos: new Vector(x, y + treeHeight / 2),
      width: 8 * scale,
      height: 20 * scale,
      color: Color.fromRGB(101, 67, 33, color.a),
      z: -10, // Behind everything
    });
    trunk.body.collisionType = CollisionType.PreventCollision;
    this.add(trunk);

    // Tree foliage (green triangles represented as diamonds for now)
    // Bottom layer
    const foliage1 = new Actor({
      pos: new Vector(x, y + 10 * scale),
      width: treeWidth,
      height: 30 * scale,
      color: color,
      z: -10,
    });
    foliage1.body.collisionType = CollisionType.PreventCollision;
    this.add(foliage1);

    // Middle layer
    const foliage2 = new Actor({
      pos: new Vector(x, y - 10 * scale),
      width: treeWidth * 0.7,
      height: 25 * scale,
      color: color,
      z: -10,
    });
    foliage2.body.collisionType = CollisionType.PreventCollision;
    this.add(foliage2);

    // Top layer
    const foliage3 = new Actor({
      pos: new Vector(x, y - 28 * scale),
      width: treeWidth * 0.4,
      height: 20 * scale,
      color: color,
      z: -10,
    });
    foliage3.body.collisionType = CollisionType.PreventCollision;
    this.add(foliage3);
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

  public onPreUpdate(engine: Engine, delta: number) {
    // Update lives display
    if (this.player && this.livesLabel) {
      this.livesLabel.text = `Lives: ${this.player.getLives()}`;

      // Keep UI fixed to camera
      this.livesLabel.pos = new Vector(
        this.camera.pos.x - Config.GAME_WIDTH / 2 + 10,
        this.camera.pos.y - Config.GAME_HEIGHT / 2 + 10,
      );
    }

    // Update snow effect
    if (this.snowEmitter) {
      this.snowEmitter.update(engine, delta, this.camera.pos.x);
    }
  }
}
