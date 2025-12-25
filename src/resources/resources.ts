/**
 * Resources - Asset Management
 * Frosty's Revenge
 *
 * This file manages all game assets (images, sounds, etc.)
 */

import { ImageSource } from "excalibur";

export const Resources = {
  // Elf sprite sheet (480x480, 5x5 grid, 96px sprites)
  ElfSpriteSheet: new ImageSource("/elf/sprite_sheet_96_18px.png"),

  // Snowman sprite sheet (672x852, 7x6 grid, 96x142px sprites, 40 total)
  SnowmanSpriteSheet: new ImageSource("/snowman/v2_sprite_sheet_96_5px.png"),

  // Banana sprite sheet (672x852, 7x6 grid, 96x142px sprites, 40 total)
  BananaSpriteSheet: new ImageSource("/banana/sprite_sheet_96_14px.png"),

  // Santa sprite sheet (768x1140, 6x6 grid, 128x190px sprites, 34 total)
  SantaSpriteSheet: new ImageSource("/santa/sprite_sheet_128_5px.png"),

  // Additional images will be added here in future phases
  // Example structure:
  // Snowman: new ImageSource('./assets/images/snowman.png'),
  // Santa: new ImageSource('./assets/images/santa.png'),
  // etc.
} as const;
