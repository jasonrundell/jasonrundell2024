## Monster Battler Game Plan

### Vision

Create a Mike Tyson's Punch-Out inspired experience where one hero fights a
lineup of 12 progressively harder monsters drawn from
`monster-battler_hero_sprite.png` and `monster-battler_monsters_sprite.png`.
Each encounter mimics a boxing bout with telegraphed moves, counter windows, and
escalating phases.

### Core Loop

- Face the next monster in a Mike Tyson’s Punch-Out–style vertical arena:
  monster occupies the top of the screen while the hero stands on the bottom,
  both trading telegraphed attacks.
- Controls include light attack, heavy attack, block, dodge (with direction),
  and a charged special earned during runs.
- Successful blocks or dodges create a “counter window” to punish, while dodging
  and landing hits fills the “Focus” gauge for specials.
- Winning increases score, logs the battle in play history, and unlocks
  interstitial upgrades/prep before the next fight.

### Familiar Gameplay Features

- **Combo & Stamina System:** Chaining hits increases multiplier while draining
  stamina; stamina regenerates gradually, preventing button spamming.
- **Special Abilities:** Focus gauge builds via defensive play; using a special
  triggers a short cinematic and heavier damage.
- **Difficulty Phases:** Each monster introduces unique tells, new hurtboxes,
  and a final enrage phase that changes patterns (teleporting, armor plating,
  etc.).
- **Rewards & Upgrades:** After each win, the hero can equip one passive (extra
  block, faster Focus gain, minor heal) or swap to new special moves.
- **Ranking Board:** Local “recent run” view plus best score/time, encouraging
  replay and “Boss Rush”/“Endless Gauntlet” runs.
- **Tutorial/Practice Mode:** Optional first fight that explains dodging,
  blocking, Focus management, and counters.

### Progression & Content

- 12 monster archetypes, each with a distinct palette, sprite, and phase-based
  behavior (pink spider → neon tank → armored knight → neon boss).
- Unlock “Boss Rush” (all 12 in sequence) and “Endless Gauntlet” (score-focused
  survival) once the main gauntlet is cleared.
- Achievement system for milestones (perfect run, no-block run, specials-only,
  etc.).

### Persistence & Storage

- **LocalStorage:** Always store score entries (total score, streaks, completion
  time) and play history (damage breakdown, special usage, counters).
  Non-logged-in players see only this local archive.
- **Account Sync:** When logged in, sync the same data with the backend after
  each fight/save checkpoint. LocalStorage mirror ensures offline continuity;
  server sync occurs asynchronously but errors throw/log (no silent failovers).
- **Data Validation:** Throw/log errors whenever required data is missing (hero
  stats, monster config, account state) instead of showing fallback values.

### UI & UX Notes

- HUD shows hero/monster health, Focus gauge, combo multiplier, active phase
  indicator, and monster name.
- Post-fight results display accuracy, total dodges, longest combo, special
  usage, and earned reward.
- Controls widget helps players remember key bindings (keyboard/gamepad);
  responsive canvas sizes for desktop and tablet.

### Audio & Visual

- Use punchy audio cues for hits, blocks, Focus charge, and special activation;
  music intensifies per monster.
- Pixelated neon aesthetic matching provided sprites with glow effects for Focus
  and specials.

### Testing & Platform Instructions

- Target **≥70% unit test coverage** for:
  - Fight resolution (damage, hit detection, counters).
  - Storage manager (localStorage reads/writes, account sync path).
  - Monster phase transitions (phase timers, boss patterns).
- Integration tests for persistence, run completion, and scoring.
- Manual QA on Windows, macOS, Linux; note gamepad behavior and localStorage
  limits.
- **Setup:** Install dependencies via `npm install` (or package manager). Run
  `npm run dev` for local play, `npm run test` for coverage.

### Next Steps

1. Define data models for hero stats, monster behaviors, and scoreboard entries.
2. Build hero input/animation (attacks, block, dodge, focus mechanics).
3. Implement monster AI/phases with telegraphed tells.
4. Create storage layer for localStorage + auth-aware sync.
5. Craft UI for lobby, scoreboard, and post-fight recap; add thorough tests.
