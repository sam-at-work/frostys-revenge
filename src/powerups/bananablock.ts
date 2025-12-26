/**
 * Banana Block - Like Mario's ? Block
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
import { Resources } from "../resources/resources";
import { Banana } from "./banana";
import { Player } from "../actors/player";
import {
  createBananaBlockTile,
  createUsedBananaBlockTile,
} from "../graphics/tiles";

export class BananaBlock extends Actor {
  private hasBeenHit: boolean = false;
  private originalY: number;
  private bumpTimer: number = 0;
  private isBumping: boolean = false;
  private pulseTimer: number = 0;
  private sparkleEmitter?: ParticleEmitter;

  constructor(pos: Vector) {
    super({
      pos: pos,
      width: Config.LEVEL.TILE_SIZE,
      height: Config.LEVEL.TILE_SIZE,
      collisionType: CollisionType.Fixed,
    });

    this.originalY = pos.y;
  }

  public onInitialize(_engine: Engine): void {
    // Apply banana block tile graphic
    const blockTile = createBananaBlockTile(Config.LEVEL.TILE_SIZE);
    this.graphics.use(blockTile);

    // Set up collision handling
    this.on("precollision", (evt) => {
      const other = evt.other;

      // Check if player hit from below
      if (other instanceof Player && !this.hasBeenHit) {
        // Check if collision is from below (player jumping into block)
        const contact = evt.contact;
        if (contact && contact.mtv.y > 0) {
          // Player hit from below!
          this.spawnBanana();
          this.bump();
          // Play block hit sound
          Resources.BlockHitSound.play(0.5);
        }
      }
    });

    // Add sparkle effect to unused blocks
    if (!this.hasBeenHit) {
      this.createSparkleEffect();
    }
  }

  private createSparkleEffect(): void {
    // Create subtle sparkle particles around unused blocks
    this.sparkleEmitter = new ParticleEmitter({
      pos: this.pos.clone(),
      width: this.width,
      height: this.height,
      emitterType: EmitterType.Rectangle,
      minVel: 5,
      maxVel: 15,
      minAngle: 0,
      maxAngle: Math.PI * 2,
      isEmitting: true,
      emitRate: 5,
      particleLife: 1000,
      maxSize: 2,
      minSize: 1,
      beginColor: Color.fromHex("#FFD700"), // Gold
      endColor: Color.Transparent,
    });

    this.scene?.add(this.sparkleEmitter);
  }

  public onPreUpdate(_engine: Engine, delta: number): void {
    // Update pulse animation for unused blocks
    if (!this.hasBeenHit) {
      this.pulseTimer += delta;
      const pulse = Math.sin(this.pulseTimer * 0.003) * 0.15 + 0.85;
      this.graphics.opacity = pulse;

      // Update sparkle position
      if (this.sparkleEmitter) {
        this.sparkleEmitter.pos = this.pos.clone();
      }
    }

    // Handle bump animation
    if (this.isBumping) {
      this.bumpTimer += delta;

      // Bump up and down animation (200ms total)
      if (this.bumpTimer < 100) {
        // Move up
        this.pos.y = this.originalY - 5;
      } else if (this.bumpTimer < 200) {
        // Move down
        this.pos.y = this.originalY;
      } else {
        // End bump
        this.isBumping = false;
        this.bumpTimer = 0;
        this.pos.y = this.originalY;
      }
    }
  }

  private spawnBanana(): void {
    if (this.hasBeenHit) return;

    this.hasBeenHit = true;

    // Stop sparkle effect
    if (this.sparkleEmitter) {
      this.sparkleEmitter.isEmitting = false;
      setTimeout(() => this.sparkleEmitter?.kill(), 500);
    }

    // Change to darker "used" block appearance
    this.graphics.opacity = 1; // Reset opacity
    const usedBlockTile = createUsedBananaBlockTile(Config.LEVEL.TILE_SIZE);
    this.graphics.use(usedBlockTile);

    // Spawn banana above the block
    const bananaPos = new Vector(
      this.pos.x,
      this.pos.y - Config.LEVEL.TILE_SIZE - Config.BANANA.HEIGHT / 2,
    );

    const banana = new Banana(bananaPos);
    this.scene?.add(banana);
  }

  private bump(): void {
    this.isBumping = true;
    this.bumpTimer = 0;
  }
}
