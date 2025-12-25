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
  Canvas,
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
      collisionType: CollisionType.Passive,
    });

    this.vel = new Vector(Config.SNOWBALL.SPEED * direction, 0);
  }

  public onInitialize(_engine: Engine): void {
    // Create pixel art snowball graphic
    const canvas = new Canvas({
      width: Config.SNOWBALL.WIDTH,
      height: Config.SNOWBALL.HEIGHT,
      draw: (ctx) => {
        const centerX = Config.SNOWBALL.WIDTH / 2;
        const centerY = Config.SNOWBALL.HEIGHT / 2;
        const radius = Config.SNOWBALL.WIDTH / 2;

        // Main white circle
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Light blue highlight (top-left)
        ctx.fillStyle = "rgba(200, 230, 255, 0.7)";
        ctx.beginPath();
        ctx.arc(centerX - 2, centerY - 2, radius * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Slight shadow/texture (bottom-right)
        ctx.fillStyle = "rgba(180, 200, 220, 0.3)";
        ctx.beginPath();
        ctx.arc(centerX + 1, centerY + 1, radius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Add a few small texture dots
        ctx.fillStyle = "rgba(230, 240, 255, 0.8)";
        ctx.fillRect(centerX - 3, centerY, 1, 1);
        ctx.fillRect(centerX + 2, centerY - 2, 1, 1);
        ctx.fillRect(centerX, centerY + 3, 1, 1);
      },
    });

    this.graphics.use(canvas);

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
