# Graphics Module - Tile System

## Quick Start

This module contains the tile-based graphics system for Frosty's Revenge platforms.

### Basic Usage

```typescript
import { TileType, createTile } from "../graphics/tiles";

// Create a platform with snow tiles
this.createPlatform(100, 400, 300, 64, TileType.SNOW_PLATFORM);

// Create a platform with ice tiles
this.createPlatform(500, 350, 200, 32, TileType.ICE);
```

## Available Tile Types

| Type | Enum Value | Description | Best For |
|------|-----------|-------------|----------|
| **Snow Platform** | `TileType.SNOW_PLATFORM` | White snow on brown wood | Starting areas, main ground |
| **Ice** | `TileType.ICE` | Light blue icy blocks | Elevated platforms, challenges |
| **Brick** | `TileType.BRICK` | Orange/brown brick blocks | Mid-level platforms, variety |
| **Winter Stone** | `TileType.WINTER_STONE` | Gray stone with snow dust | Ground platforms, sturdy look |
| **Candy Cane** | `TileType.CANDY_CANE` | Red/white festive stripes | Boss areas, special platforms |

## Creating Custom Tiles

```typescript
export function createMyCustomTile(size: number = 32): Canvas {
  return new Canvas({
    width: size,
    height: size,
    cache: true,  // ⚠️ REQUIRED for performance
    draw: (ctx) => {
      // Use standard Canvas 2D API
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(0, 0, size, size);
      
      // Add highlights, shadows, details...
      ctx.fillStyle = "#FFAAAA";
      ctx.fillRect(2, 2, size - 4, 4);
    },
  });
}
```

## Performance Tips

✅ **DO:**
- Always set `cache: true` on Canvas tiles
- Use 32x32 pixel tiles (standard size)
- Reuse tile types across platforms

❌ **DON'T:**
- Create new tile instances in update loops
- Use tiles larger than 64x64 pixels
- Forget to enable caching

## Documentation

- **Full Guide:** See `../TILES_GUIDE.md` for comprehensive documentation
- **Visual Preview:** Open `../TILE_PREVIEW.html` in browser to see all tiles
- **Implementation:** See `../TILE_IMPLEMENTATION_SUMMARY.md` for technical details

## File Structure

```
game/src/graphics/
├── README.md          # This file - quick reference
└── tiles.ts           # Tile creation functions and types
```

## Examples from Level

```typescript
// Ground platforms with variety
this.createPlatform(0, 568, 800, 64, TileType.SNOW_PLATFORM);
this.createPlatform(900, 568, 700, 64, TileType.WINTER_STONE);
this.createPlatform(1700, 568, 700, 64, TileType.SNOW_PLATFORM);

// Elevated ice platforms for challenge
this.createPlatform(350, 430, 150, 32, TileType.ICE);
this.createPlatform(480, 350, 150, 32, TileType.ICE);

// Festive candy boss area
this.createPlatform(4300, 568, 900, 64, TileType.CANDY_CANE);
```

---

**Framework:** Excalibur.js Canvas API  
**Tile Size:** 32x32 pixels  
**Performance:** Cached for optimal rendering