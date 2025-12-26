/**
 * Elf Enemy
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
  SpriteSheet,
  Animation,
  AnimationStrategy,
  range,
} from "excalibur";
import { Config } from "../config";
import { Resources } from "../resources/resources";

export class Elf extends Actor {
  private startX: number;
  private patrolDistance: number;
  private movingRight: boolean = true;
  private walkAnim!: Animation;
  private idleSprite!: any;
  private isOnGround: boolean = false;
  private lastGroundY: number = 0;

  constructor(
    pos: Vector,
    patrolDistance: number = Config.ELF.PATROL_DISTANCE,
  ) {
    super({
      pos: pos,
      width: Config.ELF.WIDTH,
      height: Config.ELF.HEIGHT,
      collisionType: CollisionType.Active,
    });

    this.startX = pos.x;
    this.patrolDistance = patrolDistance;
  }

  public onInitialize(_engine: Engine): void {
    // Create sprite sheet from the elf image (5x5 grid, 96px sprites)
    // Image is 480x480, so 480/5 = 96px per sprite
    const elfSheet = SpriteSheet.fromImageSource({
      image: Resources.ElfSpriteSheet,
      grid: {
        rows: 5,
        columns: 5,
        spriteWidth: 96,
        spriteHeight: 96,
      },
    });

    // Create idle sprite (first sprite)
    this.idleSprite = elfSheet.getSprite(0, 0);

    // Create walking animation using all 25 sprites
    this.walkAnim = Animation.fromSpriteSheet(
      elfSheet,
      range(0, 24), // sprites 0-24 (all 5 rows)
      100, // 100ms per frame
    );
    this.walkAnim.strategy = AnimationStrategy.Loop;

    // Set initial animation
    this.graphics.use(this.walkAnim);

    // Set anchor to slightly above bottom so feet are on the ground
    this.graphics.anchor = new Vector(0.5, 0.86);

    // Move sprite down 32px to align with collision box
    this.graphics.offset = new Vector(0, 36);

    // Elves use gravity
    this.body.useGravity = true;

    // Start moving
    this.vel.x = Config.ELF.MOVE_SPEED;
    this.lastGroundY = this.pos.y;

    // Listen for collisions
    this.on("precollision", (evt) => {
      const side = evt.side;

      // Track if we're on ground
      if (side === "Bottom") {
        this.isOnGround = true;
        this.lastGroundY = this.pos.y;
      }

      // If we hit a wall on the side we're moving, turn around
      if (side === "Left" && !this.movingRight) {
        this.movingRight = true;
        this.vel.x = Config.ELF.MOVE_SPEED;
        this.graphics.flipHorizontal = false;
      } else if (side === "Right" && this.movingRight) {
        this.movingRight = false;
        this.vel.x = -Config.ELF.MOVE_SPEED;
        this.graphics.flipHorizontal = true;
      }
    });

    this.on("postcollision", () => {
      this.isOnGround = false;
    });
  }

  public onPreUpdate(_engine: Engine, _delta: number): void {
    // Simple edge detection - if we're falling and not on ground, we walked off edge
    if (!this.isOnGround && this.pos.y > this.lastGroundY + 10) {
      // We've walked off a platform, turn around
      if (this.movingRight) {
        this.movingRight = false;
        this.vel.x = -Config.ELF.MOVE_SPEED;
        this.graphics.flipHorizontal = true;
      } else {
        this.movingRight = true;
        this.vel.x = Config.ELF.MOVE_SPEED;
        this.graphics.flipHorizontal = false;
      }
    }

    // Patrol back and forth
    this.patrol();

    // Use walking animation when moving, idle when stopped
    if (this.vel.x === 0) {
      this.graphics.use(this.idleSprite);
    } else {
      this.graphics.use(this.walkAnim);
    }
  }

  private patrol(): void {
    // Check if we've reached the patrol boundary from starting position
    if (this.movingRight) {
      if (this.pos.x >= this.startX + this.patrolDistance) {
        this.movingRight = false;
        this.vel.x = -Config.ELF.MOVE_SPEED;
        this.graphics.flipHorizontal = true;
      }
    } else {
      if (this.pos.x <= this.startX - this.patrolDistance) {
        this.movingRight = true;
        this.vel.x = Config.ELF.MOVE_SPEED;
        this.graphics.flipHorizontal = false;
      }
    }
  }

  public defeat(): void {
    // Create particle effect for defeat
    this.createDefeatParticles();

    // Remove elf from scene
    this.kill();
  }

  private createDefeatParticles(): void {
    // Create a burst of green particles when defeated
    const emitter = new ParticleEmitter({
      pos: this.pos.clone(),
      width: 10,
      height: 10,
      emitterType: EmitterType.Circle,
      radius: 5,
      minVel: 50,
      maxVel: 150,
      minAngle: 0,
      maxAngle: Math.PI * 2,
      isEmitting: true,
      emitRate: 50,
      particleLife: 500,
      maxSize: 5,
      minSize: 2,
      beginColor: Color.fromHex(Config.COLORS.ELF),
      endColor: Color.Transparent,
    });

    this.scene?.add(emitter);

    // Stop emitting after a short burst
    setTimeout(() => {
      emitter.isEmitting = false;
      setTimeout(() => emitter.kill(), 1000);
    }, 100);
  }

  public isDefeated(): boolean {
    return !this.active;
  }
}
