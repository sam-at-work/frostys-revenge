# Frosty's Revenge - Development Plan

## Project Overview
A Super Mario-inspired 2D platformer game using the Excalibur.js framework where players control a snowman character fighting elves and facing Santa as the final boss.

## Game Features

### Core Gameplay
1. **Player Character**: Snowman with Mario-like movement mechanics
   - Left/Right movement
   - Jumping mechanics
   - Snowball throwing ability (always available, no power-up needed)
   
2. **Enemies**:
   - Elves (basic enemies)
   - Can be defeated by jumping on them OR hitting them with snowballs
   
3. **Boss Battle**:
   - Santa Claus at the end of the level
   - Throws sparkly Christmas tree decorations (similar to Bowser's axes)
   - Must get past him to finish the game

4. **Power-ups**:
   - Super Banana (equivalent to Mario's Super Star)
   - Grants temporary invincibility
   - Transforms player into a banana visually

5. **Lives System**:
   - Similar to Mario
   - Game over when all lives are lost
   - Restart from beginning of level

### Controls
- **Arrow Keys** OR **WASD**: Movement (left, right, up/jump)
- **Spacebar**: Shoot snowballs

### Visual Elements
- Snow-covered pine trees background
- Santa flying in the sky with his reindeer
- Winter/Christmas theme throughout

## Technical Architecture

### Project Structure
```
game/
├── src/
│   ├── main.ts           # Entry point, game initialization
│   ├── config.ts         # Game configuration constants
│   ├── actors/
│   │   ├── player.ts     # Snowman player character
│   │   ├── elf.ts        # Elf enemy
│   │   ├── santa.ts      # Santa boss
│   │   └── snowball.ts   # Projectile
│   ├── scenes/
│   │   ├── level.ts      # Main level scene
│   │   └── gameover.ts   # Game over scene
│   ├── powerups/
│   │   └── banana.ts     # Super banana power-up
│   └── resources/
│       └── resources.ts  # Asset loading and management
├── assets/
│   ├── images/
│   │   ├── snowman.png
│   │   ├── elf.png
│   │   ├── santa.png
│   │   ├── snowball.png
│   │   ├── banana.png
│   │   ├── background.png
│   │   ├── ground.png
│   │   ├── decoration.png
│   │   └── pine-tree.png
│   └── sounds/
│       ├── jump.wav
│       ├── throw.wav
│       ├── hit.wav
│       └── powerup.wav
├── index.html
├── package.json
└── tsconfig.json
```

### Development Phases

#### Phase 1: Project Setup ✅
- [x] Initialize npm project
- [x] Install Excalibur.js and dependencies
- [x] Set up TypeScript configuration
- [x] Create basic HTML file
- [x] Set up build system (Vite)
- [x] Create basic game initialization

#### Phase 2: Player Character ✅
- [x] Implement snowman character class
- [x] Add movement controls (arrow keys + WASD)
- [x] Implement jumping mechanics
- [x] Add gravity and collision detection
- [x] Implement snowball shooting on spacebar
- [x] Add animation states (idle, walk, jump) - using placeholder rectangles

#### Phase 3: Level Design
- [ ] Create platform/ground tiles
- [ ] Design single level layout
- [ ] Add collision boundaries
- [ ] Implement camera following player
- [ ] Add background layers (parallax if time permits)
- [ ] Place decorative elements (pine trees)

#### Phase 4: Enemies
- [ ] Implement Elf enemy class
- [ ] Add basic AI (patrol/movement)
- [ ] Implement jump-on-head defeat mechanism
- [ ] Implement snowball collision/defeat
- [ ] Add elf spawning at designated locations
- [ ] Add death animations

#### Phase 5: Boss Battle
- [ ] Implement Santa boss class
- [ ] Position Santa at end of level
- [ ] Implement decoration throwing pattern
- [ ] Add boss collision detection
- [ ] Create defeat condition (reach past Santa OR defeat him)
- [ ] Add boss animations

#### Phase 6: Power-ups & Lives
- [ ] Implement Super Banana power-up
- [ ] Add invincibility state
- [ ] Add visual transformation (banana form)
- [ ] Implement lives system
- [ ] Add UI for lives counter
- [ ] Implement game over condition

#### Phase 7: Polish & Assets
- [ ] Create/source all sprite assets
- [ ] Add background with Santa & reindeer in sky
- [ ] Add sound effects
- [ ] Add particle effects (snow, sparkles)
- [ ] Add game over screen
- [ ] Add win screen
- [ ] Optimize performance

#### Phase 8: Testing & Refinement
- [ ] Test all game mechanics
- [ ] Balance difficulty
- [ ] Fix bugs
- [ ] Cross-browser testing
- [ ] Performance optimization

## Technical Considerations

### Excalibur.js Integration
- Use latest stable version of Excalibur.js
- Leverage built-in physics engine for collisions
- Use TileMap for level design if applicable
- Utilize Scene management for different game states

### Asset Management
- Use Excalibur's Resource Loader
- Implement sprite sheets for animations
- Consider asset size for web performance

### Game Physics
- Gravity constant (similar to Mario feel)
- Jump velocity and height
- Movement speed and acceleration
- Projectile physics

## Questions for Review

1. **Asset Creation**: Should I use placeholder graphics initially (colored rectangles/circles) or would you prefer to provide actual sprite assets before development begins?

Answer: placeholders initially, but later i will ask you to create actual sprite assets

2. **Santa Boss Mechanics**: How should Santa be defeated? Options:
   - Just get past him (run to the right side)
   - Hit him with X number of snowballs
   - Both options available
   - Invulnerable (only avoidance challenge)
   
Answer: Just get past him (run to the right side)

3. **Level Length**: How long should the level be? (e.g., 3x screen width, 5x screen width, etc.)

Answer: 5x screen width

4. **Power-up Duration**: How long should the Super Banana invincibility last? (e.g., 10 seconds like Mario's star?)

Answer: 10 seconds

5. **Difficulty**: 
   - How many lives should the player start with?
   - How many elves should be in the level?
   - Should there be pits/holes the player can fall into?
   
Answer: Similar to Mario's Difficulty. 3 lives, 12 elves, include pits/holes.

6. **Score System**: Should there be a score system, or just completion-based?

Answer: Completion-based

7. **Build Tool Preference**: Would you prefer Vite, Webpack, or Parcel for the build system? (I recommend Vite for modern dev experience)

Use Vite

8. **Sound/Music**: Should I include background music, or just sound effects?

Include Christmas themed background music

9. **Banana Transformation**: When transformed into a banana, should the player:
   - Just look different but move the same?
   - Have enhanced abilities (faster, higher jump)?
   - Automatically defeat enemies on contact?
   
Answer: The same as when you get a super star in mario.

10. **Decoration Projectiles**: Should Santa's decorations:
    - Follow an arc pattern (like Bowser's axes)?
    - Go straight?
    - Be destroyable with snowballs?
    
Answer: Exactly like bowser - Follow an arc pattern (like Bowser's axes).

## Estimated Timeline
- Phase 1-2: 2-3 hours
- Phase 3-4: 3-4 hours  
- Phase 5-6: 2-3 hours
- Phase 7-8: 2-4 hours (depends on asset creation)

**Total: ~10-15 hours of development**

## Success Criteria
- ✅ Playable from start to finish in web browser
- ✅ Responsive controls (arrow keys, WASD, spacebar)
- ✅ All core mechanics working (jump, shoot, defeat enemies)
- ✅ Boss encounter functional
- ✅ Lives/game over system working
- ✅ Power-up system working
- ✅ Visually cohesive Christmas/winter theme
