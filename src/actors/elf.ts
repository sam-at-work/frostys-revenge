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
} from "excalibur";
import { Config } from "../config";

export class Elf extends Actor {
  private startX: number;
  private patrolDistance: number;
  private movingRight: boolean = true;

  constructor(
    pos: Vector,
    patrolDistance: number = Config.ELF.PATROL_DISTANCE,
  ) {
    super({
      pos: pos,
      width: Config.ELF.WIDTH,
      height: Config.ELF.HEIGHT,
      color: Color.fromHex(Config.COLORS.ELF),
      collisionType: CollisionType.Active,
    });

    this.startX = pos.x;
    this.patrolDistance = patrolDistance;
  }

  public onInitialize(_engine: Engine): void {
    // Elves use gravity
    this.body.useGravity = true;

    // Start moving
    this.vel.x = Config.ELF.MOVE_SPEED;
  }

  public onPreUpdate(_engine: Engine, _delta: number): void {
    // Patrol back and forth
    this.patrol();
  }

  private patrol(): void {
    // Check if we've reached the patrol boundary
    if (this.movingRight) {
      if (this.pos.x >= this.startX + this.patrolDistance) {
        this.movingRight = false;
        this.vel.x = -Config.ELF.MOVE_SPEED;
      }
    } else {
      if (this.pos.x <= this.startX - this.patrolDistance) {
        this.movingRight = true;
        this.vel.x = Config.ELF.MOVE_SPEED;
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
