/**
 * Santa Boss
 * Frosty's Revenge
 */

import {
  Actor,
  Vector,
  CollisionType,
  Engine,
  SpriteSheet,
  Animation,
  AnimationStrategy,
  range,
} from "excalibur";
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
  private walkAnim!: Animation;
  private startX: number;
  private patrolDistance: number = 200;
  private movingRight: boolean = false; // Start moving left
  private facingLeft: boolean = true;
  private platformLeft: number = 4800; // Left edge of platform
  private platformRight: number = 5000; // Right edge of platform

  constructor(pos: Vector) {
    super({
      pos: pos,
      width: Config.SANTA.WIDTH,
      height: Config.SANTA.HEIGHT,
      collisionType: CollisionType.Active,
    });

    this.groundY = pos.y;
    this.startX = pos.x;
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

    // Create walking animation using all 34 sprites (5 full rows + 4 from last row)
    // Sprites are indexed 0-29 (5 rows * 6 cols) + 30-33 (4 from last row)
    const allSprites = [...range(0, 29), 30, 31, 32, 33];
    this.walkAnim = Animation.fromSpriteSheet(
      santaSheet,
      allSprites,
      60, // 60ms per frame
    );
    this.walkAnim.strategy = AnimationStrategy.Loop;

    // Set initial animation
    this.graphics.use(this.walkAnim);

    // Set anchor to slightly above bottom so feet are on the ground
    this.graphics.anchor = new Vector(0.5, 0.9);

    // Move sprite down to align with collision box
    this.graphics.offset = new Vector(0, 30);

    // Santa uses gravity for jumping
    this.body.useGravity = true;

    // Start moving left
    this.vel.x = -Config.SANTA.MOVE_SPEED;
  }

  public onPreUpdate(engine: Engine, delta: number): void {
    // Patrol back and forth
    this.patrol();

    // Update throw timer
    this.throwTimer += delta;

    // Update jump timer
    this.jumpTimer += delta;

    // Check if landed back on ground
    if (this.isJumping && this.vel.y >= 0 && this.pos.y >= this.groundY - 5) {
      this.isJumping = false;
    }

    // Jump periodically like Bowser
    if (this.jumpTimer >= this.jumpInterval && !this.isJumping) {
      this.jump();
      this.jumpTimer = 0;
    }

    // Throw decorations periodically - only when facing left
    if (this.throwTimer >= Config.SANTA.THROW_INTERVAL && this.facingLeft) {
      this.throwDecorations(engine);
      this.throwTimer = 0;
    }
  }

  private patrol(): void {
    // Check if we've reached the platform edge or patrol boundary
    const halfWidth = Config.SANTA.WIDTH / 2;
    const edgeBuffer = 10; // Stay 10px from edge

    if (this.movingRight) {
      // Turn around if reaching right edge of platform or patrol boundary
      if (
        this.pos.x + halfWidth >= this.platformRight - edgeBuffer ||
        this.pos.x >= this.startX + this.patrolDistance
      ) {
        this.movingRight = false;
        this.facingLeft = true;
        this.vel.x = -Config.SANTA.MOVE_SPEED;
        this.graphics.flipHorizontal = false; // Santa faces left by default
      }
    } else {
      // Turn around if reaching left edge of platform or patrol boundary
      if (
        this.pos.x - halfWidth <= this.platformLeft + edgeBuffer ||
        this.pos.x <= this.startX - this.patrolDistance
      ) {
        this.movingRight = true;
        this.facingLeft = false;
        this.vel.x = Config.SANTA.MOVE_SPEED;
        this.graphics.flipHorizontal = true; // Flip to face right
      }
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
