/**
 * Game Configuration Constants
 * Frosty's Revenge - A Super Mario-inspired platformer
 */

export const Config = {
  // Game settings
  DISABLE_BANANA_SONG: false, // If true, normal music continues during banana mode

  // Game window settings
  GAME_WIDTH: 800,
  GAME_HEIGHT: 600,

  // Physics constants
  GRAVITY: 1200,

  // Player settings
  PLAYER: {
    WIDTH: 50,
    HEIGHT: 100,
    MOVE_SPEED: 200,
    JUMP_VELOCITY: -650,
    MAX_LIVES: 3,
    SNOWBALL_COOLDOWN: 300, // milliseconds
  },

  // Snowball settings
  SNOWBALL: {
    WIDTH: 16,
    HEIGHT: 16,
    SPEED: 400,
    LIFETIME: 2000, // milliseconds
  },

  // Elf enemy settings
  ELF: {
    WIDTH: 38,
    HEIGHT: 64,
    MOVE_SPEED: 80,
    PATROL_DISTANCE: 150,
  },

  // Santa boss settings
  SANTA: {
    WIDTH: 80,
    HEIGHT: 172,
    MOVE_SPEED: 60,
    THROW_INTERVAL: 2000, // milliseconds
    DECORATION_SPEED: 250,
    MAX_HEALTH: 20, // Number of snowball hits required to defeat Santa
  },

  // Power-up settings
  BANANA: {
    WIDTH: 24,
    HEIGHT: 24,
    DURATION: 10000, // 10 seconds like Mario's star
  },

  // Level settings
  LEVEL: {
    GROUND_HEIGHT: 64,
    TILE_SIZE: 32,
    LENGTH: 5200, // Extended to accommodate full level with boss area
  },

  // Colors (for placeholder graphics)
  COLORS: {
    GROUND: "#E8F4F8",
    SNOWMAN: "#FFFFFF",
    ELF: "#228B22",
    SANTA: "#DC143C",
    SNOWBALL: "#ADD8E6",
    BANANA: "#FFE135",
    SKY: "#87CEEB",
    DECORATION: "#FFD700",
  },
} as const;
