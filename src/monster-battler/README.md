# Monster Battler Game

A Mike Tyson's Punch-Out inspired game where players fight through 12 progressively harder monsters.

## Setup Instructions

### Windows
1. Open PowerShell or Git Bash
2. Navigate to the project directory: `cd path/to/jasonrundell2024`
3. Install dependencies: `npm install`
4. Run the development server: `npm run dev`
5. Navigate to `http://localhost:3000/monster-battler`

### macOS / Linux
1. Open Terminal
2. Navigate to the project directory: `cd path/to/jasonrundell2024`
3. Install dependencies: `npm install`
4. Run the development server: `npm run dev`
5. Navigate to `http://localhost:3000/monster-battler`

## Database Setup

1. Run the SQL schema in your Supabase SQL editor:
   - File: `src/lib/db/monster-battler-schema.sql`
   - This creates the `monster_battler_scores` table with RLS policies

2. The game will work without database setup (localStorage only), but logged-in users won't be able to sync scores.

## Sprite Assets

The game uses two sprite sheets:
- `monster-battler_hero_sprite.png` - Hero character sprites
- `monster-battler_monsters_sprite.png` - Monster sprites (12 monsters)

**Important**: These files need to be copied to `public/monster-battler/` for the game to work properly. They are currently located in `src/monster-battler/`.

## Game Controls

- **J** - Light Attack
- **K** - Heavy Attack
- **L** - Special Attack (requires full Focus gauge)
- **S** - Block (hold)
- **Arrow Keys** / **WASD** - Dodge

## Game Modes

- **Gauntlet**: Fight through all 12 monsters sequentially
- **Boss Rush**: All monsters back-to-back (unlocked after Gauntlet)
- **Endless Gauntlet**: Survive as long as possible
- **Tutorial**: Learn the basics

## Testing

Run tests with:
```bash
npm run test
```

Target coverage: ≥70% for core game systems (combat, storage, AI).

## Features

- ✅ Combat system with light/heavy attacks, blocks, dodges
- ✅ Combo system with multiplier
- ✅ Focus gauge for special attacks
- ✅ Stamina system
- ✅ Counter windows after successful blocks/dodges
- ✅ 12 unique monsters with different behaviors
- ✅ Monster phases (idle, telegraph, attack, vulnerable, enrage)
- ✅ Scoreboard with localStorage persistence
- ✅ Supabase sync for logged-in users
- ✅ Play history tracking
- ✅ Achievement system (framework ready)

## Architecture

- **types.ts**: TypeScript type definitions
- **constants.ts**: Game constants and monster configurations
- **game-engine.ts**: Core combat and game logic
- **monster-ai.ts**: Monster behavior and AI
- **storage.ts**: localStorage and Supabase persistence
- **components/**: React components for UI
  - `MonsterBattlerGame.tsx`: Main game component
  - `GameArena.tsx`: Battle arena with game loop
  - `GameHUD.tsx`: Health bars, Focus gauge, combo counter
  - `GameLobby.tsx`: Main menu and mode selection
  - `BattleResult.tsx`: Post-battle results screen
  - `Scoreboard.tsx`: Leaderboard display

