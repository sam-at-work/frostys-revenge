/**
 * Player Character - Snowman
 * Frosty's Revenge
 */

import {
  Actor,
  Vector,
  Color,
  CollisionType,
  Engine,
  Keys,
  ParticleEmitter,
  EmitterType,
  SpriteSheet,
  Animation,
  AnimationStrategy,
  range,
} from "excalibur";
import { Config } from "../config";
import { Resources } from "../resources/resources";
import { Snowball } from "./snowball";
import { Elf } from "./elf";
import { Decoration } from "./decoration";

export class Player extends Actor {
  private lives: number = Config.PLAYER.MAX_LIVES;
  private isInvincible: boolean = false;
  private isBanana: boolean = false;
  private bananaTimer: number = 0;
  private snowballCooldown: number = 0;
  private facingDirection: number = 1; // 1 = right, -1 = left (start facing right)
  private isOnGround: boolean = false;
  private flashTimer: number = 0;
  private invincibilityEmitter?: ParticleEmitter;
  private damageFlashTimer: number = 0;
  private isDamageFlashing: boolean = false;
  private isDying: boolean = false;
  private isRespawning: boolean = false;
  private idleSprite!: any;
  private bananaIdleSprite!: any;
  private walkAnim!: Animation;
  private bananaWalkAnim!: Animation;
  private bananaSongFading: boolean = false;

  constructor(pos: Vector) {
    super({
      pos: pos,
      width: Config.PLAYER.WIDTH,
      height: Config.PLAYER.HEIGHT,
      collisionType: CollisionType.Active,
    });
  }

  public onInitialize(_engine: Engine): void {
    // Create sprite sheet from the snowman image (7x6 grid, 96x142px sprites)
    // Image is 672x852, so 672/7 = 96px wide, 852/6 = 142px tall
    const snowmanSheet = SpriteSheet.fromImageSource({
      image: Resources.SnowmanSpriteSheet,
      grid: {
        rows: 6,
        columns: 7,
        spriteWidth: 96,
        spriteHeight: 142,
      },
    });

    // Create idle sprite (first sprite)
    this.idleSprite = snowmanSheet.getSprite(2, 2);

    // Create walking animation using all 40 sprites (5 full rows + 5 from last row)
    // Sprites are indexed 0-34 (5 rows * 7 cols) + 35-39 (5 from last row)
    const allSprites = [...range(0, 34), 35, 36, 37, 38, 39];
    this.walkAnim = Animation.fromSpriteSheet(
      snowmanSheet,
      allSprites,
      50, // 50ms per frame
    );
    this.walkAnim.strategy = AnimationStrategy.Loop;

    // Create banana sprite sheet (same dimensions as snowman)
    const bananaSheet = SpriteSheet.fromImageSource({
      image: Resources.BananaSpriteSheet,
      grid: {
        rows: 6,
        columns: 7,
        spriteWidth: 96,
        spriteHeight: 142,
      },
    });

    // Create banana idle sprite (first sprite)
    this.bananaIdleSprite = bananaSheet.getSprite(0, 0);
    this.bananaIdleSprite.scale = new Vector(0.88, 0.88);

    // Create banana walking animation
    this.bananaWalkAnim = Animation.fromSpriteSheet(
      bananaSheet,
      allSprites,
      50, // 50ms per frame
    );
    this.bananaWalkAnim.strategy = AnimationStrategy.Loop;
    this.bananaWalkAnim.scale = new Vector(0.88, 0.88);

    // Set initial sprite (facing right)
    this.graphics.use(this.idleSprite);
    this.graphics.flipHorizontal = true; // Snowman sprite faces left by default, flip to face right

    // Set anchor to slightly above bottom so feet are on the ground
    this.graphics.anchor = new Vector(0.5, 0.5);

    // Move sprite down to align with collision box (will be adjusted for banana mode)
    this.graphics.offset = new Vector(0, 0);

    // Enable gravity for the player
    this.body.useGravity = true;

    // Set up collision handling with enemies
    this.on("precollision", (evt) => {
      const other = evt.other;

      // Check collision with elves
      if (other instanceof Elf && !other.isDefeated()) {
        // If invincible (banana mode), defeat elves on any contact
        if (this.isInvincible) {
          other.defeat();
        }
        // Check if player is jumping on the elf (player bottom is above elf center)
        else if (
          this.pos.y + this.height / 2 < other.pos.y - other.height / 4 &&
          this.vel.y > 0
        ) {
          // Jump on head - defeat the elf
          other.defeat();
          // Bounce the player up a bit
          this.vel.y = -300;
        } else {
          // Side collision - player takes damage
          this.takeDamage();
        }
      }

      // Check collision with Santa's decorations
      if (other instanceof Decoration && !this.isInvincible) {
        // Decorations always damage the player (unless invincible)
        this.takeDamage();
        other.kill();
      }
    });
  }

  public onPreUpdate(engine: Engine, delta: number): void {
    // Adjust offset based on mode (banana needs to be higher)
    this.graphics.offset = this.isBanana ? new Vector(0, 0) : new Vector(0, 0);

    // Switch between idle and walking animation based on velocity
    if (this.vel.x !== 0) {
      // Walking
      const anim = this.isBanana ? this.bananaWalkAnim : this.walkAnim;
      this.graphics.use(anim);
    } else {
      // Idle
      const idle = this.isBanana ? this.bananaIdleSprite : this.idleSprite;
      this.graphics.use(idle);
    }

    // Simple ground detection: player is grounded if falling/stationary with small downward velocity
    // Must be moving down (or stationary) to prevent jump at peak of arc
    // Velocity check is strict: between 0 and 10 pixels/sec downward
    this.isOnGround = this.vel.y >= 0 && this.vel.y <= 10;

    // Update timers
    if (this.snowballCooldown > 0) {
      this.snowballCooldown -= delta;
    }

    if (this.isBanana) {
      this.bananaTimer -= delta;

      // Update flash effect for invincibility
      this.flashTimer += delta;
      const flashSpeed = 0.01;
      this.graphics.opacity =
        0.7 + Math.sin(this.flashTimer * flashSpeed) * 0.3;

      // Update particle emitter position
      if (this.invincibilityEmitter) {
        this.invincibilityEmitter.pos = this.pos.clone();
      }

      // Start fading banana song 2 seconds before mode ends
      if (this.bananaTimer <= 2000 && !this.bananaSongFading) {
        this.bananaSongFading = true;
        this.fadeBananaSong();
      }

      if (this.bananaTimer <= 0) {
        this.deactivateBanana();
      }
    }

    // Handle damage flash effect
    if (this.isDamageFlashing) {
      this.damageFlashTimer -= delta;
      this.color = Color.Red;

      if (this.damageFlashTimer <= 0) {
        this.isDamageFlashing = false;
        this.color = Color.fromHex(Config.COLORS.SNOWMAN);
      }
    }

    // Handle movement input (only if not dying)
    if (!this.isDying) {
      this.handleMovement(engine);

      // Handle jumping
      this.handleJumping(engine);

      // Handle shooting
      this.handleShooting(engine);
    }

    // Update camera to follow player (unless dying - camera scroll handles it)
    if (!this.isDying) {
      engine.currentScene.camera.pos = new Vector(
        Math.max(
          Config.GAME_WIDTH / 2,
          Math.min(this.pos.x, Config.LEVEL.LENGTH - Config.GAME_WIDTH / 2),
        ),
        Config.GAME_HEIGHT / 2,
      );
    }

    // Check if player fell off the world
    // Falling into pits bypasses invincibility - always causes death
    if (
      this.pos.y > Config.GAME_HEIGHT + 100 &&
      this.vel.y > 0 &&
      !this.isDying &&
      !this.isRespawning
    ) {
      // Force death regardless of invincibility
      this.fallDeath();
    }
  }

  private handleMovement(engine: Engine): void {
    const keyboard = engine.input.keyboard;
    let velocityX = 0;

    // Left movement (Arrow Left or A)
    if (keyboard.isHeld(Keys.Left) || keyboard.isHeld(Keys.A)) {
      velocityX = -Config.PLAYER.MOVE_SPEED;
      this.facingDirection = -1;
      // Snowman faces left by default, banana faces right by default
      this.graphics.flipHorizontal = this.isBanana ? true : false;
    }

    // Right movement (Arrow Right or D)
    if (keyboard.isHeld(Keys.Right) || keyboard.isHeld(Keys.D)) {
      velocityX = Config.PLAYER.MOVE_SPEED;
      this.facingDirection = 1;
      // Snowman needs flip to face right, banana doesn't
      this.graphics.flipHorizontal = this.isBanana ? false : true;
    }

    this.vel.x = velocityX;
  }

  private handleJumping(engine: Engine): void {
    const keyboard = engine.input.keyboard;

    // Jump (Arrow Up or W)
    if (
      (keyboard.wasPressed(Keys.Up) || keyboard.wasPressed(Keys.W)) &&
      this.isOnGround
    ) {
      this.vel.y = Config.PLAYER.JUMP_VELOCITY;
      // Play jump sound
      Resources.JumpSound.play(0.5);
    }
  }

  private handleShooting(engine: Engine): void {
    const keyboard = engine.input.keyboard;

    // Shoot snowball (Spacebar)
    if (keyboard.wasPressed(Keys.Space) && this.snowballCooldown <= 0) {
      this.shootSnowball(engine);
      this.snowballCooldown = Config.PLAYER.SNOWBALL_COOLDOWN;
      // Play snowball throw sound
      Resources.SnowballThrowSound.play(0.4);
    }
  }

  private shootSnowball(engine: Engine): void {
    // Create snowball slightly in front of the player
    const offsetX =
      (Config.PLAYER.WIDTH / 2 + Config.SNOWBALL.WIDTH / 2 + 5) *
      this.facingDirection;
    const offsetY = 10; // Shoot from mid-body level
    const snowballPos = new Vector(this.pos.x + offsetX, this.pos.y + offsetY);

    const snowball = new Snowball(snowballPos, this.facingDirection);
    engine.currentScene.add(snowball);
  }

  public activateBanana(): void {
    // Check if already in banana mode
    const wasAlreadyBanana = this.isBanana;

    if (wasAlreadyBanana) {
      // Already in banana mode - just add 10 seconds to timer
      this.bananaTimer += 10000;
      this.bananaSongFading = false; // Cancel any fading if we were near the end

      // Play power-up sound to acknowledge collection
      Resources.PowerUpSound.play(0.6);
    } else {
      // First time activating banana mode
      this.isBanana = true;
      this.isInvincible = true;
      this.bananaTimer = Config.BANANA.DURATION;
      this.bananaSongFading = false;

      // Switch to banana sprite (idle or walk will be set in onPreUpdate)
      this.graphics.use(this.bananaIdleSprite);

      // Preserve facing direction when switching sprites
      // Banana faces right by default, so flip if facing left
      this.graphics.flipHorizontal = this.facingDirection === -1;

      // Play power-up sound
      Resources.PowerUpSound.play(0.6);

      // Stop background and boss music while banana song plays
      Resources.BackgroundMusic.pause();
      Resources.BossMusic.pause();

      // Play Banana Song starting at 28 seconds
      Resources.BananaSong.seek(28);
      Resources.BananaSong.volume = 0.5;
      Resources.BananaSong.play();

      // Create particle effect for invincibility
      this.createInvincibilityEffect();
    }
  }

  private deactivateBanana(): void {
    this.isBanana = false;
    this.isInvincible = false;
    this.graphics.opacity = 1; // Reset opacity

    // Switch back to snowman sprite (idle or walk will be set in onPreUpdate)
    this.graphics.use(this.idleSprite);

    // Preserve facing direction when switching sprites
    // Snowman faces left by default, so flip if facing right
    this.graphics.flipHorizontal = this.facingDirection === 1;

    // Stop invincibility particle effect
    if (this.invincibilityEmitter) {
      this.invincibilityEmitter.isEmitting = false;
      setTimeout(() => this.invincibilityEmitter?.kill(), 500);
      this.invincibilityEmitter = undefined;
    }
  }

  private fadeBananaSong(): void {
    // Fade out over 2 seconds (matches the 2 second early fade time)
    const fadeSteps = 40;
    const fadeInterval = 50; // 50ms per step = 2 seconds total
    const volumeDecrement = Resources.BananaSong.volume / fadeSteps;

    let step = 0;
    const fadeTimer = setInterval(() => {
      step++;
      Resources.BananaSong.volume = Math.max(
        0,
        Resources.BananaSong.volume - volumeDecrement,
      );

      if (step >= fadeSteps) {
        clearInterval(fadeTimer);
        Resources.BananaSong.stop();
        Resources.BananaSong.volume = 0.5; // Reset for next time

        // Resume background or boss music after banana song ends
        // Check which music was playing before (assume background for now)
        if (
          Resources.BackgroundMusic.isPlaying() ||
          Resources.BossMusic.isPlaying()
        ) {
          // Already playing, do nothing
        } else {
          // Resume background music (scene will handle boss music switching)
          Resources.BackgroundMusic.play();
        }
      }
    }, fadeInterval);
  }

  private createInvincibilityEffect(): void {
    // Create sparkle particles around the player during invincibility
    this.invincibilityEmitter = new ParticleEmitter({
      pos: this.pos.clone(),
      width: this.width,
      height: this.height,
      emitterType: EmitterType.Circle,
      radius: 25,
      minVel: 20,
      maxVel: 50,
      minAngle: 0,
      maxAngle: Math.PI * 2,
      isEmitting: true,
      emitRate: 30,
      particleLife: 600,
      maxSize: 4,
      minSize: 2,
      beginColor: Color.fromHex("#FFD700"), // Gold
      endColor: Color.Transparent,
    });

    this.scene?.add(this.invincibilityEmitter);
  }

  public takeDamage(): void {
    if (this.isInvincible || this.isDying || this.isRespawning) {
      return;
    }

    // Play hurt sound
    Resources.PlayerHurtSound.play(0.5);

    this.lives--;

    if (this.lives <= 0) {
      // Game over
      this.scene?.engine.goToScene("gameover");
    } else {
      // Trigger respawn
      this.die();
    }
  }

  private fallDeath(): void {
    // Special death handler for falling into pits - bypasses invincibility
    if (this.isDying || this.isRespawning) {
      return;
    }

    // Play hurt sound
    Resources.PlayerHurtSound.play(0.5);

    this.lives--;

    if (this.lives <= 0) {
      // Game over
      this.scene?.engine.goToScene("gameover");
    } else {
      // Trigger respawn
      this.die();
    }
  }

  private die(): void {
    this.isDying = true;
    this.isRespawning = true;

    // Make player invisible during death animation
    this.graphics.visible = false;

    // Always deactivate banana mode on death
    if (this.isBanana) {
      this.deactivateBanana();

      // Stop banana song immediately
      Resources.BananaSong.stop();
      Resources.BananaSong.volume = 0.5; // Reset for next time
    }

    // Pause player movement during respawn
    this.vel = Vector.Zero;
    const engine = this.scene?.engine;

    if (engine) {
      // Scroll camera back to start (duration in milliseconds)
      const scrollDuration = 1500;
      const startCameraX = Config.GAME_WIDTH / 2;
      const currentCameraX = engine.currentScene.camera.pos.x;
      const startTime = Date.now();

      // Animate camera scroll
      const scrollInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / scrollDuration, 1);

        // Ease-out animation
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        // Interpolate camera position
        const newCameraX =
          currentCameraX + (startCameraX - currentCameraX) * easeProgress;
        engine.currentScene.camera.pos = new Vector(
          newCameraX,
          Config.GAME_HEIGHT / 2,
        );

        if (progress >= 1) {
          clearInterval(scrollInterval);

          // Respawn player at start after scroll completes
          this.pos = new Vector(100, Config.GAME_HEIGHT / 2);
          this.vel = Vector.Zero;
          this.isDying = false;
          this.isRespawning = false;
          this.graphics.visible = true; // Make player visible again

          // Resume appropriate music
          if (
            !Resources.BackgroundMusic.isPlaying() &&
            !Resources.BossMusic.isPlaying()
          ) {
            Resources.BackgroundMusic.play();
          }
        }
      }, 16); // ~60 FPS
    } else {
      // Fallback if no engine
      this.pos = new Vector(100, Config.GAME_HEIGHT / 2);
      this.vel = Vector.Zero;
      this.isDying = false;
      this.isRespawning = false;
      this.graphics.visible = true; // Make player visible again
    }
  }

  public getLives(): number {
    return this.lives;
  }

  public isInvincibleState(): boolean {
    return this.isInvincible;
  }

  public getBananaTimeLeft(): number {
    return this.bananaTimer;
  }
}
