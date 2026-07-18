#!/usr/bin/env bash
# Pull a video + captions from Invidious and produce scene-change candidate
# frames, ready for Claude to match against the transcript and pick the
# final step screenshots. Nothing here talks to youtube.com directly —
# only to the Invidious instance.
#
# Usage: process_video.sh <invidious_base_url> <video_id> <work_dir>
set -euo pipefail

BASE_URL="$1"
VIDEO_ID="$2"
WORK_DIR="$3"

mkdir -p "$WORK_DIR/candidates"
cd "$WORK_DIR"

echo "Fetching video metadata..." >&2
curl -fsSL "$BASE_URL/api/v1/videos/$VIDEO_ID" -o video_info.json

# Pick a modest progressive (audio+video combined) stream — we only need
# clean stills, not source-quality footage.
ITAG=$(python3 - <<'PY'
import json
info = json.load(open("video_info.json"))
streams = info.get("formatStreams", [])
preferred = [s for s in streams if s.get("resolution") in ("360p", "480p")]
chosen = (preferred or streams)[0] if streams else None
print(chosen["itag"] if chosen else "")
PY
)

if [ -z "$ITAG" ]; then
  echo "No progressive format stream found for $VIDEO_ID — check video_info.json" >&2
  exit 1
fi

echo "Downloading video (itag $ITAG)..." >&2
curl -fsSL "$BASE_URL/latest_version?id=$VIDEO_ID&itag=$ITAG&local=true" -o video.mp4

echo "Fetching captions..." >&2
LABEL=$(python3 - <<'PY'
import json
info = json.load(open("video_info.json"))
caps = info.get("captions", [])
english = [c for c in caps if c.get("languageCode", "").startswith("en")]
chosen = (english or caps)[0] if caps else None
print(chosen["label"] if chosen else "")
PY
)

if [ -n "$LABEL" ]; then
  ENCODED_LABEL=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$LABEL")
  curl -fsSL "$BASE_URL/api/v1/captions/$VIDEO_ID?label=$ENCODED_LABEL" -o captions.vtt
else
  echo "No captions available for $VIDEO_ID — steps.md will need to be written from the video alone." >&2
  : > captions.vtt
fi

echo "Detecting scene changes..." >&2
ffmpeg -y -i video.mp4 -vf "select='gt(scene,0.28)',showinfo" -vsync vfr "candidates/%04d.png" 2> scenelog.txt || true

python3 - <<'PY'
import json
import re

frames = []
pattern = re.compile(r"pts_time:([0-9.]+)")
n = 0
for line in open("scenelog.txt"):
    if "pts_time" not in line or "n:" not in line:
        continue
    m = pattern.search(line)
    if not m:
        continue
    n += 1
    frames.append({"index": n, "timestamp": float(m.group(1)), "file": f"candidates/{n:04d}.png"})

json.dump(frames, open("candidate_frames.json", "w"), indent=2)
print(f"{len(frames)} candidate frames detected")
PY

echo "Done. video_info.json, captions.vtt, candidate_frames.json ready in $WORK_DIR" >&2
