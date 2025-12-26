# Intro Scene Documentation

## Overview

The game now features a dramatic backstory/intro scene that displays before the main gameplay begins. This scene sets up the narrative context for Frosty's quest for revenge against Santa Claus.

## Backstory Text

```
In the future, Earth's population exploded.
Too many children. Not enough presents.

Desperate to keep Christmas alive, Santa Claus made a terrible choice —
he enslaved the Snowmen, forcing them to work endlessly in frozen factories.

But Frosty the Snowman managed to escape.

Now armed with snowballs and pure determination, Frosty battles through Santa's Elves on a path straight to Santa himself.

This isn't about saving Christmas.

It's about revenge.
```

## Visual Design

### Theme
- **Dark winter night aesthetic** - Deep blue background (#0a1628)
- **Christmas color scheme** - Reds, whites, and winter blues
- **Dramatic typography** - Highlighted key phrases in different colors

### Color Highlights
- **Red (#ff4444)** - Title and "revenge" for dramatic impact
- **Orange (#ffaa00)** - "enslaved the Snowmen" for emphasis on the injustice
- **Bright Blue (#88ddff)** - "Frosty the Snowman" to highlight the hero
- **Light Blue-White (#d4e8f0)** - General narrative text
- **White** - Snow ground and decorative elements

### Visual Effects
1. **Falling snowflakes** - 15 animated snowflakes drifting down slowly
2. **Pulsing text** - "Press SPACE or Click to Begin" pulses to draw attention
3. **Snow ground** - Decorative snow layer at the bottom
4. **Text shadows** - All text has subtle shadows for depth

## User Interaction

### Controls
- **SPACE** - Skip intro and start the game
- **Mouse Click** - Skip intro and start the game

Both inputs work simultaneously for maximum accessibility.

## Technical Implementation

### File Location
- **Scene file**: `src/scenes/intro.ts`
- **Scene name**: `"intro"`

### Integration
The intro scene is registered in `main.ts` and is now the first scene loaded when the game starts:
```typescript
this.addScene("intro", new IntroScene());
this.goToScene("intro");
```

### Scene Flow
```
Game Start → Intro Scene → (Space/Click) → Level Scene → (Win/Death) → Win/GameOver Scene
```

## Features

### Dynamic Text Sizing
Different lines have different font sizes based on narrative importance:
- Title: 56px
- "revenge": 32px (largest for impact)
- "Frosty the Snowman": 26px
- Standard narrative: 24px

### Animation
- Snowflakes continuously fall and reset when reaching the bottom
- Instruction text opacity pulses between 50-100% every ~600ms
- Smooth transitions maintain immersion

### Cleanup
Proper event listener cleanup in `onDeactivate()` prevents memory leaks:
- Keyboard listener removed
- Mouse click listener removed

## Customization

To modify the backstory text, edit the `storyLines` array in `intro.ts`:
```typescript
const storyLines = [
  "Your story line here...",
  // Add more lines
];
```

To adjust visual styling:
- **Background color**: Change `backgroundColor` in `onInitialize()`
- **Text colors**: Modify color values in the `forEach` loop
- **Snowflake count**: Change the loop limit in `createSnowflakes()`
- **Animation speed**: Adjust `pulseTime` divisor for text pulsing

## Notes

- The intro can be skipped immediately - players aren't forced to read it
- Text is center-aligned for visual balance
- The scene uses the same pixel art font as the rest of the game ("Jacquard 12")
- Cheat codes can be entered during the intro screen as well