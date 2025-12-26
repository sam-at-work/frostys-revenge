/**
 * Tile Graphics - Snow-themed platform tiles
 * Frosty's Revenge
 */

import { Canvas } from "excalibur";

/**
 * Create a snow-covered platform tile (32x32)
 * White snow on top of brown platform
 */
export function createSnowPlatformTile(size: number = 32): Canvas {
  return new Canvas({
    width: size,
    height: size,
    cache: true, // Important for performance - rasterizes once
    draw: (ctx) => {
      // Brown platform base (lower 2/3)
      ctx.fillStyle = "#8B7355";
      ctx.fillRect(0, size / 3, size, (size * 2) / 3);

      // Darker brown for depth at bottom
      ctx.fillStyle = "#6B5335";
      ctx.fillRect(0, size - 4, size, 4);

      // White snow on top (upper 1/3)
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, size, size / 3);

      // Snow highlights (lighter areas)
      ctx.fillStyle = "#F0F8FF";
      ctx.fillRect(2, 2, size / 2 - 2, size / 3 - 4);

      // Subtle shadow line where snow meets platform
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, size / 3, size, 2);

      // Add some texture to the platform
      ctx.fillStyle = "rgba(101, 67, 33, 0.3)";
      ctx.fillRect(4, size / 2, 3, 3);
      ctx.fillRect(size - 8, size / 2 + 5, 2, 2);
    },
  });
}

/**
 * Create an ice platform tile (32x32)
 * Light blue icy blocks
 */
export function createIceTile(size: number = 32): Canvas {
  return new Canvas({
    width: size,
    height: size,
    cache: true,
    draw: (ctx) => {
      // Base ice color - light blue
      ctx.fillStyle = "#D4F1F9";
      ctx.fillRect(0, 0, size, size);

      // Ice gradient effect (lighter at top)
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, size, size / 4);

      // Semi-transparent highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.fillRect(4, 4, size / 2, 6);

      // Ice crystals/highlights
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fillRect(size - 10, size - 10, 6, 6);
      ctx.fillRect(8, size / 2, 4, 4);

      // Subtle blue shadows for depth
      ctx.fillStyle = "rgba(135, 206, 235, 0.4)";
      ctx.fillRect(0, size - 6, size, 6);
      ctx.fillRect(size - 4, 0, 4, size);

      // Thin border for definition
      ctx.strokeStyle = "rgba(100, 150, 180, 0.3)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, size, size);
    },
  });
}

/**
 * Create a brick tile (32x32)
 * Mario-style brick for variety
 */
export function createBrickTile(size: number = 32): Canvas {
  return new Canvas({
    width: size,
    height: size,
    cache: true,
    draw: (ctx) => {
      // Base brick color - orange/brown
      ctx.fillStyle = "#D2691E";
      ctx.fillRect(0, 0, size, size);

      // Darker brick shade for depth
      ctx.fillStyle = "#A0522D";
      ctx.fillRect(0, size - 4, size, 4);
      ctx.fillRect(size - 4, 0, 4, size);

      // Lighter brick highlights
      ctx.fillStyle = "#F4A460";
      ctx.fillRect(0, 0, size - 4, 4);
      ctx.fillRect(0, 0, 4, size - 4);

      // Mortar lines (darker separators)
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(0, 0, size, 2); // Top
      ctx.fillRect(0, 0, 2, size); // Left
      ctx.fillRect(0, size / 2 - 1, size, 2); // Middle horizontal

      // Add texture dots
      ctx.fillStyle = "rgba(139, 69, 19, 0.3)";
      ctx.fillRect(size / 4, size / 4, 2, 2);
      ctx.fillRect((size * 3) / 4, (size * 3) / 4, 2, 2);
    },
  });
}

/**
 * Create a winter stone tile (32x32)
 * Gray stone with snow dusting
 */
export function createWinterStoneTile(size: number = 32): Canvas {
  return new Canvas({
    width: size,
    height: size,
    cache: true,
    draw: (ctx) => {
      // Base stone color - gray
      ctx.fillStyle = "#778899";
      ctx.fillRect(0, 0, size, size);

      // Darker stone for depth
      ctx.fillStyle = "#556677";
      ctx.fillRect(0, size - 6, size, 6);
      ctx.fillRect(size - 6, 0, 6, size);

      // Lighter stone highlights
      ctx.fillStyle = "#A0ADB8";
      ctx.fillRect(0, 0, size - 6, 6);
      ctx.fillRect(0, 0, 6, size - 6);

      // Snow dusting on top
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillRect(0, 0, size, 6);
      ctx.fillRect(0, 0, 6, size / 2);

      // Stone texture
      ctx.fillStyle = "rgba(60, 70, 80, 0.2)";
      ctx.fillRect(size / 3, size / 3, 4, 4);
      ctx.fillRect((size * 2) / 3, size / 2, 3, 3);
      ctx.fillRect(size / 4, (size * 3) / 4, 2, 2);
    },
  });
}

/**
 * Create a candy cane tile (32x32)
 * Festive red and white stripes
 */
export function createCandyCaneTile(size: number = 32): Canvas {
  return new Canvas({
    width: size,
    height: size,
    cache: true,
    draw: (ctx) => {
      // White base
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, size, size);

      // Red stripes (diagonal)
      ctx.fillStyle = "#DC143C";
      const stripeWidth = size / 4;
      for (let i = 0; i < 3; i++) {
        const y = i * stripeWidth;
        ctx.fillRect(0, y, size, stripeWidth / 2);
      }

      // Add shine effect
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.fillRect(0, 0, size / 2, size);

      // Border for definition
      ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, size, size);
    },
  });
}

/**
 * Tile type enum for easy reference
 */
export enum TileType {
  SNOW_PLATFORM = "snow",
  ICE = "ice",
  BRICK = "brick",
  WINTER_STONE = "stone",
  CANDY_CANE = "candy",
}

/**
 * Factory function to create tiles by type
 */
export function createTile(type: TileType, size: number = 32): Canvas {
  switch (type) {
    case TileType.SNOW_PLATFORM:
      return createSnowPlatformTile(size);
    case TileType.ICE:
      return createIceTile(size);
    case TileType.BRICK:
      return createBrickTile(size);
    case TileType.WINTER_STONE:
      return createWinterStoneTile(size);
    case TileType.CANDY_CANE:
      return createCandyCaneTile(size);
    default:
      return createSnowPlatformTile(size);
  }
}
