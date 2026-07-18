#!/usr/bin/env python3
"""Diff an Invidious playlist against the local manifest.

Prints JSON with the videos in the playlist that haven't been processed yet
(per <output_dir>/manifest.json). Doesn't modify anything — mark_processed.py
is what updates the manifest, once a video's breakdown is actually done.
"""
import json
import sys
import urllib.request
from pathlib import Path

USER_AGENT = "breakdown-video-skill"
MAX_PAGES = 50  # safety cap against a runaway loop


def fetch_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def fetch_all_playlist_videos(base_url, playlist_id):
    videos = []
    page = 1
    while page <= MAX_PAGES:
        url = f"{base_url}/api/v1/playlists/{playlist_id}?page={page}"
        data = fetch_json(url)
        batch = data.get("videos", [])
        if not batch:
            break
        videos.extend(batch)
        page += 1
    return videos


def main():
    if len(sys.argv) != 2:
        print("usage: sync_playlist.py <config.json>", file=sys.stderr)
        sys.exit(1)

    config = json.loads(Path(sys.argv[1]).read_text())
    base_url = config["invidious_url"].rstrip("/")
    playlist_id = config["playlist_id"]
    output_dir = Path(config["output_dir"])
    output_dir.mkdir(parents=True, exist_ok=True)

    manifest_path = output_dir / "manifest.json"
    manifest = (
        json.loads(manifest_path.read_text())
        if manifest_path.exists()
        else {"processed": {}}
    )

    videos = fetch_all_playlist_videos(base_url, playlist_id)
    new_videos = [v for v in videos if v["videoId"] not in manifest["processed"]]

    print(
        json.dumps(
            {
                "base_url": base_url,
                "output_dir": str(output_dir),
                "total_in_playlist": len(videos),
                "already_processed": len(videos) - len(new_videos),
                "new_videos": [
                    {"videoId": v["videoId"], "title": v.get("title", v["videoId"])}
                    for v in new_videos
                ],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
