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
  CollisionStartEvent,
  Side,
} from "excalibur";
import { Config } from "../config";
import { Resources } from "../resources/resources";

export class Elf extends Actor {
  private startX: number;
  private patrolDistance: number;
  private movingRight: boolean = true;
  private walkAnim!: Animation;

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

    // Listen for collisions to detect walls/obstacles
    this.on("collisionstart", (evt: CollisionStartEvent) =>
      this.onCollision(evt),
    );
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
  }

  private onCollision(evt: CollisionStartEvent): void {
    // If we hit a wall/platform on the side we're moving, turn around
    const side = evt.side;

    // Hit wall on the right while moving right - turn left
    if (side === Side.Right && this.movingRight) {
      this.movingRight = false;
      this.vel.x = -Config.ELF.MOVE_SPEED;
      this.graphics.flipHorizontal = true;
    }
    // Hit wall on the left while moving left - turn right
    else if (side === Side.Left && !this.movingRight) {
      this.movingRight = true;
      this.vel.x = Config.ELF.MOVE_SPEED;
      this.graphics.flipHorizontal = false;
    }
  }

  public onPreUpdate(_engine: Engine, _delta: number): void {
    // Always use walking animation
    this.graphics.use(this.walkAnim);

    // Simple patrol - just check boundaries
    if (this.movingRight && this.pos.x >= this.startX + this.patrolDistance) {
      this.movingRight = false;
      this.vel.x = -Config.ELF.MOVE_SPEED;
      this.graphics.flipHorizontal = true;
    } else if (
      !this.movingRight &&
      this.pos.x <= this.startX - this.patrolDistance
    ) {
      this.movingRight = true;
      this.vel.x = Config.ELF.MOVE_SPEED;
      this.graphics.flipHorizontal = false;
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
