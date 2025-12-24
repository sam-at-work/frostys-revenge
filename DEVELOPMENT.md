# Frosty's Revenge - Development Guide

## Project Setup

### Prerequisites
- Node.js (v18 or higher)
- pnpm (v8 or higher) - Install with `npm install -g pnpm`

### Installation

1. Install dependencies:
```bash
pnpm install
```

## Running the Game

### Development Mode
Run the game in development mode with hot-reloading:
```bash
pnpm dev
```

This will start a local development server at `http://localhost:3000` and automatically open it in your browser.

### Build for Production
Create an optimized production build:
```bash
pnpm build
```

The built files will be in the `dist/` directory.

### Preview Production Build
Preview the production build locally:
```bash
pnpm preview
```

## Project Structure

```
game/
├── src/
│   ├── main.ts           # Entry point
│   ├── config.ts         # Game configuration
│   ├── actors/           # Game entities (player, enemies, etc.)
│   ├── scenes/           # Game scenes (level, game over)
│   ├── powerups/         # Power-up implementations
│   └── resources/        # Asset loading
├── assets/               # Game assets (images, sounds)
├── index.html            # Main HTML file
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── vite.config.ts        # Vite build config
```

## Development Phases

- [x] Phase 1: Project Setup ✅
- [x] Phase 2: Player Character ✅
- [x] Phase 3: Level Design ✅
- [x] Phase 4: Enemies ✅
- [x] Phase 5: Boss Battle ✅
- [x] Phase 6: Power-ups & Lives ✅
- [x] Phase 7: Polish & Assets ✅
- [ ] Phase 8: Testing & Refinement

## Current Status

**Phase 7 Complete!** Visual polish and particle effects added:
- ✅ Excalibur.js installed and configured
- ✅ TypeScript configuration
- ✅ Vite build system
- ✅ Basic game initialization
- ✅ Scene structure (Level and Game Over scenes)
- ✅ Ground platform rendering
- ✅ Snowman player character with physics
- ✅ Movement controls (Arrow keys + WASD)
- ✅ Jumping mechanics
- ✅ Snowball shooting with spacebar
- ✅ Lives system
- ✅ Camera following player
- ✅ Multi-platform level design with gaps
- ✅ Elevated platforms for jumping variety
- ✅ Decorative pine trees (foreground and background)
- ✅ Falling snow particle effects
- ✅ Elf enemies with patrol AI
- ✅ Jump-on-head mechanic to defeat elves
- ✅ Snowball collision to defeat elves
- ✅ 14 elves placed throughout the level
- ✅ Santa boss at the end of the level
- ✅ Santa throws sparkly Christmas decorations
- ✅ Decorations follow arc trajectory
- ✅ Win condition when reaching past Santa
- ✅ Win scene with replay option
- ✅ Banana blocks (? blocks) placed throughout level
- ✅ Running banana power-up mechanic
- ✅ Invincibility state with visual transformation
- ✅ Power-up timer UI display
- ✅ Particle effects (elf defeat, snowball impact, sparkles)
- ✅ Gradient sky background
- ✅ Invincibility glow effect with particles
- ✅ Damage flash effect (red flash)
- ✅ Pulsing banana blocks with sparkles
- ✅ Running banana sparkle trail

### What's Working
- Player can move left/right with Arrow Keys or WASD
- Player can jump with Up Arrow or W key (fixed!)
- Player can shoot snowballs with Spacebar
- Snowballs fly in the direction player is facing
- Camera follows player as they move through the level
- Lives counter displays in top-left corner
- Player respawns after falling off the world
- Game Over scene triggers when all lives are lost
- Level spans ~5200 pixels with multiple platforms
- Platforms at different heights create platforming challenges
- Gaps between platforms require jumping
- Pine trees add visual atmosphere
- Snow particles fall continuously for winter theme
- Elves patrol back and forth on platforms
- Jump on elves from above to defeat them
- Shoot snowballs at elves to defeat them
- Touching an elf from the side causes damage
- Player bounces slightly when jumping on elves
- Santa appears at x=4900 near the end
- Santa throws golden decorations every 2 seconds
- Decorations arc through the air with gravity
- Decorations rotate and pulse for sparkly effect
- Touching decorations causes damage (unless invincible)
- Reach x=5100 to win the game
- Win scene displays with option to play again
- Jump under brown banana blocks to activate them
- Banana pops out and runs away when block is hit
- Chase and catch the banana for invincibility
- Player turns yellow during banana mode
- Timer shows remaining invincibility time
- Invincible player defeats elves on contact
- 4 banana blocks placed throughout the level
- Green particle burst when elves are defeated
- Blue/white particle burst when snowballs hit enemies
- Gold sparkles trail behind running bananas
- Banana blocks pulse and sparkle before being used
- Player flashes and glows during invincibility
- Red damage flash when taking damage
- Gradient sky effect (light to dark blue)

### Next Steps (Phase 8)
- Test all game mechanics thoroughly
- Balance difficulty and gameplay
- Fix any remaining bugs
- Cross-browser testing
- Performance optimization
- Optional: Add sprite assets to replace placeholder graphics
- Optional: Add sound effects and music

## Technology Stack

- **Game Engine**: Excalibur.js v0.29.0
- **Language**: TypeScript
- **Build Tool**: Vite
- **Browser Support**: Modern browsers with ES2020 support

## Troubleshooting

### Port already in use
If port 3000 is already in use, Vite will automatically try the next available port.

### TypeScript errors
Run `pnpm install` to ensure all type definitions are installed.

### Game doesn't load
Check the browser console for errors. Make sure all dependencies are installed with `pnpm install`.