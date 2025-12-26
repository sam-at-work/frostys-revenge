# Tile System Guide - Frosty's Revenge

## Overview

The tile system provides a flexible way to create visually appealing platforms using pixel-art style tiles. Instead of solid color blocks, platforms are now composed of individual 32x32 pixel tiles that can be mixed and matched throughout your level.

## Architecture

The tile system is built using Excalibur's `Canvas` API, which allows us to draw custom graphics using the 2D Canvas rendering context. Each tile is:

- **32x32 pixels** (standard platformer tile size)
- **Cached** for performance (rendered once, reused many times)
- **Modular** (can be combined to create platforms of any size)

## Available Tile Types

### 1. Snow Platform (`TileType.SNOW_PLATFORM`)
- **Description**: White snow on top of brown wooden platform
- **Theme**: Default winter/snow theme
- **Best For**: Starting areas, main ground platforms
- **Visual**: Snow-dusted platform with wooden texture

### 2. Ice (`TileType.ICE`)
- **Description**: Light blue icy blocks with crystalline highlights
- **Theme**: Slippery, winter ice
- **Best For**: Challenging elevated platforms, ice-themed areas
- **Visual**: Translucent blue ice with white highlights

### 3. Brick (`TileType.BRICK`)
- **Description**: Mario-style orange/brown brick blocks
- **Theme**: Classic platformer
- **Best For**: Mid-level platforms, variety
- **Visual**: Brick texture with mortar lines

### 4. Winter Stone (`TileType.WINTER_STONE`)
- **Description**: Gray stone blocks with snow dusting
- **Theme**: Rocky winter terrain
- **Best For**: Ground platforms, sturdy-looking surfaces
- **Visual**: Gray stone with snow highlights

### 5. Candy Cane (`TileType.CANDY_CANE`)
- **Description**: Red and white festive stripes
- **Theme**: Christmas/candy theme
- **Best For**: Boss areas, special platforms, festive sections
- **Visual**: Diagonal red and white candy stripes

## Usage

### Basic Platform Creation

```typescript
// In level.ts or any scene
import { TileType, createTile } from "../graphics/tiles";

// Create a snow platform at position (100, 400) with dimensions 300x64
this.createPlatform(100, 400, 300, 64, TileType.SNOW_PLATFORM);
```

### The createPlatform Method

The updated `createPlatform` method automatically tiles the specified area:

```typescript
private createPlatform(
  x: number,              // X position (top-left corner)
  y: number,              // Y position (top-left corner)
  width: number,          // Total width in pixels
  height: number,         // Total height in pixels
  tileType: TileType = TileType.SNOW_PLATFORM  // Optional tile type
) {
  const tileSize = 32;
  const tilesWide = Math.ceil(width / tileSize);
  const tilesHigh = Math.ceil(height / tileSize);

  // Creates a grid of tiles to fill the platform area
  for (let row = 0; row < tilesHigh; row++) {
    for (let col = 0; col < tilesWide; col++) {
      const tile = new Actor({...});
      tile.graphics.use(createTile(tileType, tileSize));
      tile.body.collisionType = CollisionType.Fixed;
      this.add(tile);
    }
  }
}
```

## Design Tips

### 1. Platform Variety
Mix different tile types throughout your level for visual interest:

```typescript
// Ground sections with different themes
this.createPlatform(0, 568, 800, 64, TileType.SNOW_PLATFORM);
this.createPlatform(900, 568, 700, 64, TileType.WINTER_STONE);
this.createPlatform(1700, 568, 700, 64, TileType.ICE);
```

### 2. Thematic Grouping
Use tile types to indicate different areas:

```typescript
// Ice platforms for a challenging section
this.createPlatform(350, 430, 150, 32, TileType.ICE);
this.createPlatform(480, 350, 150, 32, TileType.ICE);
this.createPlatform(610, 270, 200, 32, TileType.ICE);

// Festive candy platforms near Santa boss
this.createPlatform(4300, 568, 900, 64, TileType.CANDY_CANE);
```

### 3. Visual Progression
Create a sense of progression by changing tile types as the level advances:

- **Early game**: Snow platforms (welcoming)
- **Mid game**: Stone/Brick (more challenging)
- **Late game**: Ice platforms (difficult)
- **Boss area**: Candy cane (festive finale)

## Creating Custom Tiles

To add new tile types, edit `src/graphics/tiles.ts`:

### 1. Create a New Tile Function

```typescript
export function createMyCustomTile(size: number = 32): Canvas {
  return new Canvas({
    width: size,
    height: size,
    cache: true,  // IMPORTANT: Always cache for performance
    draw: (ctx) => {
      // Use standard Canvas 2D API
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(0, 0, size, size);
      
      // Add details, highlights, shadows, etc.
      ctx.fillStyle = "#FFAAAA";
      ctx.fillRect(2, 2, size - 4, 4);
    },
  });
}
```

### 2. Add to TileType Enum

```typescript
export enum TileType {
  SNOW_PLATFORM = "snow",
  ICE = "ice",
  BRICK = "brick",
  WINTER_STONE = "stone",
  CANDY_CANE = "candy",
  MY_CUSTOM = "custom",  // Add your new type
}
```

### 3. Update Factory Function

```typescript
export function createTile(type: TileType, size: number = 32): Canvas {
  switch (type) {
    case TileType.SNOW_PLATFORM:
      return createSnowPlatformTile(size);
    // ... other cases ...
    case TileType.MY_CUSTOM:
      return createMyCustomTile(size);
    default:
      return createSnowPlatformTile(size);
  }
}
```

## Performance Considerations

### Caching
Always set `cache: true` in Canvas options. This ensures the tile is rendered once to a bitmap and then reused, rather than re-drawing every frame.

```typescript
return new Canvas({
  width: size,
  height: size,
  cache: true,  // ✅ Always do this!
  draw: (ctx) => { /* ... */ },
});
```

### Tile Count
Each 32x32 tile becomes a separate Actor in the scene. For a 300x64 platform, that's approximately 18 actors (9 wide × 2 high). This is fine for moderate platform counts, but be mindful of creating too many platforms.

**Example counts:**
- Small platform (150×32): 5 tiles
- Medium platform (300×64): 18 tiles
- Large platform (800×64): 50 tiles

## Canvas 2D API Quick Reference

Common drawing operations used in tiles:

```typescript
draw: (ctx) => {
  // Fill rectangles
  ctx.fillStyle = "#RRGGBB";
  ctx.fillRect(x, y, width, height);
  
  // Stroke rectangles (outlines)
  ctx.strokeStyle = "#RRGGBB";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, width, height);
  
  // Semi-transparent colors
  ctx.fillStyle = "rgba(255, 0, 0, 0.5)";  // 50% opacity red
  
  // Gradients (advanced)
  const gradient = ctx.createLinearGradient(0, 0, size, 0);
  gradient.addColorStop(0, "#FFFFFF");
  gradient.addColorStop(1, "#000000");
  ctx.fillStyle = gradient;
}
```

## Examples from Level

Current level implementation showcases tile variety:

```typescript
// Starting area - welcoming snow theme
this.createPlatform(0, 568, 800, 64, TileType.SNOW_PLATFORM);

// Stone section - sturdy ground
this.createPlatform(900, 568, 700, 64, TileType.WINTER_STONE);

// Ice challenge - slippery elevated platforms
this.createPlatform(350, 430, 150, 32, TileType.ICE);
this.createPlatform(480, 350, 150, 32, TileType.ICE);

// Brick variety - classic platformer feel
this.createPlatform(1100, 430, 150, 32, TileType.BRICK);

// Candy finale - festive boss battle area
this.createPlatform(4300, 568, 900, 64, TileType.CANDY_CANE);
```

## Troubleshooting

### Tiles appear as solid colors
- Check that you're importing and using `createTile()` correctly
- Ensure the Canvas `draw` function is implemented

### Performance issues
- Verify `cache: true` is set on all Canvas tiles
- Consider reducing the number of platforms or platform sizes

### Tiles don't align properly
- Ensure platform dimensions are multiples of 32 for perfect tiling
- Check that tile positions are calculated correctly in the loop

## Future Enhancements

Ideas for extending the tile system:

1. **Animated tiles**: Use multiple Canvas frames for water, lava, etc.
2. **Edge tiles**: Special tiles for left/right edges and corners
3. **Destructible tiles**: Tiles that break when hit
4. **Tile sets from images**: Load tileset images instead of Canvas drawing
5. **Parallax background tiles**: Multi-layer scrolling backgrounds

---

**Happy tiling! 🎮❄️**