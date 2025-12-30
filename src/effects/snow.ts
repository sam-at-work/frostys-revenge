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
    this.maxLifetime = 15000 + Math.random() * 5000; // 15-20 seconds
  }

  public onInitialize(_engine: Engine): void {
    this.vel = new Vector(this.driftSpeed, this.fallSpeed);
  }

  public onPreUpdate(_engine: Engine, delta: number): void {
    this.lifetime += delta;

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
  private emitRate: number = 80; // Boss fight snow - heavier snowfall

  public initialize(_engine: Engine): void {
    // No pre-spawning - snow will start falling from top naturally
  }

  public update(engine: Engine, delta: number, _cameraX: number): void {
    this.emitTimer += delta;

    if (this.emitTimer >= this.emitRate) {
      this.emitTimer = 0;

      // Heavier snowfall for boss fight - 2-4 particles
      const particlesPerEmit = Math.floor(Math.random() * 3) + 2;

      for (let i = 0; i < particlesPerEmit; i++) {
        // Emit across entire boss area (4300 to end of level) for consistent snow
        const bossAreaStart = 4300;
        const bossAreaWidth = Config.LEVEL.LENGTH - bossAreaStart;
        const x = bossAreaStart + Math.random() * bossAreaWidth;
        const y = -10; // Start above screen

        const particle = new SnowParticle(x, y);
        engine.currentScene.add(particle);
      }
    }

    // Cull particles that fall below the screen or are before boss area
    engine.currentScene.actors.forEach((actor) => {
      if (actor instanceof SnowParticle) {
        if (actor.pos.y > Config.GAME_HEIGHT + 50 || actor.pos.x < 4300) {
          actor.kill();
        }
      }
    });
  }
}
