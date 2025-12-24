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
- [ ] Phase 2: Player Character
- [ ] Phase 3: Level Design
- [ ] Phase 4: Enemies
- [ ] Phase 5: Boss Battle
- [ ] Phase 6: Power-ups & Lives
- [ ] Phase 7: Polish & Assets
- [ ] Phase 8: Testing & Refinement

## Current Status

**Phase 1 Complete!** The project is now set up with:
- ✅ Excalibur.js installed and configured
- ✅ TypeScript configuration
- ✅ Vite build system
- ✅ Basic game initialization
- ✅ Scene structure (Level and Game Over scenes)
- ✅ Ground platform rendering

### What's Working
- Basic game window renders with sky-blue background
- Ground platform visible at the bottom
- Game runs in browser

### Next Steps (Phase 2)
- Implement snowman player character
- Add movement controls (Arrow keys + WASD)
- Implement jumping mechanics
- Add snowball shooting with spacebar

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