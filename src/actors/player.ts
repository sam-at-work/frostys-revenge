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
} from "excalibur";
import { Config } from "../config";
import { Snowball } from "./snowball";
import { Elf } from "./elf";
import { Decoration } from "./decoration";

export class Player extends Actor {
  private lives: number = Config.PLAYER.MAX_LIVES;
  private isInvincible: boolean = false;
  private isBanana: boolean = false;
  private bananaTimer: number = 0;
  private snowballCooldown: number = 0;
  private facingDirection: number = 1; // 1 = right, -1 = left
  private isOnGround: boolean = false;
  private flashTimer: number = 0;
  private invincibilityEmitter?: ParticleEmitter;
  private damageFlashTimer: number = 0;
  private isDamageFlashing: boolean = false;

  constructor(pos: Vector) {
    super({
      pos: pos,
      width: Config.PLAYER.WIDTH,
      height: Config.PLAYER.HEIGHT,
      color: Color.fromHex(Config.COLORS.SNOWMAN),
      collisionType: CollisionType.Active,
    });
  }

  public onInitialize(_engine: Engine): void {
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
        // Check if player is jumping on the elf (player is above elf)
        else if (this.pos.y < other.pos.y && this.vel.y > 0) {
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

    // Handle movement input
    this.handleMovement(engine);

    // Handle jumping
    this.handleJumping(engine);

    // Handle shooting
    this.handleShooting(engine);

    // Update camera to follow player
    engine.currentScene.camera.pos = new Vector(
      Math.max(
        Config.GAME_WIDTH / 2,
        Math.min(this.pos.x, Config.LEVEL.LENGTH - Config.GAME_WIDTH / 2),
      ),
      Config.GAME_HEIGHT / 2,
    );

    // Check if player fell off the world
    // Only trigger if player is actually falling (positive Y velocity)
    if (this.pos.y > Config.GAME_HEIGHT + 100 && this.vel.y > 0) {
      this.die();
    }
  }

  private handleMovement(engine: Engine): void {
    const keyboard = engine.input.keyboard;
    let velocityX = 0;

    // Left movement (Arrow Left or A)
    if (keyboard.isHeld(Keys.Left) || keyboard.isHeld(Keys.A)) {
      velocityX = -Config.PLAYER.MOVE_SPEED;
      this.facingDirection = -1;
    }

    // Right movement (Arrow Right or D)
    if (keyboard.isHeld(Keys.Right) || keyboard.isHeld(Keys.D)) {
      velocityX = Config.PLAYER.MOVE_SPEED;
      this.facingDirection = 1;
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
    }
  }

  private handleShooting(engine: Engine): void {
    const keyboard = engine.input.keyboard;

    // Shoot snowball (Spacebar)
    if (keyboard.wasPressed(Keys.Space) && this.snowballCooldown <= 0) {
      this.shootSnowball(engine);
      this.snowballCooldown = Config.PLAYER.SNOWBALL_COOLDOWN;
    }
  }

  private shootSnowball(engine: Engine): void {
    // Create snowball slightly in front of the player
    const offsetX =
      (Config.PLAYER.WIDTH / 2 + Config.SNOWBALL.WIDTH / 2 + 5) *
      this.facingDirection;
    const snowballPos = new Vector(this.pos.x + offsetX, this.pos.y);

    const snowball = new Snowball(snowballPos, this.facingDirection);
    engine.currentScene.add(snowball);
  }

  public activateBanana(): void {
    this.isBanana = true;
    this.isInvincible = true;
    this.bananaTimer = Config.BANANA.DURATION;
    this.color = Color.fromHex(Config.COLORS.BANANA);

    // Create particle effect for invincibility
    this.createInvincibilityEffect();
  }

  private deactivateBanana(): void {
    this.isBanana = false;
    this.isInvincible = false;
    this.color = Color.fromHex(Config.COLORS.SNOWMAN);
    this.graphics.opacity = 1; // Reset opacity

    // Stop invincibility particle effect
    if (this.invincibilityEmitter) {
      this.invincibilityEmitter.isEmitting = false;
      setTimeout(() => this.invincibilityEmitter?.kill(), 500);
      this.invincibilityEmitter = undefined;
    }
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
    if (this.isInvincible) {
      return;
    }

    // Flash red briefly before dying
    this.isDamageFlashing = true;
    this.damageFlashTimer = 200; // 200ms red flash

    this.die();
  }

  private die(): void {
    this.lives--;

    if (this.lives <= 0) {
      // Game over
      this.scene?.engine.goToScene("gameover");
    } else {
      // Respawn at start
      this.pos = new Vector(100, Config.GAME_HEIGHT / 2);
      this.vel = Vector.Zero;
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
