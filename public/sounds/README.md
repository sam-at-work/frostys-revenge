# Sound Effects for Frosty's Revenge

This directory contains all sound effects and music for the game.

## Required Sound Files

Place the following sound files in this directory:

### Sound Effects (MP3 format recommended)

1. **jump.mp3** - Light "boing" or hop sound when player jumps
2. **snowball-throw.mp3** - Whoosh sound when throwing a snowball
3. **snowball-hit.mp3** - Soft explosion/poof sound when snowball hits something
4. **enemy-defeat.mp3** - Satisfying pop/defeat sound when enemy is defeated
5. **powerup.mp3** - Positive ding/chime when collecting banana power-up
6. **player-hurt.mp3** - Ouch/hurt sound when player takes damage
7. **block-hit.mp3** - Boing/bump sound when hitting a banana block from below
8. **background-music.mp3** - Cheerful winter/holiday music (looping)
9. **boss-music.mp3** - More intense music for Santa boss battle (looping)

## Where to Download Free Game Sounds

### 1. **Kenney.nl** (Recommended - Public Domain)
- URL: https://kenney.nl/assets?q=audio
- License: CC0 (Public Domain) - Use freely!
- Collections to check:
  - "Digital Audio" - great for jumps, hits, powerups
  - "Interface Sounds" - good for UI and menu sounds
  - "Impact Sounds" - perfect for snowball hits

### 2. **Freesound.org**
- URL: https://freesound.org/
- Search terms to try:
  - "jump boing"
  - "throw whoosh"
  - "snow impact"
  - "powerup"
  - "8bit hurt"
  - "block hit"
  - "winter music"
- Filter by: Creative Commons licenses
- Make sure to check the license requirements!

### 3. **OpenGameArt.org**
- URL: https://opengameart.org/art-search-advanced?keys=&field_art_type_tid%5B%5D=13
- Great for music tracks
- Most content is CC-BY or CC0
- Search: "platformer music", "winter theme", "retro game music"

### 4. **Mixkit**
- URL: https://mixkit.co/free-sound-effects/game/
- License: Free for commercial and personal use
- Good selection of game sound effects

### 5. **ZapSplat** (Free with attribution)
- URL: https://www.zapsplat.com/
- Requires free account
- Huge library of sounds

## Tips for Finding Good Sounds

- **For jump.mp3**: Search "boing", "hop", "spring"
- **For snowball-throw.mp3**: Search "whoosh", "throw", "swish"
- **For snowball-hit.mp3**: Search "poof", "soft explosion", "snow impact", "pillow hit"
- **For enemy-defeat.mp3**: Search "pop", "defeat", "enemy death"
- **For powerup.mp3**: Search "coin", "pickup", "powerup", "chime"
- **For player-hurt.mp3**: Search "ouch", "hurt", "damage"
- **For block-hit.mp3**: Search "block", "bump", "boing"
- **For music**: Search "8bit winter", "chiptune holiday", "retro platformer", "pixel game music"

## Quick Start: Kenney's Digital Audio Pack

The easiest way to get started:

1. Go to: https://kenney.nl/assets/digital-audio
2. Download the entire pack (it's free!)
3. Extract the ZIP file
4. Browse through the sounds and pick ones that fit:
   - `pepSound1.ogg` or `threeTone1.ogg` → jump.mp3
   - `powerUp1.ogg` → powerup.mp3
   - `lowDown.ogg` or `lowThreeTone.ogg` → player-hurt.mp3
   - `phaserUp1.ogg` → snowball-throw.mp3
   - `explosionCrunch_000.ogg` → snowball-hit.mp3
   - `lowRandom.ogg` → enemy-defeat.mp3
   - `blipSelect.ogg` → block-hit.mp3

5. Convert .ogg files to .mp3 if needed (or update the code to use .ogg)

## File Format Notes

- **MP3** is recommended for best browser compatibility
- **OGG** and **WAV** are also supported by Excalibur.js
- Keep file sizes small (under 500KB for sound effects)
- Music files can be larger (1-3MB is fine)

## Once You've Downloaded Sounds

1. Place all sound files in this `public/sounds/` directory
2. Make sure the filenames match exactly what's in `resources.ts`
3. Restart your dev server (`npm run dev`)
4. The sounds should automatically load and play in the game!

## Testing Sounds

Once files are in place, test them:
- Jump = Press W or Up Arrow
- Throw snowball = Press Spacebar
- Hit enemy/platform = Throw snowball at target
- Get powerup = Jump into banana block, collect banana
- Get hurt = Touch an elf without jumping on them

Enjoy adding sound to Frosty's Revenge! 🎮🔊❄️