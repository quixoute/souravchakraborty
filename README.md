# Sourav Chakraborty — Modern Portfolio

A dark, cinematic editorial portfolio built as a lightweight static website for GitHub Pages.

## Local preview
Run a static server from the repository root, for example: `python -m http.server 8000`
Then open http://localhost:8000.

## Main files
- `index.html` — homepage structure and SEO metadata
- `portfolio.css` — responsive visual system and motion
- `portfolio-data.js` — editable categories, project links, contact and hero media
- `portfolio.js` — category routing and interactions

## Updating portfolio content
Edit `portfolio-data.js`. Media paths are relative to the repository root. Existing project pages and galleries are retained. Replace image assets with approved project imagery and set `site.heroVideo` to a local MP4 path when the showreel is ready.

## Hosting
The existing `CNAME` is preserved. This implementation has no build step and is compatible with GitHub Pages.
