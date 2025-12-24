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

  constructor(pos: Vector, direction: number) {
    super({
      pos: pos,
      width: 24,
      height: 24,
      color: Color.fromHex(Config.COLORS.DECORATION),
      collisionType: CollisionType.Passive,
    });

    // Arc trajectory like Bowser's axes
    // Throw upward and in the direction
    this.arcVelocity = new Vector(
      Config.SANTA.DECORATION_SPEED * direction,
      -200, // Initial upward velocity
    );
  }

  public onInitialize(_engine: Engine): void {
    // Decorations use gravity for arc
    this.body.useGravity = true;
    this.vel = this.arcVelocity;

    // Add some rotation for sparkly effect
    this.angularVelocity = 3; // Radians per second
  }

  public onPreUpdate(_engine: Engine, delta: number): void {
    this.lifetime += delta;

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
