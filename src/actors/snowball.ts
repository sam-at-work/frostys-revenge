/**
 * Snowball Projectile
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
import { Elf } from "./elf";

export class Snowball extends Actor {
  private lifetime: number = 0;

  constructor(pos: Vector, direction: number) {
    super({
      pos: pos,
      width: Config.SNOWBALL.WIDTH,
      height: Config.SNOWBALL.HEIGHT,
      color: Color.fromHex(Config.COLORS.SNOWBALL),
      collisionType: CollisionType.Passive,
    });

    this.vel = new Vector(Config.SNOWBALL.SPEED * direction, 0);
  }

  public onInitialize(_engine: Engine): void {
    // Snowball doesn't have gravity
    this.body.useGravity = false;

    // Set up collision handling with enemies
    this.on("precollision", (evt) => {
      const other = evt.other;

      // Check collision with elves
      if (other instanceof Elf && !other.isDefeated()) {
        // Defeat the elf
        other.defeat();
        // Create impact particles
        this.createImpactParticles();
        // Remove the snowball
        this.kill();
      }
    });
  }

  private createImpactParticles(): void {
    // Create a small burst of white/blue particles on impact
    const emitter = new ParticleEmitter({
      pos: this.pos.clone(),
      width: 5,
      height: 5,
      emitterType: EmitterType.Circle,
      radius: 3,
      minVel: 30,
      maxVel: 100,
      minAngle: 0,
      maxAngle: Math.PI * 2,
      isEmitting: true,
      emitRate: 30,
      particleLife: 300,
      maxSize: 4,
      minSize: 1,
      beginColor: Color.fromHex(Config.COLORS.SNOWBALL),
      endColor: Color.Transparent,
    });

    this.scene?.add(emitter);

    // Stop emitting after a short burst
    setTimeout(() => {
      emitter.isEmitting = false;
      setTimeout(() => emitter.kill(), 500);
    }, 50);
  }

  public onPreUpdate(_engine: Engine, delta: number): void {
    this.lifetime += delta;

    // Remove snowball after lifetime expires
    if (this.lifetime >= Config.SNOWBALL.LIFETIME) {
      this.kill();
    }

    // Remove if off screen
    if (
      this.pos.x < -100 ||
      this.pos.x > Config.LEVEL.LENGTH + 100 ||
      this.pos.y < -100 ||
      this.pos.y > Config.GAME_HEIGHT + 100
    ) {
      this.kill();
    }
  }

  public hitEnemy(): void {
    this.kill();
  }
}
