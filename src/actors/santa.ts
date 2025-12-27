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
  private health: number = Config.SANTA.MAX_HEALTH;
  private maxHealth: number = Config.SANTA.MAX_HEALTH;
  private throwTimer: number = 0;
  private throwDirection: number = -1; // Throw to the left (toward player)
  private jumpTimer: number = 0;
  private jumpInterval: number = 3000; // Jump every 3 seconds
  private groundY: number;
  private isJumping: boolean = false;
  private walkAnim!: Animation;
  private dyingAnim!: Animation;
  private startX: number;
  private patrolDistance: number = 400; // Increased from 200 to make him walk more
  private movingRight: boolean = false; // Start moving left
  public facingLeft: boolean = true; // Made public for hit detection
  private backHitCounter: number = 0; // Count hits to the face (front hits)
  private damageFlashTimer: number = 0;
  private isDamageFlashing: boolean = false;
  private isDying: boolean = false;
  private deathAnimationComplete: boolean = false;

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

    // Create dying animation sprite sheet (13x12 grid, 128x128px sprites, 150 total with 6 on bottom row)
    const dyingSheet = SpriteSheet.fromImageSource({
      image: Resources.SantaDyingSpriteSheet,
      grid: {
        rows: 12,
        columns: 13,
        spriteWidth: 128,
        spriteHeight: 128,
      },
    });

    // Create dying animation using all sprites (11 full rows of 13 + 6 from last row = 149 sprites)
    const dyingSprites = [...range(0, 142), 143, 144, 145, 146, 147, 148];
    this.dyingAnim = Animation.fromSpriteSheet(
      dyingSheet,
      dyingSprites,
      60, // 60ms per frame
    );
    this.dyingAnim.strategy = AnimationStrategy.End;
    // Scale up dying animation to match walking sprite size (128px -> 190px height = 1.484x scale)
    this.dyingAnim.scale = new Vector(1.484, 1.484);

    // Set initial animation
    this.graphics.use(this.walkAnim);

    // Set anchor to slightly above bottom so feet are on the ground
    this.graphics.anchor = new Vector(0.5, 0.5);

    // Move sprite down to align with collision box
    this.graphics.offset = new Vector(0, 0);

    // Santa uses gravity for jumping
    this.body.useGravity = true;

    // Start moving left
    this.vel.x = -Config.SANTA.MOVE_SPEED;
  }

  public onPreUpdate(engine: Engine, delta: number): void {
    // If dying, stop all movement and wait for animation to complete
    if (this.isDying) {
      this.vel.x = 0;
      this.vel.y = 0;
      return;
    }

    // Handle damage flash effect
    if (this.isDamageFlashing) {
      this.damageFlashTimer += delta;
      // Flash between visible and slightly transparent
      const flashInterval = 100; // Flash every 100ms
      this.graphics.opacity =
        Math.floor(this.damageFlashTimer / flashInterval) % 2 === 0 ? 0.3 : 1.0;

      // End flash after 400ms
      if (this.damageFlashTimer >= 400) {
        this.isDamageFlashing = false;
        this.damageFlashTimer = 0;
        this.graphics.opacity = 1.0;
      }
    }

    // Prevent Santa from going off the right edge of the level
    const maxX = Config.LEVEL.LENGTH - Config.SANTA.WIDTH / 2 - 10;
    if (this.pos.x > maxX) {
      this.pos.x = maxX;
      // Force turn around if trying to go right
      if (this.movingRight || this.vel.x > 0) {
        this.movingRight = false;
        this.facingLeft = true;
        this.vel.x = -Config.SANTA.MOVE_SPEED;
        this.graphics.flipHorizontal = false;
      }
    }

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
    // Patrol based on distance from start position
    if (this.movingRight) {
      // Set velocity to move right
      this.vel.x = Config.SANTA.MOVE_SPEED;

      // Turn around if reaching right patrol boundary
      if (this.pos.x >= this.startX + this.patrolDistance) {
        this.movingRight = false;
        this.facingLeft = true;
        this.graphics.flipHorizontal = false; // Santa faces left by default
        this.backHitCounter = 0; // Reset counter on turn
      }
    } else {
      // Set velocity to move left
      this.vel.x = -Config.SANTA.MOVE_SPEED;

      // Turn around if reaching left patrol boundary
      if (this.pos.x <= this.startX - this.patrolDistance) {
        this.movingRight = true;
        this.facingLeft = false;
        this.graphics.flipHorizontal = true; // Flip to face right
        this.backHitCounter = 0; // Reset counter on turn
      }
    }
  }

  private jump(): void {
    this.vel.y = -400; // Jump velocity - lower so player cannot run underneath
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

  public takeDamage(): void {
    this.health--;
    if (this.health < 0) {
      this.health = 0;
    }

    // Trigger damage flash effect
    this.isDamageFlashing = true;
    this.damageFlashTimer = 0;

    // Increment front hit counter (face hits)
    this.backHitCounter++;

    // Turn around after 3 hits to the face
    if (this.backHitCounter >= 3) {
      this.movingRight = !this.movingRight;
      this.facingLeft = !this.facingLeft;
      this.graphics.flipHorizontal = !this.graphics.flipHorizontal;
      this.backHitCounter = 0; // Reset counter after turning
    }
  }

  public isDefeated(): boolean {
    return this.health <= 0;
  }

  public getHealth(): number {
    return this.health;
  }

  public getMaxHealth(): number {
    return this.maxHealth;
  }

  public isInvulnerable(): boolean {
    // Santa can now be defeated via snowball hits
    return this.isDefeated();
  }

  public playDeathAnimation(onComplete: () => void): void {
    if (this.isDying) return; // Already dying

    this.isDying = true;

    // Disable physics completely
    this.body.collisionType = CollisionType.PreventCollision;
    this.body.useGravity = false;
    this.vel.x = 0;
    this.vel.y = 0;
    this.acc.x = 0;
    this.acc.y = 0;

    // Move Santa to ground level if he's in the air
    this.pos = new Vector(this.pos.x, this.groundY);

    // Switch to dying animation
    this.graphics.use(this.dyingAnim);

    // Adjust vertical offset to keep Santa on ground (dying sprites are shorter, need to move down)
    // Walking sprite: 190px tall, dying sprite: 128px scaled to 190px
    // Offset needs to move down by (190-128)/2 scaled = 31 * 1.484 ≈ 46px
    this.graphics.offset = new Vector(0, 0);

    // Calculate total animation duration (149 sprites * 60ms per frame)
    const totalDuration = 149 * 60;

    // After animation completes, freeze on last frame and fade out
    setTimeout(() => {
      // Animation is complete, now freeze and fade out
      const fadeDuration = 2000; // 2 seconds fade
      const fadeSteps = 20;
      const fadeInterval = fadeDuration / fadeSteps;
      let currentStep = 0;

      const fadeTimer = setInterval(() => {
        currentStep++;
        this.graphics.opacity = 1.0 - currentStep / fadeSteps;

        if (currentStep >= fadeSteps) {
          clearInterval(fadeTimer);
          this.graphics.opacity = 0;
          this.deathAnimationComplete = true;
          // Remove Santa's collision box from the scene
          this.kill();
          onComplete();
        }
      }, fadeInterval);
    }, totalDuration);
  }

  public isDeathAnimationComplete(): boolean {
    return this.deathAnimationComplete;
  }
}
