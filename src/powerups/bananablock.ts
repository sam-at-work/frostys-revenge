/**
 * Banana Block - Like Mario's ? Block
 * Frosty's Revenge
 */

import { Actor, Vector, Color, CollisionType, Engine } from "excalibur";
import { Config } from "../config";
import { Banana } from "./banana";
import { Player } from "../actors/player";

export class BananaBlock extends Actor {
  private hasBeenHit: boolean = false;
  private originalY: number;
  private bumpTimer: number = 0;
  private isBumping: boolean = false;

  constructor(pos: Vector) {
    super({
      pos: pos,
      width: Config.LEVEL.TILE_SIZE,
      height: Config.LEVEL.TILE_SIZE,
      color: Color.fromHex("#CD853F"), // Brown/tan color for block
      collisionType: CollisionType.Fixed,
    });

    this.originalY = pos.y;
  }

  public onInitialize(_engine: Engine): void {
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
        }
      }
    });
  }

  public onPreUpdate(_engine: Engine, delta: number): void {
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

    // Change color to indicate it's been used (darker)
    this.color = Color.fromHex("#8B7355");

    // Spawn banana above the block
    const bananaPos = new Vector(
      this.pos.x,
      this.pos.y - Config.LEVEL.TILE_SIZE - Config.BANANA.HEIGHT / 2
    );

    const banana = new Banana(bananaPos);
    this.scene?.add(banana);
  }

  private bump(): void {
    this.isBumping = true;
    this.bumpTimer = 0;
  }
}
