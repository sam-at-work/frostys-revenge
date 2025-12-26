# Sound Effects Setup Guide for Frosty's Revenge 🔊

## Current Status

✅ Sound system is fully integrated into the game code
❌ Actual sound files need to be downloaded and placed in the project

## What's Already Done

All sound triggers are in place:
- ✅ Jump sound plays when player jumps
- ✅ Snowball throw sound plays when firing
- ✅ Snowball hit sound plays on impact (enemies or platforms)
- ✅ Enemy defeat sound plays when elf is defeated
- ✅ Power-up sound plays when collecting banana
- ✅ Player hurt sound plays when taking damage
- ✅ Block hit sound plays when bumping banana blocks
- ✅ Background music loops during gameplay
- ✅ Boss music switches when near Santa

## Quick Start: Get Sounds in 5 Minutes

### Option 1: Kenney.nl (Easiest - Public Domain)

1. **Download the Digital Audio Pack**
   - Go to: https://kenney.nl/assets/digital-audio
   - Click "Download" (it's completely free, no account needed)
   - Extract the ZIP file

2. **Pick Your Sounds**
   
   From the `Digital Audio/` folder, copy these files to `public/sounds/`:
   
   | Game Sound | Kenney File | Rename To |
   |------------|-------------|-----------|
   | Jump | `pepSound1.ogg` | `jump.mp3` |
   | Snowball Throw | `phaserUp1.ogg` | `snowball-throw.mp3` |
   | Snowball Hit | `explosionCrunch_000.ogg` | `snowball-hit.mp3` |
   | Enemy Defeat | `lowRandom.ogg` | `enemy-defeat.mp3` |
   | Power-up | `powerUp1.ogg` | `powerup.mp3` |
   | Player Hurt | `lowDown.ogg` | `player-hurt.mp3` |
   | Block Hit | `blipSelect.ogg` | `block-hit.mp3` |

3. **Convert OGG to MP3 (if needed)**
   - You can use OGG files directly (just rename .ogg to .mp3 in resources.ts)
   - Or convert online at: https://cloudconvert.com/ogg-to-mp3

### Option 2: Mix and Match from Multiple Sources

**For Sound Effects:**
- **Freesound.org** - Search "8bit jump", "retro shoot", "pixel hurt"
- **Mixkit.co** - Browse their game sound effects section
- **OpenGameArt.org** - Look for "platformer SFX"

**For Music:**
- **OpenGameArt.org** - Search "chiptune winter" or "retro platformer music"
- **Incompetech.com** - Free music (requires attribution)
- **FreePD.com** - Public domain music

## File Placement

All sound files must go in: `public/sounds/`

Required files:
```
public/sounds/
  ├── jump.mp3
  ├── snowball-throw.mp3
  ├── snowball-hit.mp3
  ├── enemy-defeat.mp3
  ├── powerup.mp3
  ├── player-hurt.mp3
  ├── block-hit.mp3
  ├── background-music.mp3
  └── boss-music.mp3
```

## After Adding Sounds

1. Make sure all 9 sound files are in `public/sounds/`
2. Restart your dev server: `npm run dev`
3. Play the game and test:
   - Press W/Up Arrow to jump → hear jump sound
   - Press Space to throw snowball → hear throw sound
   - Hit enemy/platform → hear impact sound
   - Collect banana power-up → hear powerup sound
   - Take damage → hear hurt sound

## Adjusting Volume

Sound volumes are set in the code. To adjust:

**Sound Effects** - Edit these files:
- `src/actors/player.ts` - Jump, throw, hurt sounds (0.4-0.6)
- `src/actors/snowball.ts` - Impact sound (0.5)
- `src/actors/elf.ts` - Defeat sound (0.5)
- `src/powerups/bananablock.ts` - Block hit sound (0.5)

**Music** - Edit `src/scenes/level.ts`:
```typescript
Resources.BackgroundMusic.volume = 0.3; // 0.0 to 1.0
Resources.BossMusic.volume = 0.4;
```

## Troubleshooting

**Sounds not playing?**
- ✓ Check browser console for 404 errors
- ✓ Verify filenames match exactly (case-sensitive)
- ✓ Make sure files are in `public/sounds/` not `src/sounds/`
- ✓ Try refreshing the page (hard refresh: Cmd+Shift+R or Ctrl+F5)

**Music not looping?**
- The loop and volume settings are in `src/scenes/level.ts`
- Check that the music files aren't corrupted

**Volume too loud/quiet?**
- Change the number in `.play(0.5)` - 0.0 is silent, 1.0 is full volume
- For music, adjust the `.volume` property

## No Sound Files? Game Still Works!

If you don't add sound files, the game will:
- ✓ Still run perfectly
- ✓ Show 404 errors in console (can be ignored)
- ✓ Be silent

The sound system gracefully handles missing files.

## Quick Test Without Downloading

Want to test the system first? Use text-to-speech or simple beeps:
1. Create silent MP3 files (1 second of silence)
2. Place them in `public/sounds/` with the correct names
3. Verify no 404 errors in console
4. Then replace with real sounds later

## Resources Summary

- **Kenney.nl** - https://kenney.nl/assets (Best for quick setup)
- **Freesound.org** - https://freesound.org/ (Huge library)
- **OpenGameArt.org** - https://opengameart.org/ (Good for music)
- **Mixkit** - https://mixkit.co/free-sound-effects/game/ (Easy to use)

---

**Ready to add sound?** Start with Kenney's Digital Audio pack - you'll have sounds in under 5 minutes! 🎮🔊