/**
 * Elf Enemy
 * Frosty's Revenge
 */

import { Actor, Vector, Color, CollisionType, Engine } from "excalibur";
import { Config } from "../config";

export class Elf extends Actor {
  private startX: number;
  private patrolDistance: number;
  private movingRight: boolean = true;

  constructor(pos: Vector, patrolDistance: number = Config.ELF.PATROL_DISTANCE) {
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
    // Remove elf from scene
    this.kill();
  }

  public isDefeated(): boolean {
    return !this.active;
  }
}
