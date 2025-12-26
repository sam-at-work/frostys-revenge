# Sound Mapping Reference - Frosty's Revenge 🔊

## Successfully Mapped Sounds

All sound effects from the Kenney Digital Audio pack have been mapped and are ready to use!

### Sound Effect Mappings

| Game Action | Kenney File | Description |
|-------------|-------------|-------------|
| **Jump** | `pepSound1.ogg` | Light bouncy sound when player jumps |
| **Snowball Throw** | `phaserUp1.ogg` | Upward whoosh when firing snowball |
| **Snowball Hit** | `spaceTrash1.ogg` | Crunchy impact sound on collision |
| **Enemy Defeat** | `lowRandom.ogg` | Low-pitched defeat sound for elves |
| **Power-up Collect** | `powerUp1.ogg` | Classic power-up chime |
| **Player Hurt** | `lowDown.ogg` | Downward tone when taking damage |
| **Block Hit** | `phaseJump1.ogg` | Bouncy sound when bumping banana blocks |

### Music Placeholders (Disabled)

| Music Track | Placeholder File | Status |
|-------------|------------------|--------|
| **Background Music** | `threeTone1.ogg` | ⚠️ Disabled (too short for music) |
| **Boss Music** | `laser9.ogg` | ⚠️ Disabled (too short for music) |

## Current Status

✅ **All sound effects are working!**
- Jump sounds play perfectly
- Snowball throw and impact sounds work great
- Enemy defeat sounds are satisfying
- Power-up collection has a nice chime
- Damage sounds provide good feedback
- Block hits feel responsive

❌ **Music is temporarily disabled**
- The Kenney pack only has short sound effects, not full music tracks
- Background music code is commented out until you add real music
- Boss music switching is also disabled

## How to Test

Run the game and try these actions:

1. **Press W/Up Arrow** → Hear `pepSound1.ogg` (jump)
2. **Press Space** → Hear `phaserUp1.ogg` (throw)
3. **Hit enemy/platform** → Hear `spaceTrash1.ogg` (impact)
4. **Defeat an elf** → Hear `lowRandom.ogg` (defeat)
5. **Collect banana** → Hear `powerUp1.ogg` (power-up)
6. **Get hit by elf** → Hear `lowDown.ogg` (hurt)
7. **Bump banana block** → Hear `phaseJump1.ogg` (block hit)

## Adding Real Music (Optional)

If you want background music, download looping music tracks:

### Where to Get Music

1. **OpenGameArt.org** - Search "chiptune platformer"
2. **Incompetech.com** - Free music with attribution
3. **FreePD.com** - Public domain music

### How to Add Music

1. Download 2 music files:
   - `background-music.ogg` (cheerful, looping)
   - `boss-music.ogg` (intense, looping)

2. Place in `public/sounds/`

3. Update `src/resources/resources.ts`:
   ```typescript
   BackgroundMusic: new Sound("/sounds/background-music.ogg"),
   BossMusic: new Sound("/sounds/boss-music.ogg"),
   ```

4. Uncomment music code in `src/scenes/level.ts`:
   - Uncomment lines in `onActivate()` method
   - Uncomment lines in `onDeactivate()` method
   - Uncomment lines in `onPreUpdate()` method
   - Uncomment the import for Resources
   - Uncomment the music-related variables

## Alternative Sound Mappings

If you want to try different sounds from the Kenney pack, here are some alternatives:

### Jump Alternatives
- `pepSound2.ogg` - Higher pitched
- `phaseJump2.ogg` - More "boing" sound
- `threeTone1.ogg` - Musical jump

### Throw Alternatives
- `phaserUp2.ogg` - Longer whoosh
- `laser1.ogg` - Laser-like throw
- `zap1.ogg` - Quick zap sound

### Impact Alternatives
- `spaceTrash2.ogg` - Different crunch
- `zap2.ogg` - Electric impact
- `lowThreeTone.ogg` - Tonal impact

### Power-up Alternatives
- `powerUp2.ogg` through `powerUp12.ogg` - Various chimes
- `highUp.ogg` - Upward arpeggio
- `threeTone2.ogg` - Three-tone chime

### Hurt Alternatives
- `lowThreeTone.ogg` - More dramatic
- `phaserDown1.ogg` - Downward slide
- `highDown.ogg` - High to low tone

## Volume Adjustments

Current volume levels (0.0 = silent, 1.0 = full):

- Jump: 0.5
- Throw: 0.4
- Hit: 0.5
- Defeat: 0.5
- Power-up: 0.6
- Hurt: 0.5
- Block Hit: 0.5

To adjust, edit the `.play()` calls in:
- `src/actors/player.ts`
- `src/actors/snowball.ts`
- `src/actors/elf.ts`
- `src/powerups/bananablock.ts`

## Summary

🎮 **The game now has full sound effects!**
- 7 different sound effects mapped and working
- All using high-quality Kenney Digital Audio sounds
- Music system ready but disabled (waiting for music tracks)

**Your game sounds great! Just add music tracks later if you want. 🎵**