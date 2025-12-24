/**
 * Player Character - Snowman
 * Frosty's Revenge
 */

import { Actor, Vector, Color, CollisionType, Engine, Keys } from "excalibur";
import { Config } from "../config";
import { Snowball } from "./snowball";

export class Player extends Actor {
  private lives: number = Config.PLAYER.MAX_LIVES;
  private isInvincible: boolean = false;
  private isBanana: boolean = false;
  private bananaTimer: number = 0;
  private snowballCooldown: number = 0;
  private facingDirection: number = 1; // 1 = right, -1 = left

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
  }

  public onPreUpdate(engine: Engine, delta: number): void {
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
    // Check if player is on ground by seeing if vertical velocity is small
    // This means they're resting on something or falling very slowly
    const isOnGround = Math.abs(this.vel.y) < 50;

    if (
      (keyboard.wasPressed(Keys.Up) || keyboard.wasPressed(Keys.W)) &&
      isOnGround
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
}
