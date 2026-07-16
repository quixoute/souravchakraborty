# 4-Day Course Map: Blender 2D-Painting-Style-on-3D

A compressed sprint through the technique catalog in `shader-techniques-notes.md`,
sequenced so each day's practice builds directly on the last. Target: ~4-4.5 hrs/day
(watch time + hands-on practice — practice should take roughly 2x the watch time,
that's where the skill actually forms). Total: ~16-18 hrs across 4 days.

Rule for the sprint: don't rewatch a video before redoing the practice exercise from
memory first. Struggling to recall a node is the signal to rewatch, not skip.

---

## Day 1 — Foundations: banding + outlines
**Goal:** understand *why* the style works — flat lit-color bands instead of smooth PBR falloff — and get a working toon base you'll reuse every other day.

**Watch (~50 min):**
1. [The Only Blender Toon Shader Tutorial You'll Ever Need](https://www.youtube.com/watch?v=61WJqVgVXlo)
2. [Upgrade Your Anime Cel/Toon Shader In Blender 4.2 — Part 2](https://www.youtube.com/watch?v=PxAGb-b650M) (color-reactive shadows)

**Practice (~2.5 hrs) — on a default sphere + a simple prop:**
- Build the chain: Principled/Diffuse BSDF → **Shader to RGB** → **Color Ramp (Constant interpolation)** with 2-3 stops for highlight/mid/shadow.
- Add a **Fresnel** (or Layer Weight/Facing) rig, run it through its own ramp, mix additively for rim light.
- Add outlines: **Solidify modifier**, flipped normals, expanded shell, flat dark unlit material, backface-culled.
- Stretch: make the shadow-band color react to the scene light's hue/saturation instead of a fixed dark tint.

**Checkpoint:** From a blank file, rebuild the full toon shader (bands + rim + outline) without looking at the video. If you can't, that's tomorrow's warm-up, not a failure.

---

## Day 2 — Color layering & the "Arcane-lite" look
**Goal:** learn the second core building block (Mix Color) and turn yesterday's flat toon shader into something that reads as *painted*, not just cel-shaded.

**Watch (~35 min):**
1. [How to Use the Mix Color Node in Blender \[Anime Shaders\]](https://www.youtube.com/watch?v=Rjlt3QVbukw)
2. [BEST Node for Anime Shaders in Blender \[Mix Color Node\]](https://www.youtube.com/watch?v=m2wokQM-UbQ)
3. [THIS is Arcane Shading in Blender (EASY)](https://www.youtube.com/watch?v=As4biIb1-Jo)

**Practice (~3 hrs) — on Day 1's shader:**
- Warm/cool shift: mix a slightly warm tint into highlight bands and a cool tint into shadow bands, driven off the same Fresnel/facing rig from Day 1.
- Layer a Noise or Voronoi texture through Mix Color onto the albedo to fake painted brushwork/color variance (not a uniform tint — vary intensity across the surface).
- Redo the full "EASY" Arcane setup on a new object from scratch, then compare it to your modified Day-1 shader — reconcile any differences in approach.

**Checkpoint:** Two versions of the same object side by side — plain toon (Day 1) vs. Arcane-lite (Day 2) — you should be able to explain in one sentence what each added node is doing.

---

## Day 3 — Full Arcane pipeline + texture/shadow painting
**Goal:** go from "lite" to the real from-scratch pipeline, and learn to paint texture and shadow *shapes*, not just colors.

**Watch (~45 min):**
1. [Arcane Shader Challenge in Blender](https://www.youtube.com/watch?v=KthI9d1XL88) (watch first for the full-complexity target)
2. [Blender Anime Texture Painting with Nodes \[EEVEE\]](https://www.youtube.com/watch?v=PzfxM1SX2LM) (the 3-node trick)
3. [Painted Anime Cel Shadows in Blender \[EEVEE\]](https://www.youtube.com/watch?v=XUredxyRLB0)

**Practice (~3.5 hrs) — on a slightly more complex prop (weapon, armor piece, or a simple character bust):**
- Apply the 3-node texture-painting trick to the albedo: brush-alpha/noise texture → Mix Color → Color Ramp controlling mix factor, so coverage is irregular, not a flat blend.
- Jitter the shadow-band edge: feed a noise texture into the Color Ramp's Fac input (or perturb it pre-ramp) so the shadow boundary reads as a hand-drawn stroke instead of a clean geometric line.
- Combine with Day 2's warm/cool shift so the full stack is: banding → jittered shadow edge → warm/cool tint → painted albedo variance → rim → outline.

**Checkpoint:** One object with the complete layered stack. If any single node's purpose is fuzzy, that's the one thing to re-derive before Day 4 — don't carry confusion forward.

---

## Day 4 — Specialization + capstone
**Goal:** apply the full pipeline to a finished piece, and pick up one material specialization relevant to what you actually want to make.

**Pick ONE specialization track based on your goal (don't do both — you have half a day):**
- **Character-focused:** [Arcane Skin Shader from Scratch in Blender](https://www.youtube.com/watch?v=hXgflY8NAOo) — procedural skin + blush layering + compositing pass (bloom/grain) to finish the look.
- **Prop/environment-focused:** [Forging Arcane Metal Shaders in Blender](https://www.youtube.com/watch?v=A1k1ndVfJ6s) — polished-vs-worn blend via a mask, painted specular highlights.

**Also watch (~10 min):** [Make Any 3D Model Look Hand-Painted (Fast!) in Blender](https://www.youtube.com/watch?v=GEi7Ph10LCk) — the condensed shortcut version, useful now that you understand *why* it works, as a cheat sheet for future projects.

**Capstone (~3 hrs):** Take a model you actually care about (character, prop, or the sphere/prop from earlier days if nothing else is ready) and apply the entire pipeline end to end:
1. Toon base (bands, rim, outline) — Day 1
2. Warm/cool + painted albedo variance — Day 2
3. Jittered shadow shapes + texture-painted detail — Day 3
4. Your chosen specialization (skin or metal) — Day 4
5. Light compositing pass (bloom/grain) to finish

Render a still or short turntable. That's your proof of the sprint.

---

## If you're short on time, cut here
Lowest-priority videos for a 4-day sprint (skip unless you finish early):
[Anime Tree Bark Shader](https://www.youtube.com/watch?v=-xzGLRtEmZM),
[Painterly Clouds](https://www.youtube.com/watch?v=sWtrenoC9eA),
[Anime Glass](https://www.youtube.com/watch?v=sZ5vagpMpSs),
[Slime Shader Challenge](https://www.youtube.com/watch?v=NKG84E8hhNU),
[Stylized Shader Challenge / 2026 Roadmap](https://www.youtube.com/watch?v=BhKNxWmMvas) — these are all the same node toolkit applied to new surface types; revisit them post-sprint once the fundamentals are automatic.

See `shader-techniques-notes.md` in this repo for the full node-toolkit reference table and technique breakdowns to consult mid-practice.
