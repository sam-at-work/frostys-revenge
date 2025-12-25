/**
 * Santa Boss
 * Frosty's Revenge
 */

import { Actor, Vector, CollisionType, Engine, SpriteSheet } from "excalibur";
import { Config } from "../config";
import { Resources } from "../resources/resources";
import { Decoration } from "./decoration";

export class Santa extends Actor {
  private throwTimer: number = 0;
  private throwDirection: number = -1; // Throw to the left (toward player)
  private jumpTimer: number = 0;
  private jumpInterval: number = 3000; // Jump every 3 seconds
  private groundY: number;
  private isJumping: boolean = false;
  private idleSprite!: any;

  constructor(pos: Vector) {
    super({
      pos: pos,
      width: Config.SANTA.WIDTH,
      height: Config.SANTA.HEIGHT,
      collisionType: CollisionType.Active,
    });

    this.groundY = pos.y;
  }

  public onInitialize(_engine: Engine): void {
    // Create sprite sheet from the Santa image (6x6 grid, 128x190px sprites)
    // Image is 768x1140, so 768/6 = 128px wide, 1140/6 = 190px tall
    const santaSheet = SpriteSheet.fromImageSource({
      image: Resources.SantaSpriteSheet,
      grid: {
        rows: 6,
        columns: 6,
        spriteWidth: 128,
        spriteHeight: 190,
      },
    });

    // Create idle sprite (first sprite)
    this.idleSprite = santaSheet.getSprite(5, 0);

    // Set initial sprite
    this.graphics.use(this.idleSprite);

    // Set anchor to slightly above bottom so feet are on the ground
    this.graphics.anchor = new Vector(0.5, 0.9);

    // Move sprite down to align with collision box
    this.graphics.offset = new Vector(0, 16);

    // Santa uses gravity for jumping
    this.body.useGravity = true;
  }

  public onPreUpdate(engine: Engine, delta: number): void {
    // Update throw timer
    this.throwTimer += delta;

    // Update jump timer
    this.jumpTimer += delta;

    // Check if landed back on ground
    if (
      this.isJumping &&
      Math.abs(this.vel.y) < 10 &&
      this.pos.y >= this.groundY - 5
    ) {
      this.isJumping = false;
      this.pos.y = this.groundY; // Snap to ground
      this.vel.y = 0;
    }

    // Jump periodically like Bowser
    if (this.jumpTimer >= this.jumpInterval && !this.isJumping) {
      this.jump();
      this.jumpTimer = 0;
    }

    // Throw decorations periodically
    if (this.throwTimer >= Config.SANTA.THROW_INTERVAL) {
      this.throwDecorations(engine);
      this.throwTimer = 0;
    }
  }

  private jump(): void {
    this.vel.y = -400; // Jump velocity
    this.isJumping = true;
  }

  private throwDecorations(engine: Engine): void {
    // Throw multiple decorations in a spread pattern like Bowser's axes
    const numDecorations = 5;
    const baseOffsetX = -40;
    const baseOffsetY = -10;

    for (let i = 0; i < numDecorations; i++) {
      // Stagger the throws slightly for a spread effect
      const decorationPos = new Vector(
        this.pos.x + baseOffsetX,
        this.pos.y + baseOffsetY,
      );

      // Vary the initial velocities to create spread pattern
      const decoration = new Decoration(
        decorationPos,
        this.throwDirection,
        i, // Pass index for variation
      );
      engine.currentScene.add(decoration);
    }
  }

  public isInvulnerable(): boolean {
    // Santa cannot be defeated - player must get past him
    return true;
  }
}
