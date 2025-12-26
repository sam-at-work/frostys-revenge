# PNG Mountain Backgrounds Implementation

## Summary

Successfully replaced the procedurally-generated canvas mountains with PNG image-based backgrounds that include parallax scrolling and bottom anchoring.

## What Changed

### Files Modified

1. **`src/resources/resources.ts`**
   - Added three mountain PNG image resources:
     - `Mountain1` (far layer)
     - `Mountain2` (mid layer)
     - `Mountain3` (near layer)

2. **`src/main.ts`**
   - Added mountain images to the resource loader
   - Ensures images are loaded before game starts

3. **`src/scenes/level.ts`**
   - Replaced `createMountain()` method to use PNG sprites instead of canvas drawing
   - Updated `createMountainLayer()` to accept `ImageSource` parameter
   - Updated `createMountains()` to use the three PNG images
   - Removed unused `Canvas` import
   - Implemented bottom anchoring for mountains

4. **`PARALLAX_MOUNTAINS.md`**
   - Completely updated documentation to reflect new PNG-based system

## Key Features

### Bottom Anchoring

Mountains are positioned so their bottom edge aligns with the bottom of the screen:

```typescript
const scaledHeight = mountainImage.height * scale;
const yPosition = Config.GAME_HEIGHT - scaledHeight / 2;
```

**Benefits:**
- When you scale mountains, they stay anchored to the bottom
- No need to recalculate Y position when changing scale
- Consistent baseline across all mountain layers

### Parallax Configuration

```typescript
// Far mountains - slowest movement (5% of camera speed)
this.createMountainLayer(Resources.Mountain1, 0.05, -90, 1.0, [200, 1000, 2200, 3400, 4600]);

// Mid mountains - medium movement (10% of camera speed)
this.createMountainLayer(Resources.Mountain2, 0.1, -85, 1.0, [600, 1600, 2800, 4000]);

// Near mountains - faster movement (20% of camera speed)
this.createMountainLayer(Resources.Mountain3, 0.2, -80, 1.0, [0, 1200, 2400, 3600, 4800]);
```

### How It Works

1. **Image Loading**: PNG images are loaded as `ImageSource` resources during game startup
2. **Sprite Creation**: Each image is converted to a sprite using `.toSprite()`
3. **Scaling**: Sprites are scaled (currently 1.0x = original size)
4. **Positioning**: Actor position calculated to anchor bottom to screen bottom
5. **Parallax**: `ParallaxComponent` added with appropriate factor for depth effect
6. **Rendering**: Excalibur renders sprites efficiently using GPU acceleration

## Using Original PNG Sizes

All mountains currently use scale `1.0`, which means they render at their original PNG dimensions:
- `mountain1.png`: 165 KB
- `mountain2.png`: 247 KB  
- `mountain3.png`: 190 KB

## Customization Examples

### Change Scale (Mountains Stay Bottom-Anchored)

```typescript
// Make far mountains 50% larger
this.createMountainLayer(Resources.Mountain1, 0.05, -90, 1.5, positions);

// Make near mountains 75% size
this.createMountainLayer(Resources.Mountain3, 0.2, -80, 0.75, positions);
```

### Adjust Parallax Speed

```typescript
// Make far mountains even slower (more distant)
this.createMountainLayer(Resources.Mountain1, 0.02, -90, 1.0, positions);

// Make near mountains faster (appear closer)
this.createMountainLayer(Resources.Mountain3, 0.35, -80, 1.0, positions);
```

### Add More Mountain Instances

```typescript
// Add more mountains to fill gaps
this.createMountainLayer(
  Resources.Mountain2, 
  0.1, 
  -85, 
  1.0, 
  [100, 600, 1200, 1600, 2200, 2800, 3400, 4000, 4600]
);
```

### Add a New Layer

1. Add new PNG to `public/backgrounds/mountain4.png`
2. Add to resources:
```typescript
Mountain4: new ImageSource("/backgrounds/mountain4.png"),
```
3. Add to loader in main.ts:
```typescript
loader.addResource(Resources.Mountain4);
```
4. Create layer:
```typescript
this.createMountainLayer(Resources.Mountain4, 0.15, -82, 1.0, [300, 1300, 2300, 3300, 4300]);
```

## Advantages

1. ✅ **Bottom anchoring** - Scaling doesn't require repositioning
2. ✅ **PNG images** - Full artistic control over appearance
3. ✅ **Original sizes** - Using unscaled images for best quality
4. ✅ **Parallax effect** - Multiple layers create depth
5. ✅ **Performance** - Sprite rendering is GPU-accelerated
6. ✅ **Flexibility** - Easy to swap images or add new layers
7. ✅ **Transparency** - PNGs can have alpha channels for blending

## Technical Details

### Actor Positioning in Excalibur

- Actors are positioned by their **center point** by default
- For an image with height H at scale S:
  - Scaled height = H × S
  - Center Y position = GAME_HEIGHT - (scaled height / 2)
  - This puts the bottom edge at Y = GAME_HEIGHT (bottom of screen)

### Parallax Factor

- `0.0` = Stationary (doesn't move with camera)
- `0.05` = Moves at 5% of camera speed (very distant)
- `0.1` = Moves at 10% of camera speed (mid-range)
- `0.2` = Moves at 20% of camera speed (nearby)
- `1.0` = Moves at 100% of camera speed (no parallax)

### Z-Index Layering

- `-100` = Sky gradient (furthest back)
- `-90` = Far mountains
- `-85` = Mid mountains
- `-80` = Near mountains
- `-20` = Snow particles
- `-10` = Pine trees
- `0+` = Platforms, player, enemies

## Testing

Run the game and verify:
1. ✅ Mountains visible in background
2. ✅ Mountains anchored to bottom of screen
3. ✅ Parallax effect when moving right
4. ✅ Different layers move at different speeds
5. ✅ No performance issues or visual glitches

## Files Structure

```
game/
├── public/
│   └── backgrounds/
│       ├── mountain1.png  (165 KB)
│       ├── mountain2.png  (247 KB)
│       └── mountain3.png  (190 KB)
├── src/
│   ├── resources/
│   │   └── resources.ts   (Mountain1, Mountain2, Mountain3 added)
│   ├── scenes/
│   │   └── level.ts       (PNG-based mountain system)
│   └── main.ts            (Mountains added to loader)
└── PARALLAX_MOUNTAINS.md  (Updated documentation)
```

## Reference

See `PARALLAX_MOUNTAINS.md` for complete documentation including:
- Visual design details
- Full code examples
- Customization guide
- Performance notes
- Future enhancement ideas