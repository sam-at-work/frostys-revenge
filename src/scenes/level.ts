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
import { Elf } from "../actors/elf";
import { Santa } from "../actors/santa";
import { SnowEmitter } from "../effects/snow";
import { BananaBlock } from "../powerups/bananablock";

export class LevelScene extends Scene {
  private player!: Player;
  private livesLabel!: Label;
  private powerUpLabel!: Label;
  private snowEmitter!: SnowEmitter;
  private santa!: Santa;
  private winZoneX: number = 5100; // X position to reach to win

  public onInitialize() {
    // Create gradient sky background
    this.createSkyBackground();

    // Create level platforms
    this.createLevel();

    // Create decorative elements
    this.createDecorations();

    // Create enemies
    this.createEnemies();

    // Create boss
    this.createBoss();

    // Create power-ups
    this.createPowerUps();

    // Create player
    this.createPlayer();

    // Create UI
    this.createUI();

    // Initialize snow effect
    this.snowEmitter = new SnowEmitter();
  }

  public onActivate() {
    // Recreate player when scene activates (handles restart after game over)
    if (this.player) {
      this.player.kill();
    }
    this.createPlayer();
  }

  private createSkyBackground() {
    // Create a gradient sky effect with multiple colored rectangles
    const skyHeight = Config.GAME_HEIGHT;
    const numLayers = 5;

    for (let i = 0; i < numLayers; i++) {
      const layerHeight = skyHeight / numLayers;
      const y = i * layerHeight;

      // Gradient from light blue at top to darker blue at bottom
      const blueValue = 135 + i * 30; // 135 to 255
      const greenValue = 206 - i * 20; // 206 to 126

      const skyLayer = new Actor({
        pos: new Vector(Config.LEVEL.LENGTH / 2, y + layerHeight / 2),
        width: Config.LEVEL.LENGTH,
        height: layerHeight,
        color: Color.fromRGB(135, greenValue, blueValue),
        z: -100,
      });
      skyLayer.body.collisionType = CollisionType.PreventCollision;
      this.add(skyLayer);
    }
  }

  private createLevel() {
    // Main ground - continuous sections with small gaps
    // Player is ~100px tall, jump height ~200px

    // Starting area - long safe ground
    this.createPlatform(0, Config.GAME_HEIGHT - 32, 800, 64);

    // Small gap 1 - easily jumpable (100px)
    this.createPlatform(900, Config.GAME_HEIGHT - 32, 700, 64);

    // Small gap 2 - easily jumpable (100px)
    this.createPlatform(1700, Config.GAME_HEIGHT - 32, 700, 64);

    // Small gap 3 - easily jumpable (100px)
    this.createPlatform(2500, Config.GAME_HEIGHT - 32, 700, 64);

    // Small gap 4 - easily jumpable (100px)
    this.createPlatform(3300, Config.GAME_HEIGHT - 32, 900, 64);

    // Boss area - wide platform
    this.createPlatform(4300, Config.GAME_HEIGHT - 32, 900, 64);

    // Elevated platforms - with stepping stones to reach them
    // First elevated area - stairs to get up
    this.createPlatform(350, Config.GAME_HEIGHT - 100, 150, 32); // Step 1
    this.createPlatform(480, Config.GAME_HEIGHT - 170, 150, 32); // Step 2
    this.createPlatform(610, Config.GAME_HEIGHT - 240, 200, 32); // Top platform

    // Second elevated area - after first gap
    this.createPlatform(1100, Config.GAME_HEIGHT - 100, 150, 32); // Step 1
    this.createPlatform(1230, Config.GAME_HEIGHT - 170, 200, 32); // Top platform

    // Third elevated area - mid level
    this.createPlatform(1900, Config.GAME_HEIGHT - 100, 150, 32); // Step 1
    this.createPlatform(2030, Config.GAME_HEIGHT - 170, 150, 32); // Step 2
    this.createPlatform(2160, Config.GAME_HEIGHT - 240, 200, 32); // Top platform

    // Fourth elevated area - later level
    this.createPlatform(2700, Config.GAME_HEIGHT - 100, 150, 32); // Step 1
    this.createPlatform(2830, Config.GAME_HEIGHT - 170, 200, 32); // Top platform

    // Fifth elevated area - near end
    this.createPlatform(3500, Config.GAME_HEIGHT - 100, 150, 32); // Step 1
    this.createPlatform(3630, Config.GAME_HEIGHT - 170, 150, 32); // Step 2
    this.createPlatform(3760, Config.GAME_HEIGHT - 240, 200, 32); // Top platform
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

  private createEnemies() {
    // Early section - on ground and platforms
    this.createElf(500, Config.GAME_HEIGHT - 96);
    this.createElf(650, Config.GAME_HEIGHT - 272, 80); // On top platform

    // After first gap
    this.createElf(1000, Config.GAME_HEIGHT - 96);
    this.createElf(1280, Config.GAME_HEIGHT - 202, 80); // On elevated platform

    // Mid section
    this.createElf(1900, Config.GAME_HEIGHT - 96);
    this.createElf(2200, Config.GAME_HEIGHT - 272, 80); // On top platform

    // Later section
    this.createElf(2700, Config.GAME_HEIGHT - 96);
    this.createElf(2880, Config.GAME_HEIGHT - 202, 80); // On elevated platform

    // Near end
    this.createElf(3600, Config.GAME_HEIGHT - 96);
    this.createElf(3800, Config.GAME_HEIGHT - 272, 80); // On top platform

    // Just before boss
    this.createElf(4100, Config.GAME_HEIGHT - 96);
    this.createElf(4500, Config.GAME_HEIGHT - 96);
  }

  private createElf(x: number, y: number, patrolDistance?: number) {
    const elf = new Elf(new Vector(x, y), patrolDistance);
    this.add(elf);
  }

  private createBoss() {
    // Place Santa at the end of the level on boss platform
    this.santa = new Santa(new Vector(4700, Config.GAME_HEIGHT - 204));
    this.add(this.santa);
  }

  private createPowerUps() {
    // Place banana blocks throughout the level (like ? blocks in Mario)
    // Early game - floating above ground
    this.createBananaBlock(250, Config.GAME_HEIGHT - 200);

    // On first elevated platform area
    this.createBananaBlock(550, Config.GAME_HEIGHT - 300);

    // Mid section
    this.createBananaBlock(1500, Config.GAME_HEIGHT - 200);

    // On elevated platform
    this.createBananaBlock(2100, Config.GAME_HEIGHT - 300);

    // Later section
    this.createBananaBlock(3000, Config.GAME_HEIGHT - 200);

    // Near end - before boss
    this.createBananaBlock(4000, Config.GAME_HEIGHT - 200);
  }

  private createBananaBlock(x: number, y: number) {
    const block = new BananaBlock(new Vector(x, y));
    this.add(block);
  }

  private createPlayer() {
    // Start at beginning of level
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

    // Power-up timer display
    this.powerUpLabel = new Label({
      text: "",
      pos: new Vector(10, 40),
      font: new Font({
        family: "Arial",
        size: 18,
        unit: FontUnit.Px,
        color: Color.fromHex(Config.COLORS.BANANA),
      }),
    });
    this.powerUpLabel.z = 100;
    this.add(this.powerUpLabel);
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

    // Update power-up timer display
    if (this.player && this.powerUpLabel) {
      if (this.player.isInvincibleState()) {
        const timeLeft = this.player.getBananaTimeLeft();
        this.powerUpLabel.text = `BANANA MODE: ${Math.ceil(timeLeft / 1000)}s`;
      } else {
        this.powerUpLabel.text = "";
      }

      // Keep UI fixed to camera
      this.powerUpLabel.pos = new Vector(
        this.camera.pos.x - Config.GAME_WIDTH / 2 + 10,
        this.camera.pos.y - Config.GAME_HEIGHT / 2 + 40,
      );
    }

    // Update snow effect
    if (this.snowEmitter) {
      this.snowEmitter.update(engine, delta, this.camera.pos.x);
    }

    // Check win condition
    if (this.player && this.player.pos.x >= this.winZoneX) {
      engine.goToScene("win");
    }
  }
}
