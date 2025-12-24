/**
 * Santa Boss
 * Frosty's Revenge
 */

import { Actor, Vector, Color, CollisionType, Engine } from "excalibur";
import { Config } from "../config";
import { Decoration } from "./decoration";

export class Santa extends Actor {
  private throwTimer: number = 0;
  private throwDirection: number = -1; // Throw to the left (toward player)
  private jumpTimer: number = 0;
  private jumpInterval: number = 3000; // Jump every 3 seconds
  private groundY: number;
  private isJumping: boolean = false;

  constructor(pos: Vector) {
    super({
      pos: pos,
      width: Config.SANTA.WIDTH,
      height: Config.SANTA.HEIGHT,
      color: Color.fromHex(Config.COLORS.SANTA),
      collisionType: CollisionType.Active,
    });

    this.groundY = pos.y;
  }

  public onInitialize(_engine: Engine): void {
    // Santa uses gravity for jumping
    this.body.useGravity = true;
  }

  public onPreUpdate(engine: Engine, delta: number): void {
    // Update throw timer
    this.throwTimer += delta;

    // Update jump timer
    this.jumpTimer += delta;

    // Check if landed back on ground
    if (
      this.isJumping &&
      Math.abs(this.vel.y) < 10 &&
      this.pos.y >= this.groundY - 5
    ) {
      this.isJumping = false;
      this.pos.y = this.groundY; // Snap to ground
      this.vel.y = 0;
    }

    // Jump periodically like Bowser
    if (this.jumpTimer >= this.jumpInterval && !this.isJumping) {
      this.jump();
      this.jumpTimer = 0;
    }

    // Throw decorations periodically
    if (this.throwTimer >= Config.SANTA.THROW_INTERVAL) {
      this.throwDecorations(engine);
      this.throwTimer = 0;
    }
  }

  private jump(): void {
    this.vel.y = -400; // Jump velocity
    this.isJumping = true;
  }

  private throwDecorations(engine: Engine): void {
    // Throw multiple decorations in a spread pattern like Bowser's axes
    const numDecorations = 5;
    const baseOffsetX = -40;
    const baseOffsetY = -10;

    for (let i = 0; i < numDecorations; i++) {
      // Stagger the throws slightly for a spread effect
      const decorationPos = new Vector(
        this.pos.x + baseOffsetX,
        this.pos.y + baseOffsetY,
      );

      // Vary the initial velocities to create spread pattern
      const decoration = new Decoration(
        decorationPos,
        this.throwDirection,
        i, // Pass index for variation
      );
      engine.currentScene.add(decoration);
    }
  }

  public isInvulnerable(): boolean {
    // Santa cannot be defeated - player must get past him
    return true;
  }
}
