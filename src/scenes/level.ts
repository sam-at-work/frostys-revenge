/**
 * Level Scene - Main Gameplay
 * Frosty's Revenge
 */

import {
  Scene,
  Engine,
  Actor,
  Vector,
  Color,
  Label,
  Font,
  FontUnit,
  CollisionType,
  ImageSource,
} from "excalibur";
import { Config } from "../config";
import { Resources } from "../resources/resources";
import { Player } from "../actors/player";
import { Elf } from "../actors/elf";
import { Santa } from "../actors/santa";
import { SnowEmitter } from "../effects/snow";
import { BananaBlock } from "../powerups/bananablock";
import { TileType, createTile } from "../graphics/tiles";

export class LevelScene extends Scene {
  private player!: Player;
  private livesLabel!: Label;
  private powerUpLabel!: Label;
  private santaHealthLabel!: Label;
  private snowEmitter?: SnowEmitter;
  private santa!: Santa;
  private santaSpawned: boolean = false; // Track if Santa has been spawned
  private santaIsDying: boolean = false; // Track if Santa is dying
  private winZoneX: number = 5100; // X position to reach to win
  private isBossMusicPlaying: boolean = false;
  private bossProximityDistance: number = 800; // Distance from boss to trigger boss music
  private bossAreaStartX: number = 4300; // X position where boss area begins
  private maxCameraX: number = Config.GAME_WIDTH / 2; // Track max camera position for one-way scrolling
  public snowStarted: boolean = false; // Track if snow has started for boss area
  private justReset: boolean = false; // Flag to force camera reset on first frame

  public onInitialize() {
    // Create gradient sky background
    this.createSkyBackground();

    // Create mountain backgrounds
    this.createMountainBackgrounds();

    // Create level platforms
    this.createLevel();

    // Create decorative elements
    this.createDecorations();

    // Create enemies
    this.createEnemies();

    // Boss will be created when player enters boss area

    // Create power-ups
    this.createPowerUps();

    // Create player
    this.createPlayer();

    // Create UI
    this.createUI();

    // Snow will be initialized during boss fight
  }

  public onActivate() {
    // Stop all music including banana song
    Resources.BackgroundMusic.stop();
    Resources.BossMusic.stop();
    Resources.BananaSong.stop();

    // Clear all actors from the scene to prevent duplicates
    // Manually remove all actors since clear() doesn't work
    const actorsToRemove = [...this.actors];
    actorsToRemove.forEach((actor) => {
      this.remove(actor);
    });
    // Also clear the snow emitter if it exists
    if (this.snowEmitter) {
      this.snowEmitter = undefined;
    }

    // Reset boss music flag
    this.isBossMusicPlaying = false;

    // Reset max camera position
    this.maxCameraX = Config.GAME_WIDTH / 2;

    // Set flag to force camera reset on first frame
    this.justReset = true;

    // Reset snow flag
    this.snowStarted = false;

    // Reset santa spawn flag
    this.santaSpawned = false;
    this.santaIsDying = false;

    // Reinitialize the entire scene
    this.createSkyBackground();
    this.createMountainBackgrounds();
    this.createLevel();
    this.createDecorations();
    this.createEnemies();
    this.createPowerUps();
    this.createPlayer();
    this.createUI();

    // Reset camera to start position AFTER player is created
    // This ensures the player's first update doesn't override it
    this.camera.pos = new Vector(Config.GAME_WIDTH / 2, Config.GAME_HEIGHT / 2);

    // Snow will be initialized during boss fight

    // Configure and start background music
    Resources.BackgroundMusic.loop = true;
    Resources.BackgroundMusic.volume = 0.3;
    Resources.BackgroundMusic.play();

    // Configure boss music (don't play yet)
    Resources.BossMusic.loop = true;
    Resources.BossMusic.volume = 0.4;
  }

  public onDeactivate() {
    // Stop all music when leaving the scene
    Resources.BackgroundMusic.stop();
    Resources.BossMusic.stop();
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

  private createMountainBackgrounds() {
    // Create mountain background layers from the pixel art images
    // Mountains are positioned at the bottom of the canvas with transparent backgrounds
    // Using parallax scrolling - farther mountains (lower z) scroll slower

    const mountains = [
      {
        resource: Resources.Mountain3,
        z: -90,
        x: 500,
        parallax: 0.9,
        scale: 1.5,
      },
      {
        resource: Resources.Mountain3,
        z: -85,
        x: 1200,
        parallax: 0.95,
        scale: 1.0,
      },
      {
        resource: Resources.Mountain3,
        z: -80,
        x: 2000,
        parallax: 0.85,
        scale: 0.8,
      },
      {
        resource: Resources.Mountain3,
        z: -90,
        x: 2800,
        parallax: 0.9,
        scale: 1.2,
      },
      {
        resource: Resources.Mountain3,
        z: -85,
        x: 3600,
        parallax: 0.93,
        scale: 1.1,
      },
      {
        resource: Resources.Mountain3,
        z: -80,
        x: 4200,
        parallax: 0.88,
        scale: 0.9,
      },
      {
        resource: Resources.Mountain3,
        z: -90,
        x: 4800,
        parallax: 0.91,
        scale: 1.3,
      },
    ];

    mountains.forEach((mountain) => {
      const sprite = mountain.resource.toSprite();

      // Apply scale for variety
      sprite.scale = new Vector(mountain.scale, mountain.scale);

      const mountainActor = new Actor({
        pos: new Vector(mountain.x, Config.GAME_HEIGHT),
        z: mountain.z,
        coordPlane: "world" as any, // Ensure it uses world coordinates for parallax
      });

      // Set anchor to bottom-center so mountains align with bottom of canvas
      mountainActor.graphics.anchor = new Vector(0.5, 1);

      // Apply parallax effect - farther mountains move slower
      mountainActor.vel = new Vector(0, 0);
      mountainActor.body.collisionType = CollisionType.PreventCollision;

      // Set parallax scroll factor (lower value = slower scroll, appears farther away)
      (mountainActor as any).parallaxFactor = mountain.parallax;

      mountainActor.graphics.use(sprite);
      this.add(mountainActor);
    });
  }

  private createLevel() {
    // Main ground - continuous sections with small gaps
    // Player is ~100px tall, jump height ~200px
    // Elves are 64px tall - platforms must clear elf height (160px+ above ground)

    // Starting area - long safe ground (snow theme)
    this.createPlatform(
      0,
      Config.GAME_HEIGHT - 32,
      800,
      64,
      TileType.SNOW_PLATFORM,
    );

    // Small gap 1 - easily jumpable (100px) - stone theme
    this.createPlatform(
      900,
      Config.GAME_HEIGHT - 32,
      700,
      64,
      TileType.WINTER_STONE,
    );

    // Small gap 2 - easily jumpable (100px) - snow theme
    this.createPlatform(
      1700,
      Config.GAME_HEIGHT - 32,
      700,
      64,
      TileType.SNOW_PLATFORM,
    );

    // Small gap 3 - easily jumpable (100px) - ice theme
    this.createPlatform(2500, Config.GAME_HEIGHT - 32, 700, 64, TileType.ICE);

    // Small gap 4 - easily jumpable (100px) - stone theme
    this.createPlatform(
      3300,
      Config.GAME_HEIGHT - 32,
      900,
      64,
      TileType.WINTER_STONE,
    );

    // Boss area - wide platform (ice for final battle)
    this.createPlatform(4300, Config.GAME_HEIGHT - 32, 900, 64, TileType.ICE);

    // Elevated platforms - with stepping stones to reach them
    // All platforms at 170px+ above ground to clear elf height (64px) with margin

    // First elevated area - stairs to get up (ice platforms)
    this.createPlatform(350, Config.GAME_HEIGHT - 170, 150, 32, TileType.ICE); // Step 1 - safe clearance
    this.createPlatform(480, Config.GAME_HEIGHT - 250, 150, 32, TileType.ICE); // Step 2 - 80px above step 1
    this.createPlatform(610, Config.GAME_HEIGHT - 330, 200, 32, TileType.ICE); // Top platform - 80px above step 2

    // Second elevated area - after first gap (brick platforms)
    this.createPlatform(
      1100,
      Config.GAME_HEIGHT - 170,
      150,
      32,
      TileType.BRICK,
    ); // Step 1 - safe clearance
    this.createPlatform(
      1230,
      Config.GAME_HEIGHT - 250,
      200,
      32,
      TileType.BRICK,
    ); // Top platform - 80px above step 1

    // Third elevated area - mid level (stone platforms)
    this.createPlatform(
      1900,
      Config.GAME_HEIGHT - 170,
      150,
      32,
      TileType.WINTER_STONE,
    ); // Step 1 - safe clearance
    this.createPlatform(
      2030,
      Config.GAME_HEIGHT - 250,
      150,
      32,
      TileType.WINTER_STONE,
    ); // Step 2 - 80px above step 1
    this.createPlatform(
      2160,
      Config.GAME_HEIGHT - 330,
      200,
      32,
      TileType.WINTER_STONE,
    ); // Top platform - 80px above step 2

    // Fourth elevated area - later level (ice platforms)
    this.createPlatform(2700, Config.GAME_HEIGHT - 170, 150, 32, TileType.ICE); // Step 1 - safe clearance
    this.createPlatform(2830, Config.GAME_HEIGHT - 250, 200, 32, TileType.ICE); // Top platform - 80px above step 1

    // Fifth elevated area - near end (ice platforms for challenge)
    this.createPlatform(3500, Config.GAME_HEIGHT - 170, 150, 32, TileType.ICE); // Step 1 - safe clearance
    this.createPlatform(3630, Config.GAME_HEIGHT - 250, 150, 32, TileType.ICE); // Step 2 - 80px above step 1
    this.createPlatform(3760, Config.GAME_HEIGHT - 330, 200, 32, TileType.ICE); // Top platform - 80px above step 2
  }

  private createPlatform(
    x: number,
    y: number,
    width: number,
    height: number,
    tileType: TileType = TileType.SNOW_PLATFORM,
  ) {
    const tileSize = 32;
    const tilesWide = Math.ceil(width / tileSize);
    const tilesHigh = Math.ceil(height / tileSize);

    // Create individual tiles to fill the platform area
    for (let row = 0; row < tilesHigh; row++) {
      for (let col = 0; col < tilesWide; col++) {
        const tileX = x + col * tileSize;
        const tileY = y + row * tileSize;

        const tile = new Actor({
          pos: new Vector(tileX + tileSize / 2, tileY + tileSize / 2),
          width: tileSize,
          height: tileSize,
        });

        // Apply the tile graphic
        const tileGraphic = createTile(tileType, tileSize);
        tile.graphics.use(tileGraphic);

        tile.body.collisionType = CollisionType.Fixed;
        this.add(tile);
      }
    }
  }

  private createDecorations() {
    // Pine trees in the background (darker green, no collision)
    const treeColor = Color.fromRGB(34, 139, 34, 1.0); // Full opacity green

    // Trees along the ground - positioned on actual platforms
    // Platform 1 (x: 0-800)
    this.createPineTree(150, Config.GAME_HEIGHT - 32, treeColor, 1.5);
    this.createPineTree(400, Config.GAME_HEIGHT - 32, treeColor, 1.5);
    this.createPineTree(650, Config.GAME_HEIGHT - 32, treeColor, 1.5);

    // Platform 2 (x: 900-1600)
    this.createPineTree(1000, Config.GAME_HEIGHT - 32, treeColor, 1.5);
    this.createPineTree(1300, Config.GAME_HEIGHT - 32, treeColor, 1.5);

    // Platform 3 (x: 1700-2400)
    this.createPineTree(1850, Config.GAME_HEIGHT - 32, treeColor, 1.5);
    this.createPineTree(2150, Config.GAME_HEIGHT - 32, treeColor, 1.5);

    // Platform 4 (x: 2500-3200)
    this.createPineTree(2650, Config.GAME_HEIGHT - 32, treeColor, 1.5);
    this.createPineTree(2950, Config.GAME_HEIGHT - 32, treeColor, 1.5);

    // Platform 5 (x: 3300-4200)
    this.createPineTree(3500, Config.GAME_HEIGHT - 32, treeColor, 1.5);
    this.createPineTree(3900, Config.GAME_HEIGHT - 32, treeColor, 1.5);

    // Platform 6 / Boss area (x: 4300-5200)
    this.createPineTree(4500, Config.GAME_HEIGHT - 32, treeColor, 1.5);
    this.createPineTree(4900, Config.GAME_HEIGHT - 32, treeColor, 1.5);

    // Background trees (same size, full opacity) - also on ground platforms
    const bgTreeColor = Color.fromRGB(34, 139, 34, 1.0);
    this.createPineTree(250, Config.GAME_HEIGHT - 32, bgTreeColor, 1.5);
    this.createPineTree(700, Config.GAME_HEIGHT - 32, bgTreeColor, 1.5);
    this.createPineTree(1150, Config.GAME_HEIGHT - 32, bgTreeColor, 1.5);
    this.createPineTree(2000, Config.GAME_HEIGHT - 32, bgTreeColor, 1.5);
    this.createPineTree(2750, Config.GAME_HEIGHT - 32, bgTreeColor, 1.5);
    this.createPineTree(3700, Config.GAME_HEIGHT - 32, bgTreeColor, 1.5);
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
    // Position trunk so its bottom is at y (ground level)
    const trunkHeight = 20 * scale;
    const trunk = new Actor({
      pos: new Vector(x, y - trunkHeight / 2),
      width: 8 * scale,
      height: trunkHeight,
      color: Color.fromRGB(101, 67, 33, color.a),
      z: -10, // Behind everything
    });
    trunk.body.collisionType = CollisionType.PreventCollision;
    this.add(trunk);

    // Tree foliage (green triangles represented as diamonds for now)
    // Bottom layer - sits on top of trunk
    const foliage1 = new Actor({
      pos: new Vector(x, y - trunkHeight - 15 * scale),
      width: treeWidth,
      height: 30 * scale,
      color: color,
      z: -10,
    });
    foliage1.body.collisionType = CollisionType.PreventCollision;
    this.add(foliage1);

    // Middle layer
    const foliage2 = new Actor({
      pos: new Vector(x, y - trunkHeight - 35 * scale),
      width: treeWidth * 0.7,
      height: 25 * scale,
      color: color,
      z: -10,
    });
    foliage2.body.collisionType = CollisionType.PreventCollision;
    this.add(foliage2);

    // Top layer
    const foliage3 = new Actor({
      pos: new Vector(x, y - trunkHeight - 55 * scale),
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
    this.createElf(600, Config.GAME_HEIGHT - 96, 80); // Ground level - platforms now clear overhead
    this.createElf(690, Config.GAME_HEIGHT - 362, 80); // On top platform (610-810), patrol 610-770

    // After first gap
    this.createElf(1050, Config.GAME_HEIGHT - 96, 80); // Ground level
    this.createElf(1310, Config.GAME_HEIGHT - 282, 70); // On elevated platform (1230-1430), patrol 1240-1380

    // Mid section
    this.createElf(2000, Config.GAME_HEIGHT - 96, 80); // Ground level - platforms clear overhead
    this.createElf(2240, Config.GAME_HEIGHT - 362, 80); // On top platform (2160-2360), patrol 2160-2320

    // Later section
    this.createElf(2600, Config.GAME_HEIGHT - 96, 80); // Ground level
    this.createElf(2910, Config.GAME_HEIGHT - 282, 70); // On elevated platform (2830-3030), patrol 2840-2980

    // Near end
    this.createElf(3450, Config.GAME_HEIGHT - 96, 80); // Ground level - platforms clear overhead
    this.createElf(3840, Config.GAME_HEIGHT - 362, 80); // On top platform (3760-3960), patrol 3760-3920

    // Just before boss
    this.createElf(4100, Config.GAME_HEIGHT - 96, 80); // Safe patrol (4020-4180)
    this.createElf(4500, Config.GAME_HEIGHT - 96, 80); // Safe patrol (4420-4580)
  }

  private createElf(x: number, y: number, patrolDistance?: number) {
    const elf = new Elf(new Vector(x, y), patrolDistance);
    this.add(elf);
  }

  private createBoss() {
    // Place Santa at the end of the level on boss platform
    // Only spawn if not already spawned
    if (!this.santaSpawned) {
      this.santa = new Santa(new Vector(5100, Config.GAME_HEIGHT - 204));
      this.add(this.santa);
      this.santaSpawned = true;
    }
  }

  private createPowerUps() {
    // Place banana blocks throughout the level (like ? blocks in Mario)
    // Player is 100px tall - blocks need clearance (200px+ above ground minimum)
    // Positioned so player can walk under and jump to hit from below
    // MUST NOT overlap with any platforms

    // Early game - between first platform cluster (ends ~810) and gap
    this.createBananaBlock(850, Config.GAME_HEIGHT - 220);

    // Mid section - between second (ends ~1430) and third (starts ~1900) platform clusters
    this.createBananaBlock(1650, Config.GAME_HEIGHT - 220);

    // Near end - clear area before boss, no platform overlaps
    this.createBananaBlock(4150, Config.GAME_HEIGHT - 220);
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
        family: '"Jacquard 12", system-ui',
        size: 32,
        unit: FontUnit.Px,
        color: Color.White,
        shadow: {
          blur: 0,
          offset: new Vector(2, 2),
          color: Color.Black,
        },
      }),
    });

    // Make UI element stay in screen space (not world space)
    this.livesLabel.z = 100;
    this.add(this.livesLabel);

    // Power-up timer display
    this.powerUpLabel = new Label({
      text: "",
      pos: new Vector(10, 50),
      font: new Font({
        family: '"Jacquard 12", system-ui',
        size: 32,
        unit: FontUnit.Px,
        color: Color.fromHex(Config.COLORS.BANANA),
        shadow: {
          blur: 0,
          offset: new Vector(2, 2),
          color: Color.Black,
        },
      }),
    });
    this.powerUpLabel.z = 100;
    this.add(this.powerUpLabel);

    // Santa health bar label (hidden until boss fight starts)
    this.santaHealthLabel = new Label({
      text: "",
      pos: new Vector(Config.GAME_WIDTH / 2, 30),
      font: new Font({
        family: '"Jacquard 12", system-ui',
        size: 24,
        unit: FontUnit.Px,
        color: Color.White,
        shadow: {
          blur: 0,
          offset: new Vector(2, 2),
          color: Color.Black,
        },
      }),
    });
    this.santaHealthLabel.z = 100;
    this.add(this.santaHealthLabel);
  }

  public onPreUpdate(engine: Engine, delta: number) {
    // Force camera to start position on first frame after reset
    if (this.justReset) {
      this.camera.pos = new Vector(
        Config.GAME_WIDTH / 2,
        Config.GAME_HEIGHT / 2,
      );
      this.maxCameraX = Config.GAME_WIDTH / 2;
      this.justReset = false;
    }

    // Update parallax backgrounds
    const camera = this.camera;
    this.actors.forEach((actor) => {
      if ((actor as any).parallaxFactor !== undefined) {
        // Apply parallax by offsetting position based on camera position
        const parallaxOffset =
          (camera.pos.x - Config.GAME_WIDTH / 2) *
          (1 - (actor as any).parallaxFactor);
        actor.graphics.offset = new Vector(-parallaxOffset, 0);
      }
    });

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
        this.powerUpLabel.text = `Banana Mode: ${Math.ceil(timeLeft / 1000)}`;
      } else {
        this.powerUpLabel.text = "";
      }

      // Keep UI fixed to camera
      this.powerUpLabel.pos = new Vector(
        this.camera.pos.x - Config.GAME_WIDTH / 2 + 10,
        this.camera.pos.y - Config.GAME_HEIGHT / 2 + 40,
      );
    }

    // Update Santa health bar (show only during boss fight)
    if (this.player && this.santa && this.isBossMusicPlaying) {
      const currentHealth = this.santa.getHealth();
      const maxHealth = this.santa.getMaxHealth();

      // Show health bar text
      this.santaHealthLabel.text = `Santa: ${currentHealth}/${maxHealth}`;

      // Keep health label fixed to camera at top center
      this.santaHealthLabel.pos = new Vector(
        this.camera.pos.x,
        this.camera.pos.y - Config.GAME_HEIGHT / 2 + 30,
      );

      // Check if Santa is defeated
      if (this.santa.isDefeated() && !this.santa.isDeathAnimationComplete()) {
        // Play death animation, then go to win scene
        this.santaIsDying = true;
        this.santa.playDeathAnimation(() => {
          engine.goToScene("win");
        });
      }
    } else {
      // Hide health bar when not in boss fight
      this.santaHealthLabel.text = "";
    }

    // Update snow effect (only during boss fight)
    if (this.snowEmitter) {
      this.snowEmitter.update(engine, delta, this.camera.pos.x);
    }

    // Start snow and spawn Santa when player reaches boss area (past final pit)
    if (
      this.player &&
      this.player.pos.x >= this.bossAreaStartX &&
      !this.snowStarted
    ) {
      this.snowStarted = true;
      this.snowEmitter = new SnowEmitter();
      this.snowEmitter.initialize(engine);

      // Spawn Santa when entering boss area
      if (!this.santaSpawned) {
        this.createBoss();
      }
    }

    // Check proximity to boss for music switching
    // But don't switch music if banana song is playing
    if (this.player && this.santa && !Resources.BananaSong.isPlaying()) {
      const distanceToBoss = Math.abs(this.player.pos.x - this.santa.pos.x);

      // Switch to boss music when close to Santa
      if (
        distanceToBoss < this.bossProximityDistance &&
        !this.isBossMusicPlaying
      ) {
        Resources.BackgroundMusic.stop();
        Resources.BossMusic.play();
        this.isBossMusicPlaying = true;
      }
      // Switch back to normal music if moving away
      else if (
        distanceToBoss >= this.bossProximityDistance &&
        this.isBossMusicPlaying
      ) {
        Resources.BossMusic.stop();
        Resources.BackgroundMusic.play();
        this.isBossMusicPlaying = false;
      }
    }

    // Win condition is now handled by defeating Santa (checked in health bar update above)
  }

  public getPlayerRespawnPosition(): Vector {
    // If scene was just reset (game over), always respawn at level start
    if (this.justReset) {
      return new Vector(100, Config.GAME_HEIGHT / 2);
    }
    // If player is in boss area, respawn at start of boss area
    if (this.player && this.player.pos.x >= this.bossAreaStartX) {
      return new Vector(this.bossAreaStartX + 100, Config.GAME_HEIGHT / 2);
    }
    // Otherwise respawn at level start
    return new Vector(100, Config.GAME_HEIGHT / 2);
  }

  public getRespawnCameraX(): number {
    // If scene was just reset (game over), always use level start camera
    if (this.justReset) {
      return Config.GAME_WIDTH / 2;
    }
    // If player is in boss area, align camera left edge with boss area start
    if (this.player && this.player.pos.x >= this.bossAreaStartX) {
      return this.bossAreaStartX + Config.GAME_WIDTH / 2;
    }
    // Otherwise normal camera position
    return Config.GAME_WIDTH / 2;
  }
}
