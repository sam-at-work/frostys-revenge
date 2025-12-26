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
  private emitRate: number = 80; // milliseconds between particles
  private isInitialized: boolean = false;

  public initialize(engine: Engine): void {
    // Pre-spawn snow particles only in visible area + buffer
    const numParticles = 200; // Reduced for better performance
    const cameraX = engine.currentScene.camera.pos.x;
    const spawnWidth = Config.GAME_WIDTH * 2; // 2 screens wide

    for (let i = 0; i < numParticles; i++) {
      // Spawn near camera position, not entire level
      const x = cameraX - Config.GAME_WIDTH + Math.random() * spawnWidth;
      // Spawn at random heights across the screen
      const y = Math.random() * Config.GAME_HEIGHT;

      const particle = new SnowParticle(x, y);
      engine.currentScene.add(particle);
    }

    this.isInitialized = true;
  }

  public update(engine: Engine, delta: number, cameraX: number): void {
    this.emitTimer += delta;

    if (this.emitTimer >= this.emitRate) {
      this.emitTimer = 0;

      // Emit particles across visible screen + 1 screen ahead
      const particlesPerEmit = Math.floor(Math.random() * 3) + 2; // 2-4 particles

      for (let i = 0; i < particlesPerEmit; i++) {
        // Emit across visible screen plus 1.5 screens ahead
        const emitWidth = Config.GAME_WIDTH * 2.5;
        const x = cameraX - Config.GAME_WIDTH / 2 + Math.random() * emitWidth;
        const y = -10; // Start above screen

        const particle = new SnowParticle(x, y);
        engine.currentScene.add(particle);
      }
    }

    // Cull particles that are behind the camera (one-way scrolling, no need to keep them)
    const cullX = cameraX - Config.GAME_WIDTH / 2 - 50; // Slightly behind left edge
    engine.currentScene.actors.forEach((actor) => {
      if (actor instanceof SnowParticle) {
        if (actor.pos.x < cullX) {
          actor.kill();
        }
      }
    });
  }
}
