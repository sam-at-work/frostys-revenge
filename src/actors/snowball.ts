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
import { Resources } from "../resources/resources";
import { Elf } from "./elf";

export class Snowball extends Actor {
  private lifetime: number = 0;

  constructor(pos: Vector, direction: number) {
    super({
      pos: pos,
      width: Config.SNOWBALL.WIDTH,
      height: Config.SNOWBALL.HEIGHT,
      collisionType: CollisionType.Active,
    });

    // Set velocity for arc trajectory - upward angle to peak after 0.8 seconds
    // Custom gravity of 220 px/s² gives low arc (peak ~70px) that peaks at 0.8s
    this.vel = new Vector(Config.SNOWBALL.SPEED * direction, -176);
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

    // Use custom gravity (220 px/s²) instead of global gravity for a low arc
    // This gives a peak height of ~70px (just above snowman's head) at 0.8s
    this.body.useGravity = false;
    this.acc.y = 220; // Custom gravity acceleration

    // Set up collision handling with enemies and platforms
    this.on("precollision", (evt) => {
      const other = evt.other;

      // Check collision with elves
      if (other instanceof Elf && !other.isDefeated()) {
        // Defeat the elf
        other.defeat();
        // Create impact particles and play sound
        this.createImpactParticles();
        Resources.SnowballHitSound.play(0.5);
        // Remove the snowball
        this.kill();
      }
      // Check collision with platforms (Fixed collision type)
      else if (other.body.collisionType === CollisionType.Fixed) {
        // Create snow puff on impact with platform and play sound
        this.createImpactParticles();
        Resources.SnowballHitSound.play(0.5);
        // Remove the snowball
        this.kill();
      }
    });
  }

  private createImpactParticles(): void {
    // Create a big dramatic burst of white/blue particles on impact
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
      beginColor: Color.fromHex(Config.COLORS.SNOWBALL),
      endColor: Color.Transparent,
    });

    this.scene?.add(emitter);

    // Stop emitting after a short burst
    setTimeout(() => {
      emitter.isEmitting = false;
      setTimeout(() => emitter.kill(), 800);
    }, 100);
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
