/**
 * Banana Power-up - Runs away like Mario's Super Star
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
import { Player } from "../actors/player";
import { createCandyBallGraphic } from "../graphics/tiles";

export class Banana extends Actor {
  private moveSpeed: number = 150;
  private direction: number = 1; // 1 = right, -1 = left
  private lifetime: number = 0;
  private maxLifetime: number = 10000; // Despawn after 10 seconds if not caught
  private sparkleEmitter!: ParticleEmitter;

  constructor(pos: Vector) {
    super({
      pos: pos,
      width: Config.BANANA.WIDTH,
      height: Config.BANANA.HEIGHT,
      collisionType: CollisionType.Active,
    });
  }

  public onInitialize(_engine: Engine): void {
    // Apply candy ball graphic
    const candyGraphic = createCandyBallGraphic(Config.BANANA.WIDTH);
    this.graphics.use(candyGraphic);

    // Banana uses gravity
    this.body.useGravity = true;

    // Start moving to the right
    this.vel.x = this.moveSpeed * this.direction;

    // Set up collision handling
    this.on("precollision", (evt) => {
      const other = evt.other;

      // Check if player caught the banana
      if (other instanceof Player) {
        // Cancel collision to prevent affecting player velocity
        const contact = evt.contact;
        if (contact) {
          contact.cancel();
        }
        other.activateBanana();
        this.kill();
      }
    });

    // Bounce off platforms - change direction
    this.on("postcollision", (evt) => {
      const contact = evt.contact;
      // If we hit something on our side (wall or edge), reverse direction
      if (contact && Math.abs(contact.mtv.x) > 0) {
        this.direction *= -1;
        this.vel.x = this.moveSpeed * this.direction;
      }
    });

    // Create sparkle particle effect
    this.createSparkleEffect();
  }

  private createSparkleEffect(): void {
    // Create continuous sparkle particles around the banana
    this.sparkleEmitter = new ParticleEmitter({
      pos: this.pos.clone(),
      width: this.width,
      height: this.height,
      emitterType: EmitterType.Circle,
      radius: 15,
      minVel: 10,
      maxVel: 30,
      minAngle: 0,
      maxAngle: Math.PI * 2,
      isEmitting: true,
      emitRate: 20,
      particleLife: 500,
      maxSize: 3,
      minSize: 1,
      beginColor: Color.fromHex("#FFD700"), // Gold
      endColor: Color.Transparent,
    });

    this.scene?.add(this.sparkleEmitter);
  }

  public onPreUpdate(_engine: Engine, delta: number): void {
    this.lifetime += delta;

    // Update sparkle emitter position to follow banana
    if (this.sparkleEmitter) {
      this.sparkleEmitter.pos = this.pos.clone();
    }

    // Keep moving
    this.vel.x = this.moveSpeed * this.direction;

    // Despawn if lifetime exceeded
    if (this.lifetime >= this.maxLifetime) {
      this.cleanup();
    }

    // Despawn if fell off the world
    if (this.pos.y > Config.GAME_HEIGHT + 100) {
      this.cleanup();
    }
  }

  private cleanup(): void {
    // Stop sparkle emitter
    if (this.sparkleEmitter) {
      this.sparkleEmitter.isEmitting = false;
      setTimeout(() => this.sparkleEmitter?.kill(), 500);
    }
    this.kill();
  }

  public kill(): void {
    // Clean up sparkle emitter when banana is caught
    if (this.sparkleEmitter && this.sparkleEmitter.isEmitting) {
      this.sparkleEmitter.isEmitting = false;
      setTimeout(() => this.sparkleEmitter?.kill(), 500);
    }
    super.kill();
  }
}
