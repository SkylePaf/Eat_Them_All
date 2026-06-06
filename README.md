# Eat Them All

> Eat every cube on the map — without getting caught.

**8 worlds · 40 levels · 8 enemy types · 7 powerups**  
Built entirely in vanilla HTML/CSS/JS — no framework, no game engine.

[▶ Play Online](https://skylepaf.github.io/Eat_Them_All)

---

## Screenshots

| Main Menu | Gameplay — World 2 |
|---|---|
| ![menu](screenshots/menu.png) | ![world2](screenshots/world2.png) |

| World 5 — Explosion bonus | World 8 — Wall bonus |
|---|---|
| ![world5](screenshots/world5.png) | ![world8](screenshots/world8.png) |

---

## Gameplay

You control a cursor on a grid. Goal: eat every cube before the enemies catch you.

- Move your character with the mouse
- Sprint to outrun enemies
- Collect **powerups** to survive the chaos of later worlds
- Each world introduces new enemy behaviors and a larger, denser grid

---

## Features

- **8 worlds × 5 levels** — 40 hand-crafted levels
- **8 distinct enemy types** — each world brings a new AI behavior
- **7 powerups** — Laser, Explosion, Teleportation, Wall...
- **Dynamic grid scaling** — grid size grows progressively across worlds and levels
- **Performance tracking** — personal best recorded per level
- **Accessibility settings** — Light Mode, independent Music/SFX volume sliders
- **Adaptive resolution** — zoom factor auto-calculated to fit any screen

---

## Architecture

No game engine. No framework. Everything built from scratch:

```
├── index.html          # game shell — one HTML table = the entire grid
├── main.js             # game loop, grid generation, input, scoring
├── enemiesScript.js    # 8 enemy AIs, movement patterns, collision
├── bonusScript.js      # 7 powerup systems (laser, teleport, explosion, wall...)
└── levelsData.json     # all 40 levels defined as pure data
```

The grid is an HTML `<table>`. Every cell = one cube. Movement, collision and rendering are handled entirely in vanilla JS.

Levels are **fully data-driven** — a new level is just a JSON entry:

```json
"lvl1": {
    "gameMap": {
        "size": 9,
        "gameScale": [1, 16]
    },
    "player": {
        "pos": { "x": 3, "y": 3 },
        "size": 1,
        "color": 0
    },
    "gameMapHazards": {}
}
```

Adding a world = adding a dictionary in the JSON. The engine does the rest.

---

## Controls

| Action | Keys |
|--------|------|
| Move | <!-- TODO --> |
| Sprint | SHIFT or Right Click |
| Laser bonus | SHIFT + CTRL |
| <!-- TODO --> | <!-- TODO --> |

---

## Stack

`HTML` `CSS` `JavaScript` — zero dependencies, runs in any browser.  
Packaged as a desktop app with [Electron](https://www.electronjs.org/).

---

## Credits

Sound effects adapted from **Undertale** (Toby Fox) and **Driverhead**.  
Code, level design and visuals by **SkylePaf**.
