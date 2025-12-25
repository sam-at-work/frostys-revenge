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

  // Additional images will be added here in future phases
  // Example structure:
  // Snowman: new ImageSource('./assets/images/snowman.png'),
  // Santa: new ImageSource('./assets/images/santa.png'),
  // etc.
} as const;
