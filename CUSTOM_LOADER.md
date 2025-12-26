# Custom Loader Documentation

## Overview

Frosty's Revenge uses a custom loading screen that extends Excalibur's `DefaultLoader` to display a background image while game assets are loading.

## Features

- **Background Image**: Displays `/public/homescreen/image.jpg` (1104x832px) as the loading screen background
- **Cover Fit**: The image automatically scales to cover the entire canvas (800x600px) while maintaining aspect ratio
- **Progress Bar**: Animated progress bar showing loading percentage
- **Semi-transparent Overlay**: Dark overlay on the background image to improve text readability
- **Play Button**: Interactive "Click to Start" button to unlock browser audio context (required by browsers)
- **Gradient Progress Fill**: Green gradient effect on the progress bar

## Implementation

The custom loader is located at: `src/loaders/CustomLoader.ts`

### Key Methods

#### `onDraw(ctx: CanvasRenderingContext2D)`
- Handles all visual rendering on the canvas
- Draws the background image with cover fit algorithm
- Renders loading text, progress bar, and percentage

#### `onUserAction()`
- Creates a play button overlay
- Required to unlock the audio context in browsers (they prevent audio until user interaction)
- Returns a Promise that resolves when the user clicks the button

#### `onUpdate(engine, elapsedMilliseconds)`
- Called every frame during loading
- Currently unused but available for animations

#### `onBeforeLoad()` / `onAfterLoad()`
- Lifecycle hooks called before and after loading
- Used to clean up the play button

## Background Image Scaling

The loader uses a "cover" fit algorithm:

```
if (imageAspectRatio > canvasAspectRatio) {
  // Image is wider - fit to height, crop sides
  drawHeight = canvasHeight
  drawWidth = drawHeight * imageAspectRatio
} else {
  // Image is taller - fit to width, crop top/bottom
  drawWidth = canvasWidth
  drawHeight = drawWidth / imageAspectRatio
}
```

This ensures the background image always fills the entire canvas without distortion.

## Customization

### Change Background Image

Replace the image path in `CustomLoader.ts`:

```typescript
this.backgroundImage.src = "/homescreen/your-image.jpg";
```

### Modify Colors

Progress bar colors can be changed in the `onDraw` method:

```typescript
gradient.addColorStop(0, "#4CAF50"); // Start color (green)
gradient.addColorStop(1, "#8BC34A"); // End color (light green)
```

Play button color:

```typescript
this.playButtonElement.style.backgroundColor = "#4CAF50"; // Green
```

### Adjust Overlay Opacity

The semi-transparent overlay can be adjusted:

```typescript
ctx.fillStyle = "rgba(0, 0, 0, 0.3)"; // 0.3 = 30% opacity
```

### Change Loading Text

Modify the text in `onDraw`:

```typescript
const loadingText = "Loading Frosty's Revenge...";
```

## Usage

The custom loader is initialized in `src/main.ts`:

```typescript
import { CustomLoader } from "./loaders/CustomLoader";

const loader = new CustomLoader();
// Add resources to loader
loader.addResource(Resources.ElfSpriteSheet);
// ... add more resources

// Start the game with the loader
game.start(loader).then(() => {
  game.initialize();
});
```

## Browser Compatibility

The loader works across all modern browsers. The play button requirement is due to browser autoplay policies that prevent audio from playing without user interaction.

## Reference

Based on Excalibur.js documentation:
- https://excaliburjs.com/docs/loaders
- `DefaultLoader` API: https://excaliburjs.com/docs/api/class/DefaultLoader