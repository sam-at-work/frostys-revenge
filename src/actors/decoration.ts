/**
 * Christmas Decoration Projectile
 * Frosty's Revenge
 */

import { Actor, Vector, Color, CollisionType, Engine } from "excalibur";
import { Config } from "../config";

export class Decoration extends Actor {
  private lifetime: number = 0;
  private maxLifetime: number = 5000; // 5 seconds
  private arcVelocity: Vector;

  constructor(
    pos: Vector,
    direction: number,
    variation: number = 0,
    isLongThrow: boolean = false,
  ) {
    super({
      pos: pos,
      width: 24,
      height: 24,
      color: Color.fromHex(Config.COLORS.DECORATION),
      collisionType: CollisionType.Passive,
    });

    // Arc trajectory like Bowser's axes with variation for spread
    // Create parabolic patterns by varying horizontal and vertical velocity
    const baseHorizontalSpeed = Config.SANTA.DECORATION_SPEED;
    const baseVerticalSpeed = -250;

    // Variation creates spread: -2, -1, 0, 1, 2
    const spreadFactor = variation - 2;

    // Pattern: 2 normal throws, then 1 long throw (flatter arc to travel further)
    const speedMultiplier = isLongThrow ? 1.8 : 1.0;
    const verticalMultiplier = isLongThrow ? 0.5 : 1.0; // Flatter arc for long throws

    // Vary both horizontal and vertical velocities for parabolic spread
    const horizontalSpeed =
      (baseHorizontalSpeed + spreadFactor * 40) * speedMultiplier;
    const verticalSpeed =
      (baseVerticalSpeed + spreadFactor * 60) * verticalMultiplier;

    this.arcVelocity = new Vector(horizontalSpeed * direction, verticalSpeed);
  }

  public onInitialize(_engine: Engine): void {
    // Set initial velocity for parabolic arc
    this.vel = this.arcVelocity;

    // Disable built-in gravity, we'll apply it manually
    this.body.useGravity = false;

    // Add some rotation for sparkly effect
    this.angularVelocity = 3; // Radians per second
  }

  public onPreUpdate(_engine: Engine, delta: number): void {
    this.lifetime += delta;

    // Manually apply gravity for parabolic arc (in pixels per second)
    // Gravity constant from config (1200) divided by 60 fps = ~20 per frame
    this.vel.y += (Config.GRAVITY * delta) / 1000;

    // Sparkle effect - pulse the opacity
    const pulseSpeed = 0.005;
    this.graphics.opacity = 0.7 + Math.sin(this.lifetime * pulseSpeed) * 0.3;

    // Remove decoration after lifetime expires
    if (this.lifetime >= this.maxLifetime) {
      this.kill();
    }

    // Remove if off screen or below ground
    if (
      this.pos.x < -100 ||
      this.pos.x > Config.LEVEL.LENGTH + 100 ||
      this.pos.y > Config.GAME_HEIGHT + 100
    ) {
      this.kill();
    }
  }
}
