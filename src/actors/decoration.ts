/**
 * Christmas Decoration Projectile
 * Frosty's Revenge
 */

import {
  Actor,
  Vector,
  Color,
  CollisionType,
  Engine,
  ParticleEmitter,
  EmitterType,
} from "excalibur";
import { Config } from "../config";
import { Snowball } from "./snowball";

export class Decoration extends Actor {
  private lifetime: number = 0;
  private maxLifetime: number = 5000; // 5 seconds
  private arcVelocity: Vector;

  constructor(pos: Vector, direction: number, variation: number = 0) {
    super({
      pos: pos,
      width: 24,
      height: 24,
      color: Color.fromHex(Config.COLORS.DECORATION),
      collisionType: CollisionType.Active,
    });

    // Arc trajectory like Bowser's axes with variation for spread
    // Create parabolic patterns by varying horizontal and vertical velocity
    const baseHorizontalSpeed = Config.SANTA.DECORATION_SPEED;
    const baseVerticalSpeed = -250;

    // Variation creates spread: -2, -1, 0, 1, 2
    const spreadFactor = variation - 2;

    // Vary both horizontal and vertical velocities for parabolic spread
    const horizontalSpeed = baseHorizontalSpeed + spreadFactor * 40;
    const verticalSpeed = baseVerticalSpeed + spreadFactor * 60;

    this.arcVelocity = new Vector(horizontalSpeed * direction, verticalSpeed);
  }

  public onInitialize(_engine: Engine): void {
    // Set initial velocity for parabolic arc
    this.vel = this.arcVelocity;

    // Disable built-in gravity, we'll apply it manually
    this.body.useGravity = false;

    // Add some rotation for sparkly effect
    this.angularVelocity = 3; // Radians per second

    // Set up collision handling with snowballs and platforms
    this.on("precollision", (evt) => {
      const other = evt.other;

      // Check collision with snowballs
      if (other instanceof Snowball) {
        // Both snowball and decoration explode
        this.explode();
        other.kill();
      }
      // Check collision with platforms (Fixed collision type)
      else if (other.body.collisionType === CollisionType.Fixed) {
        // Explode when hitting the ground
        this.explode();
      }
    });
  }

  private explode(): void {
    // Create explosion particle effect
    const emitter = new ParticleEmitter({
      pos: this.pos.clone(),
      width: 20,
      height: 20,
      emitterType: EmitterType.Circle,
      radius: 15,
      minVel: 100,
      maxVel: 300,
      minAngle: 0,
      maxAngle: Math.PI * 2,
      isEmitting: true,
      emitRate: 150,
      particleLife: 600,
      maxSize: 10,
      minSize: 3,
      beginColor: Color.fromHex(Config.COLORS.DECORATION),
      endColor: Color.Transparent,
    });

    this.scene?.add(emitter);

    // Stop emitting after a short burst
    setTimeout(() => {
      emitter.isEmitting = false;
      setTimeout(() => emitter.kill(), 800);
    }, 100);

    // Kill the decoration
    this.kill();
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
