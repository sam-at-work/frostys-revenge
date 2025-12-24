/**
 * Banana Power-up - Runs away like Mario's Super Star
 * Frosty's Revenge
 */

import { Actor, Vector, Color, CollisionType, Engine } from "excalibur";
import { Config } from "../config";
import { Player } from "../actors/player";

export class Banana extends Actor {
  private moveSpeed: number = 150;
  private direction: number = 1; // 1 = right, -1 = left
  private lifetime: number = 0;
  private maxLifetime: number = 10000; // Despawn after 10 seconds if not caught

  constructor(pos: Vector) {
    super({
      pos: pos,
      width: Config.BANANA.WIDTH,
      height: Config.BANANA.HEIGHT,
      color: Color.fromHex(Config.COLORS.BANANA),
      collisionType: CollisionType.Active,
    });
  }

  public onInitialize(_engine: Engine): void {
    // Banana uses gravity
    this.body.useGravity = true;

    // Start moving to the right
    this.vel.x = this.moveSpeed * this.direction;

    // Set up collision handling
    this.on("precollision", (evt) => {
      const other = evt.other;

      // Check if player caught the banana
      if (other instanceof Player) {
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
  }

  public onPreUpdate(_engine: Engine, delta: number): void {
    this.lifetime += delta;

    // Keep moving
    this.vel.x = this.moveSpeed * this.direction;

    // Despawn if lifetime exceeded
    if (this.lifetime >= this.maxLifetime) {
      this.kill();
    }

    // Despawn if fell off the world
    if (this.pos.y > Config.GAME_HEIGHT + 100) {
      this.kill();
    }
  }
}
