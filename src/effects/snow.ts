/**
 * Snow Particle Effect
 * Frosty's Revenge
 */

import { Actor, Vector, Color, CollisionType, Engine } from "excalibur";
import { Config } from "../config";

export class SnowParticle extends Actor {
  private lifetime: number = 0;
  private maxLifetime: number;
  private driftSpeed: number;
  private fallSpeed: number;

  constructor(x: number, y: number) {
    const size = Math.random() * 3 + 2; // 2-5 pixels
    super({
      pos: new Vector(x, y),
      width: size,
      height: size,
      color: Color.fromRGB(255, 255, 255, 0.6 + Math.random() * 0.4),
      z: -20, // Behind trees
    });

    this.body.collisionType = CollisionType.PreventCollision;
    this.body.useGravity = false;

    // Random drift and fall speeds for variety
    this.driftSpeed = (Math.random() - 0.5) * 20;
    this.fallSpeed = Math.random() * 30 + 20; // 20-50 pixels per second
    this.maxLifetime = 10000 + Math.random() * 5000; // 10-15 seconds
  }

  public onInitialize(_engine: Engine): void {
    this.vel = new Vector(this.driftSpeed, this.fallSpeed);
  }

  public onPreUpdate(_engine: Engine, delta: number): void {
    this.lifetime += delta;

    // Fade out near the end of lifetime
    if (this.lifetime > this.maxLifetime * 0.8) {
      const fadeProgress =
        (this.lifetime - this.maxLifetime * 0.8) / (this.maxLifetime * 0.2);
      this.graphics.opacity = 1 - fadeProgress;
    }

    // Remove when lifetime expires or off screen
    if (
      this.lifetime >= this.maxLifetime ||
      this.pos.y > Config.GAME_HEIGHT + 50
    ) {
      this.kill();
    }
  }
}

export class SnowEmitter {
  private emitTimer: number = 0;
  private emitRate: number = 100; // milliseconds between particles

  public update(engine: Engine, delta: number, cameraX: number): void {
    this.emitTimer += delta;

    if (this.emitTimer >= this.emitRate) {
      this.emitTimer = 0;

      // Emit particles across the visible screen
      const particlesPerEmit = Math.floor(Math.random() * 2) + 1; // 1-2 particles

      for (let i = 0; i < particlesPerEmit; i++) {
        const x =
          cameraX -
          Config.GAME_WIDTH / 2 +
          Math.random() * Config.GAME_WIDTH;
        const y = -10; // Start above screen

        const particle = new SnowParticle(x, y);
        engine.currentScene.add(particle);
      }
    }
  }
}
