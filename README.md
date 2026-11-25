# Berlin Life — Web Game

An original, browser-based 3D city game built on the existing Berlin Life project. It uses procedural Three.js models and a static-file layout for Vercel; it has no build step or runtime API.

## Run locally

Serve this directory over HTTP (ES modules do not run from `file://`):

```sh
python -m http.server 8000
```

Open `http://localhost:8000`.

## Controls

- WASD: move; Shift: run; Ctrl: crouch; Space: jump or handbrake
- Hold and drag the left mouse button: look around
- F: enter/exit a car; M: map and waypoint
- E: talk/interact; B: shop; K: save; P: pause
- 0–3: holster or choose a game weapon; X or hold mouse: fire; R: reload
- Y changes weather; N advances time; V toggles first-person; F3 shows diagnostics
- Space or Esc skips a cinematic

## Included systems

- Twelve linked story objectives with an intro and outro camera timeline for each
- Seven named, interactable characters with dialogue choices stored in the local save
- Three selectable finale outcomes, a safe-flat repair objective, city driving, traffic, pursuits, weather, a map, and optional activities
- Articulated procedural characters near the player and lightweight pedestrian models at mid distance; distant traffic and pedestrians are culled from rendering
- Low, Medium, High, and Ultra graphics choices; F3 displays FPS, recent frame time, draw calls, triangle count, visible actor counts, and available JS heap information
- Three.js r128 is bundled locally in `vendor/three.min.js`, so gameplay does not depend on a third-party CDN

Saves and graphics choices use browser `localStorage` on the current device.

## Deploy to Vercel

Use the repository root as the output directory. The site is static; leave the build command empty. Pushing to `main` triggers the connected Vercel production deployment.

## Current scope

This is a compact procedural browser game, not an AAA production. Characters are original low-poly procedural models with limited limb animation; dialogue is subtitled, with no recorded voice acting or facial animation. Buildings have solid exteriors and one kiosk interior; most buildings cannot be entered. Performance readings are measured in the browser and vary by device.
