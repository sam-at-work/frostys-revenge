# Tagline Scene - Final Dramatic Reveal

## Overview

The **Tagline Scene** is the final narrative screen before gameplay begins. It displays the two most dramatic lines from Frosty's story over the game's beautiful background image, creating a cinematic transition into the action.

## Purpose

This scene serves as:
- **Emotional climax** of the narrative setup
- **Dramatic reveal** of Frosty's true motivation
- **Cinematic transition** from story to gameplay
- **Thematic statement** that this is a revenge story, not a rescue story

## Visual Design

### Background
- **Image**: Uses the same winter landscape from the loading screen (`/homescreen/image.jpg`)
- **Overlay**: 60% dark overlay for text readability
- **Effect**: Creates a dramatic, cinematic feel

### Typography

**Line 1**: "This isn't about saving Christmas."
- Font size: 32px
- Color: Light blue (#d4e8f0)
- Position: Center screen, slightly above middle
- Shadow: Black, prominent

**Line 2**: "It's about revenge."
- Font size: 56px (larger for impact)
- Color: Dramatic red (#ff4444)
- Position: Center screen, slightly below middle
- Shadow: Black, extra prominent

**Instruction Text**: "Press SPACE or Click to Begin"
- Font size: 28px
- Color: Bright yellow (#ffff00)
- Position: Bottom of screen
- Effect: Pulsing animation

## User Interaction

### Controls
- **SPACE** - Start the game (go to level scene)
- **Mouse Click** - Start the game (go to level scene)

Both inputs work simultaneously for maximum accessibility.

### Flow
```
Intro Scene → [SPACE/Click] → Tagline Scene → [SPACE/Click] → Game Starts
```

## Technical Details

### File
- **Path**: `src/scenes/tagline.ts`
- **Scene Name**: `"tagline"`
- **Class**: `TaglineScene`

### Key Features
1. **Async Image Loading**: Background image loads before scene displays
2. **Responsive Scaling**: Background image scales to fill screen while maintaining aspect ratio
3. **Event Cleanup**: Proper listener cleanup prevents memory leaks
4. **Scene Clearing**: All actors removed on deactivate for clean transitions

### Implementation Highlights

```typescript
// Background image loading
this.backgroundImage = new ImageSource("homescreen/image.jpg");
await this.backgroundImage.load();

// Scale to cover screen
const scaleX = Config.GAME_WIDTH / this.backgroundImage.width;
const scaleY = Config.GAME_HEIGHT / this.backgroundImage.height;
const scale = Math.max(scaleX, scaleY);
```

## Design Philosophy

### Why Split from Intro?
1. **Pacing**: Gives each narrative beat room to breathe
2. **Impact**: The tagline hits harder when isolated
3. **Visuals**: Background image creates stronger emotional impact
4. **Interactivity**: Player actively advances the story

### Why This Background?
- **Continuity**: Player saw this image during loading
- **Quality**: Professional, evocative winter scene
- **Thematic**: Sets the tone for the game world
- **Transition**: Natural bridge from story to gameplay

## Customization

### Change Background Image
Edit the image path in `onInitialize()`:
```typescript
this.backgroundImage = new ImageSource("/your-image-path.jpg");
```

### Change Text
Edit the Label text properties:
```typescript
text: "Your custom line here..."
```

### Adjust Overlay Darkness
Modify the alpha value (0.0 = transparent, 1.0 = opaque):
```typescript
color: Color.fromRGB(0, 0, 0, 0.6) // 60% dark
```

### Change Colors
```typescript
// Line 1
color: Color.fromHex("#d4e8f0") // Light blue

// Line 2
color: Color.fromHex("#ff4444") // Red
```

## Testing Checklist

- [ ] Background image loads correctly
- [ ] Text is centered and readable
- [ ] SPACE key advances to level
- [ ] Mouse click advances to level
- [ ] Pulsing animation works smoothly
- [ ] Scene transitions cleanly
- [ ] No memory leaks (listeners cleaned up)
- [ ] Works at different screen sizes

## Performance Notes

- Background image is loaded asynchronously to prevent blocking
- Scene uses proper cleanup to avoid memory leaks
- Overlay actor improves text readability without complex post-processing
- Minimal actors for optimal performance

## Future Enhancements

Potential improvements:
- Fade-in animation for text
- Parallax effect on background
- Particle effects (snow, embers)
- Sound effect on scene transition
- Alternative background images based on game progress

## Notes

- Scene completes the three-act narrative structure: Setup (Intro) → Confrontation (Tagline) → Resolution (Gameplay)
- The shift from blue tones (hope/cold) to red (anger/revenge) reinforces the emotional arc
- Using the loading screen background creates subconscious familiarity
- The two-line structure creates a powerful reveal moment
- Cheat codes (like 'boss') work during this scene
