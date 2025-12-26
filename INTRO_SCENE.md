# Intro & Tagline Scene Documentation

## Overview

The game now features a two-part narrative sequence before the main gameplay begins:
1. **Intro Scene** - Displays the backstory explaining Frosty's situation
2. **Tagline Scene** - A dramatic reveal with the final two lines over the game's background image

This sequence sets up the narrative context for Frosty's quest for revenge against Santa Claus.

## Intro Scene Text

```
In the future, Earth's population exploded.
Too many children. Not enough presents.

Desperate to keep Christmas alive,
Santa Claus made a terrible choice —
he enslaved the Snowmen, forcing them
to work endlessly in frozen factories.

But Frosty the Snowman managed to escape.

Now armed with snowballs and
pure determination, Frosty battles through
Santa's Elves on a path straight
to Santa himself.
```

## Tagline Scene Text

```
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

### Intro Scene Controls
- **SPACE** - Continue to tagline scene
- **Mouse Click** - Continue to tagline scene

### Tagline Scene Controls
- **SPACE** - Start the game
- **Mouse Click** - Start the game

Both inputs work simultaneously for maximum accessibility.

## Technical Implementation

### File Locations
- **Intro scene file**: `src/scenes/intro.ts`
- **Intro scene name**: `"intro"`
- **Tagline scene file**: `src/scenes/tagline.ts`
- **Tagline scene name**: `"tagline"`

### Integration
Both scenes are registered in `main.ts`:
```typescript
this.addScene("intro", new IntroScene());
this.addScene("tagline", new TaglineScene());
this.goToScene("intro");
```

### Scene Flow
```
Game Start → Intro Scene → (Space/Click) → Tagline Scene → (Space/Click) → Level Scene → (Win/Death) → Win/GameOver Scene
```

## Features

### Intro Scene Features

#### Dynamic Text Sizing
Different lines have different font sizes based on narrative importance:
- Title: 48px
- "Frosty the Snowman": 22px
- "revenge" (on tagline scene): 56px
- Standard narrative: 20px

#### Visual Effects
- Snowflakes continuously fall and reset when reaching the bottom
- Dark blue winter night background
- Snow ground at the bottom
- Instruction text opacity pulses
- Smooth transitions maintain immersion

### Tagline Scene Features

#### Background
- Uses the same background image as the loading screen (`/homescreen/image.jpg`)
- Dark overlay (60% opacity) for text readability
- Creates dramatic cinematic effect

#### Typography
- "This isn't about saving Christmas." - 32px, light blue
- "It's about revenge." - 56px, dramatic red
- Both lines centered with prominent shadows

#### Animation
- Pulsing instruction text
- Clean, focused presentation

### Cleanup
Both scenes properly clean up event listeners in `onDeactivate()` to prevent memory leaks:
- Keyboard listener removed
- Mouse click listener removed
- Scene actors cleared (tagline scene)

## Customization

### Intro Scene Customization

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

### Tagline Scene Customization

To modify the tagline text, edit the Label text in `tagline.ts`:
```typescript
text: "Your tagline here..."
```

To adjust visual styling:
- **Background image**: Change the path in `new ImageSource("/homescreen/image.jpg")`
- **Overlay darkness**: Adjust the alpha value in `Color.fromRGB(0, 0, 0, 0.6)`
- **Text colors**: Modify `color` values in the Label definitions
- **Text sizes**: Adjust `size` values in the Font definitions

## Notes

- Both intro and tagline screens can be skipped immediately - players aren't forced to read them
- Text is center-aligned for visual balance
- Both scenes use the same pixel art font as the rest of the game ("Jacquard 12")
- Cheat codes can be entered during both intro and tagline screens
- The tagline scene creates a cinematic transition using the game's main background image
- Total time through both scenes (if reading): ~10-15 seconds
- Can skip both in under 2 seconds by pressing space twice