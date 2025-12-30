/**
 * Resources - Asset Management
 * Frosty's Revenge
 *
 * This file manages all game assets (images, sounds, etc.)
 */

import { ImageSource, Sound } from "excalibur";

// const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
// const asset = (path: string) => new URL(path, import.meta.url).href;
const asset = (path: string) => path;

export const Resources = {
  // ===== BACKGROUNDS =====
  // Mountain background images (pixel art with transparent backgrounds)
  Mountain1: new ImageSource(asset("backgrounds/mountain1.png")),
  Mountain2: new ImageSource(asset("backgrounds/mountain2.png")),
  Mountain3: new ImageSource(asset("backgrounds/mountain3.png")),

  // ===== SPRITE SHEETS =====
  // Elf sprite sheet (480x480, 5x5 grid, 96px sprites)
  ElfSpriteSheet: new ImageSource(asset("elf/sprite_sheet_96_18px.png")),

  // Snowman sprite sheet (672x852, 7x6 grid, 96x142px sprites, 40 total)
  SnowmanSpriteSheet: new ImageSource(
    asset("snowman/v2_sprite_sheet_96_5px.png"),
  ),

  // Banana sprite sheet (672x852, 7x6 grid, 96x142px sprites, 40 total)
  BananaSpriteSheet: new ImageSource(asset("banana/sprite_sheet_96_14px.png")),

  // Santa sprite sheet (768x1140, 6x6 grid, 128x190px sprites, 34 total)
  SantaSpriteSheet: new ImageSource(asset("santa/sprite_sheet_128_5px.png")),

  // Santa dying sprite sheet (1664x1536, 13x12 grid, 128x128px sprites, 150 total with 6 on bottom row)
  SantaDyingSpriteSheet: new ImageSource(
    asset("santa/sprite_sheet_128_5px-dying.png"),
  ),

  // ===== SOUND EFFECTS =====
  // You can download free game sound effects from:
  // - https://freesound.org/
  // - https://opengameart.org/
  // - https://kenney.nl/assets (search for "audio")
  // - https://mixkit.co/free-sound-effects/game/
  //
  // Place sound files in: public/sounds/
  // Supported formats: .mp3, .wav, .ogg

  // Jump sound - light "boing" or "hop" sound
  JumpSound: new Sound(asset("sounds/jump.wav")),

  // Snowball throw sound - "whoosh" or "throw" sound
  SnowballThrowSound: new Sound(asset("sounds/phaserUp1.ogg")),

  // Snowball impact/explosion sound - "poof" or small explosion
  SnowballHitSound: new Sound(asset("sounds/snowball-impact.ogg")),

  // Enemy defeat sound - satisfying "pop" or defeat sound
  EnemyDefeatSound: new Sound(asset("sounds/lowRandom.ogg")),

  // Power-up collect sound - positive "ding" or "powerup" sound
  PowerUpSound: new Sound(asset("sounds/powerUp1.ogg")),

  // Player damage/death sound - "ouch" or hurt sound
  PlayerHurtSound: new Sound(asset("sounds/lowDown.ogg")),

  // Banana block hit sound - "boing" or block bump sound
  BlockHitSound: new Sound(asset("sounds/phaseJump1.ogg")),

  // Background music - Intro Theme from OpenGameArt
  BackgroundMusic: new Sound(asset("music/opengameart/Intro Theme.mp3")),

  // Boss music - Boss Theme from OpenGameArt for Santa battle
  BossMusic: new Sound(asset("music/opengameart/Boss Theme.mp3")),

  // Banana mode music - "I'm A Banana" song, starts at 45 seconds
  BananaSong: new Sound(asset("music/Banana Song (I'm A Banana).mp3")),

  // Respawn sound - plays when scrolling back to start after death
  RespawnSound: new Sound(asset("sounds/zapThreeToneDown.ogg")),
} as const;
