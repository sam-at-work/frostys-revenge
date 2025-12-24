/**
 * Player Character - Snowman
 * Frosty's Revenge
 */

import { Actor, Vector, Color, CollisionType, Engine, Keys } from "excalibur";
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
      if (this.bananaTimer <= 0) {
        this.deactivateBanana();
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
  }

  private deactivateBanana(): void {
    this.isBanana = false;
    this.isInvincible = false;
    this.color = Color.fromHex(Config.COLORS.SNOWMAN);
  }

  public takeDamage(): void {
    if (this.isInvincible) {
      return;
    }

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
