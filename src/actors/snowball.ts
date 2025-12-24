/**
 * Snowball Projectile
 * Frosty's Revenge
 */

import { Actor, Vector, Color, CollisionType, Engine } from "excalibur";
import { Config } from "../config";

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
