# Berlin Life Web

A multi-file Vercel-ready build of the existing Berlin Life browser game.

## Run locally

Serve this folder with any static web server (ES modules need HTTP):

```sh
python -m http.server 8000
```

Open http://localhost:8000. Three.js r128 is bundled in `vendor/three.min.js`, so the game renderer does not depend on a third-party CDN. You still need a connection to load a deployed Vercel site.

## Deploy

Import the folder/repository into Vercel as a static site. No build command or framework preset is needed; the output directory is the project root. Push the same files to GitHub to keep the source modular.

## Project layout

- `index.html`: game canvas and HUD
- `styles.css`: interface and responsive layout
- `src/game.js`: renderer and gameplay systems
- `src/missions.js`: all twelve story missions and dialogue
- `vendor/three.min.js`: bundled Three.js r128 renderer
- `vercel.json`: static hosting configuration

Every mission start now uses the existing dialogue/camera cutscene system. Mission dialogue has original, lighter character jokes. The safe-flat marker is at the exterior door so the final repair objective is reachable.
