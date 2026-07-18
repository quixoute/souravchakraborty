---
name: breakdown-video
description: Break down tutorial videos from a self-hosted Invidious playlist (or a single video) into a numbered step-by-step guide with one screenshot per step, saved to its own folder. Use when the user asks to check their Invidious playlist for new videos, process/breakdown a specific video URL, or update the video-breakdowns folders.
---

# Video → Step Breakdown (via Invidious)

Turns a tutorial video into `video-breakdowns/<video-title>/steps.md` plus
numbered screenshots (`01.png`, `02.png`, ...), one per logical step. Source
videos come through the user's own Invidious instance, never directly from
youtube.com — Invidious does the YouTube-side fetching, this skill only talks
to the Invidious host.

**This skill needs real network access to the configured Invidious instance,
plus `ffmpeg` and `python3` on PATH.** It will not work in a network-locked
sandbox — it's meant to run somewhere that can actually reach the NAS
(directly on the NAS, or over Tailscale/the Cloudflare tunnel from the
machine running Claude Code).

## One-time setup

1. Copy `config.example.json` to `config.json` in this same skill folder and fill in:
   - `invidious_url` — the base URL of the Invidious instance (Cloudflare tunnel hostname or Tailscale address), no trailing slash.
   - `playlist_id` — the Invidious/YouTube playlist ID the user is dropping links into.
   - `output_dir` — where finished breakdowns go. Defaults to `video-breakdowns` at the repo root.
2. Confirm `ffmpeg` and `python3` are available: `ffmpeg -version`, `python3 --version`. If missing, install them on whatever machine is running this (the NAS, if Claude Code Desktop is running there).
3. `config.json` is gitignored on purpose (it holds a private tunnel hostname) — don't commit it.

## Workflow

### 1. Find new videos
Run:
```
python3 .claude/skills/breakdown-video/scripts/sync_playlist.py .claude/skills/breakdown-video/config.json
```
This diffs the playlist against `<output_dir>/manifest.json` and prints JSON with a `new_videos` list (`videoId` + `title`). If it's empty, nothing to do — report that to the user and stop.

### 2. For each new video, pull raw material
Run:
```
.claude/skills/breakdown-video/scripts/process_video.sh <invidious_url> <videoId> <output_dir>/.work/<videoId>
```
This downloads a modest-resolution copy of the video and its captions (both
via the Invidious API, not youtube.com directly), then runs ffmpeg
scene-change detection to dump candidate frames into
`<output_dir>/.work/<videoId>/candidates/` with a matching
`candidate_frames.json` (`{index, timestamp, file}` per candidate). Captions
land in `captions.vtt` (may be empty if the video has none — proceed from
visuals alone if so).

### 3. Segment the transcript into steps (this is the judgment call — do it yourself, don't script it)
Read `captions.vtt`. Group the timestamped lines into logical instructional
steps — not one step per sentence, and not one step for the whole video.
Aim for roughly one step per distinct action ("add a Color Ramp node", "set
it to Constant", "wire in the Fresnel node"), which usually lands somewhere
between 8 and 25 steps depending on video length. Give each step a short
title and a 1-2 sentence description in your own words, plus the timestamp
where it starts.

### 4. Pick a screenshot for each step
For each step's start timestamp, find the closest entry in
`candidate_frames.json` (by `timestamp`). If the nearest candidate is more
than ~2 seconds off (scene detection can miss subtle node-graph edits),
extract a fresh frame directly instead:
```
ffmpeg -y -ss <timestamp> -i <output_dir>/.work/<videoId>/video.mp4 -frames:v 1 <output_dir>/.work/<videoId>/step_frame.png
```
Copy the chosen image into the final folder as `NN.png` (zero-padded, in
step order).

### 5. Write the output
Create `<output_dir>/<safe-title>/` (slugify the video title: lowercase,
spaces to hyphens, strip punctuation) containing:
- `NN.png` for each step, in order
- `steps.md`:
  ```markdown
  # <Video Title>

  Source: <original YouTube/Invidious URL>

  ## Step 01 — <short title> (<mm:ss>)
  <1-2 sentence description>

  ![Step 01](01.png)

  ## Step 02 — ...
  ```

### 6. Clean up and record progress
- Delete `<output_dir>/.work/<videoId>/` (raw video, candidate frames,
  scenelog) — keep only the final numbered screenshots and `steps.md`. Raw
  downloaded video should not be kept around or committed; it's scratch
  material only, and re-downloading someone else's tutorial video wholesale
  is fine for private personal study but shouldn't be retained or shared.
- Mark it processed so the next run skips it:
  ```
  python3 .claude/skills/breakdown-video/scripts/mark_processed.py <output_dir> <videoId> "<title>"
  ```

### 7. Repeat for each new video, then summarize
After all new videos are processed, tell the user how many were done and
list the folder names. If any video failed (no captions and no clear visual
steps, download error, etc.), say so explicitly rather than silently
skipping it.

## Notes
- Safe to re-run any time — step 1 always diffs against the manifest, so
  nothing gets reprocessed.
- If asked to process a single arbitrary video URL/ID instead of the whole
  playlist, skip step 1 and go straight to step 2 with that `videoId`.
- Keep downloaded video resolution modest (360-480p) — we only need clean
  stills, not source-quality footage, and it keeps NAS disk/bandwidth usage
  down on repeated runs.
