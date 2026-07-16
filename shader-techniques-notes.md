# Shader & Painterly-3D Technique Notes — Comfee Mug (@ComfeeMug)

Study notes compiled from the Comfee Mug YouTube channel (Blender, EEVEE), covering the
"Arcane-style" hand-painted look, toon/cel shading, and 2D-painting-on-3D techniques.
Channel focus: making 3D anime/painterly renders in Blender.

## 1. Core idea behind the whole style

The channel's throughline is: **use procedural shader nodes to fake hand-painted 2D
brushwork on a 3D mesh**, the way *Arcane* (League of Legends animated series) blends
painted textures with 3D lighting. Two ingredients recur in almost every tutorial:

- **Shader to RGB** node (EEVEE-only) — converts a shaded (lit) result back into a flat
  color so it can be fed into a **Color Ramp** for banding, instead of using smooth PBR
  falloff. This is what turns continuous lighting into discrete "painted" bands.
- **Mix Color node** — used constantly to layer painted color variation (warm/cool shifts,
  hand-painted texture overlays) on top of a base color without breaking the procedural
  setup. Comfee Mug has a dedicated tutorial calling this "the best node for anime shaders."

## 2. Toon / Cel Shader (base technique)

Source: "The Only Blender Toon Shader Tutorial You'll Ever Need," "Anime Cel Shader for
Blender 4.1 and Older [EEVEE]," "Upgrade Your Anime Cel/Toon Shader In Blender 4.2 — Part 2"

Node chain:
1. Diffuse/Principled BSDF → **Shader to RGB** → **Color Ramp** set to **Constant**
   interpolation (not linear) → this creates hard-edged shadow bands instead of a smooth
   gradient.
2. Add a second/third color ramp stop to get a 2-3 tone cel look (highlight / midtone /
   shadow), matching classic anime cel shading.
3. **Rim light**: build a **Fresnel** node (or Layer Weight → Facing) rig, feed it through
   its own ramp, and mix it additively over the final color for a light-wrap/rim edge.
4. **Outlines**: use a **Solidify modifier** with the "inverted hull" trick — flip normals,
   push the shell outward slightly, assign a flat black (or dark) material, back-face
   culled — the classic inverted-hull outline used in most toon pipelines.
5. Part 2 upgrade: make the cel shader react to the **hue and saturation of scene lights**,
   not just intensity — so colored lighting still reads correctly through the banded shadow
   ramp (mix the ramp's shadow color with the light's HSV rather than a fixed dark color).

## 3. Arcane-style "painted" shading (the signature look)

Source: "THIS is Arcane Shading in Blender," "THIS is Arcane Shading in Blender (EASY),"
"Arcane Shader Challenge in Blender"

Building on the toon-shader base above, the Arcane look adds:
- **Painted texture overlays**: hand-painted or procedurally-generated brushstroke/noise
  textures blended into both the albedo *and* the shadow bands via Mix Color, so shadows
  don't look like flat CG bands but like painted strokes.
- **Warm/cool color shifting across the light wrap**: shift hue slightly warmer in
  highlights and cooler in shadows (a classic traditional-painting trick) using the
  Fresnel/facing rig from the toon shader, mixed with a Color Ramp keyed to shading
  intensity.
- Two variants exist: a from-scratch, every-node "advanced" breakdown, and a simplified
  "EASY" version for a faster setup with fewer nodes — good starting point before the full
  from-scratch tutorial.

### Arcane skin shader
Source: "Arcane Skin Shader from Scratch in Blender"
- Fully procedural skin material: subsurface-style softening substituted/faked via layered
  Color Ramp bands (since flat NPR shading usually skips real SSS), plus painted-looking
  blush/warm-tone patches via noise-driven Mix Color layers on cheeks/nose.
- Covers mesh considerations (where shading seams show up), lighting setup to sell the
  style, and compositing passes on top (e.g., bloom/glow, grain) to finish the painterly
  look — the shader alone isn't the whole effect, compositing matters too.

### Arcane metal shader
Source: "Forging Arcane Metal Shaders in Blender"
- One material that blends between "pristine polished" and "battle-worn/grit" states —
  driven by a mask (likely vertex paint or procedural noise/AO) mixed via Color Ramp,
  so wear-and-tear can be painted onto the same base shader instead of needing two
  materials.
- Uses sharp, painted-looking specular highlights (banded via Shader to RGB, same
  principle as the toon base) rather than smooth PBR reflections, so metal reads as
  "illustrated" rather than photoreal.

## 4. 2D-painting-on-3D specific techniques

### Texture painting with nodes (the "3-node trick")
Source: "Blender Anime Texture Painting with Nodes [EEVEE]"
- Core claim: as few as **3 nodes** can make *any* texture read as hand-painted —
  essentially a noise/Voronoi or brush-alpha texture mixed over the base albedo via
  Mix Color, with the mix factor driven by a Color Ramp for controlled, non-uniform
  brush coverage (not a uniform blend).

### Photoreal → anime/painted conversion
Source: "Turning Photo Realistic Textures into Anime Style Shaders in Blender"
- Takes existing photoreal PBR textures and routes them through the Shader-to-RGB +
  Color Ramp banding pipeline above, so realistic textures get "flattened" into painted
  bands instead of building anime textures from scratch — a shortcut for reusing asset
  libraries in a painterly pipeline.

### Painted cel shadows
Source: "Painted Anime Cel Shadows in Blender [EEVEE]"
- Focuses specifically on making the *shadow shapes themselves* look brush-painted
  (irregular, hand-drawn edges) rather than the hard geometric edges you get from a
  plain Color Ramp cutoff — likely uses a noise texture to perturb the ramp's fac input
  so the shadow boundary is jittered/organic instead of a clean line.

### Make any model look hand-painted fast
Source: "Make Any 3D Model Look Hand-Painted (Fast!) in Blender"
- A condensed/hack version of the above pipeline for quickly reskinning an existing 3D
  model in the painterly Arcane style without building a full custom shader per asset —
  good "cheat sheet" video once the fundamentals above are understood.

### Painterly clouds
Source: "How to Make 3D Painterly Anime Clouds in Blender"
- Applies the same banded-shading logic to volumetrics/cloud shapes so clouds read as
  flat painted brush shapes rather than realistic volumetric clouds — likely uses
  Color Ramp banding on a volume shader or a flat-shaded mesh-cloud approach with
  painted alpha textures.

### Anime glass
Source: "Making 3D Anime Glass in Blender EEVEE"
- Stylized transparency: hard-edged, banded refraction/specular highlights instead of
  physically accurate glass BSDF falloff, keeping glass consistent with the painted-cel
  look of everything else in the scene.

### Real-time stylization
Source: "Make Photorealistic/Stylized 3D Look Anime in Real-Time"
- Adapts the banded-shader approach for EEVEE real-time viewport results (as opposed to
  a Cycles/offline-only technique), useful for game-style or interactive work.

## 5. Reusable node "toolkit" (appears across almost every video)

| Node | Role in the painterly pipeline |
|---|---|
| Shader to RGB | Converts lit shading result to flat color so it can be re-banded (EEVEE only) |
| Color Ramp (Constant interpolation) | Creates hard painted-looking shading bands/steps |
| Color Ramp (Linear, driven by noise) | Jitters band edges for a hand-drawn, non-geometric shadow line |
| Mix Color | Layers painted texture/tint variation onto base color, rim light, or shadow bands |
| Fresnel / Layer Weight (Facing) | Drives rim/edge light and warm-cool color shifts |
| Noise/Voronoi texture | Adds brush-like variation to masks (wear, blush, cloud shape, shadow jitter) |
| Solidify modifier (inverted hull) | Classic outline technique: flipped normals, expanded shell, flat dark material, backface-culled |

## 6. Suggested learning order

1. Toon/Cel Shader tutorial (base banding + outline technique) — foundation for everything else.
2. Mix Color node deep-dive — the second most-used building block.
3. "THIS is Arcane Shading in Blender (EASY)" — see the full style with a light setup.
4. "THIS is Arcane Shading in Blender" (full/from-scratch) — go deeper once the easy version makes sense.
5. Texture Painting with Nodes (3-node trick) + Painted Anime Cel Shadows — apply the
   technique to textures and shadow shapes specifically.
6. Material specializations as needed: Arcane Skin Shader, Arcane Metal Shader, Anime
   Glass, Painterly Clouds, Tree Bark Shader.
7. "Make Any 3D Model Look Hand-Painted (Fast!)" as a quick-reference cheat sheet once
   fundamentals are solid.

## 7. Video reference list

- [The Only Blender Toon Shader Tutorial You'll Ever Need](https://www.youtube.com/watch?v=61WJqVgVXlo)
- [Anime Cel Shader for Blender 4.1 and Older [EEVEE]](https://www.youtube.com/watch?v=xuQC-HYRSNc)
- [Upgrade Your Anime Cel/Toon Shader In Blender 4.2 — Part 2](https://www.youtube.com/watch?v=PxAGb-b650M)
- [How to Use the Mix Color Node in Blender [Anime Shaders]](https://www.youtube.com/watch?v=Rjlt3QVbukw)
- [BEST Node for Anime Shaders in Blender [Mix Color Node]](https://www.youtube.com/watch?v=m2wokQM-UbQ)
- [THIS is Arcane Shading in Blender (EASY)](https://www.youtube.com/watch?v=As4biIb1-Jo)
- [Arcane Shader Challenge in Blender | Chat Picks What I Make!](https://www.youtube.com/watch?v=KthI9d1XL88)
- [Arcane Skin Shader from Scratch in Blender](https://www.youtube.com/watch?v=hXgflY8NAOo)
- [Forging Arcane Metal Shaders in Blender](https://www.youtube.com/watch?v=A1k1ndVfJ6s)
- [Blender Texture Painting with Arcane Shaders? | Breakdown](https://www.youtube.com/watch?v=zKkM3UrOAvc)
- [Blender Anime Texture Painting with Nodes [EEVEE]](https://www.youtube.com/watch?v=PzfxM1SX2LM)
- [Turning Photo Realistic Textures into Anime Style Shaders in Blender](https://www.youtube.com/watch?v=5ajQHT6SIqM)
- [Painted Anime Cel Shadows in Blender [EEVEE]](https://www.youtube.com/watch?v=XUredxyRLB0)
- [Make Any 3D Model Look Hand-Painted (Fast!) in Blender](https://www.youtube.com/watch?v=GEi7Ph10LCk)
- [How to Make 3D Painterly Anime Clouds in Blender](https://www.youtube.com/watch?v=sWtrenoC9eA)
- [Making 3D Anime Glass in Blender EEVEE](https://www.youtube.com/watch?v=sZ5vagpMpSs)
- [Make Photorealistic/Stylized 3D Look Anime in Real-Time](https://www.youtube.com/watch?v=BRGxfD6Xfdc)
- [Anime Tree Bark Shader in Blender](https://www.youtube.com/watch?v=-xzGLRtEmZM)
- [Stylized Shader Challenge in Blender (Plus 2026 Roadmap)](https://www.youtube.com/watch?v=BhKNxWmMvas)
- [Blender Slime Shader Challenge | Live Shading Under Pressure](https://www.youtube.com/watch?v=NKG84E8hhNU)
- [Comfee Tutorials playlist](https://www.youtube.com/playlist?list=PLqh6cWQm2zLzhEiT8oeEI47y3Nk7dskeT)

---
*Compiled from public YouTube search results/descriptions (Comfee Mug channel). Direct
page fetches from youtube.com were blocked (403), so exact on-screen node graphs weren't
verifiable frame-by-frame — watch the linked videos for the precise node values/positions
while using this doc as a study map.*
