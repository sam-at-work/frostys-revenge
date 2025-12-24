/**
 * Santa Boss
 * Frosty's Revenge
 */

import { Actor, Vector, Color, CollisionType, Engine } from "excalibur";
import { Config } from "../config";
import { Decoration } from "./decoration";

export class Santa extends Actor {
  private throwTimer: number = 0;
  private throwDirection: number = -1; // Throw to the left (toward player)

  constructor(pos: Vector) {
    super({
      pos: pos,
      width: Config.SANTA.WIDTH,
      height: Config.SANTA.HEIGHT,
      color: Color.fromHex(Config.COLORS.SANTA),
      collisionType: CollisionType.Fixed,
    });
  }

  public onInitialize(_engine: Engine): void {
    // Santa doesn't use gravity (he's standing on his platform)
    this.body.useGravity = false;
  }

  public onPreUpdate(engine: Engine, delta: number): void {
    // Update throw timer
    this.throwTimer += delta;

    // Throw decorations periodically
    if (this.throwTimer >= Config.SANTA.THROW_INTERVAL) {
      this.throwDecoration(engine);
      this.throwTimer = 0;
    }
  }

  private throwDecoration(engine: Engine): void {
    // Create decoration slightly in front of Santa
    const offsetX = -40; // Throw from left side
    const decorationPos = new Vector(
      this.pos.x + offsetX,
      this.pos.y - 10
    );

    const decoration = new Decoration(decorationPos, this.throwDirection);
    engine.currentScene.add(decoration);
  }

  public isInvulnerable(): boolean {
    // Santa cannot be defeated - player must get past him
    return true;
  }
}
