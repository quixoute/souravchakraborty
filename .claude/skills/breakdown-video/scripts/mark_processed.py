#!/usr/bin/env python3
"""Record a video as processed in <output_dir>/manifest.json."""
import json
import sys
from pathlib import Path


def main():
    if len(sys.argv) != 4:
        print("usage: mark_processed.py <output_dir> <videoId> <title>", file=sys.stderr)
        sys.exit(1)

    output_dir = Path(sys.argv[1])
    video_id, title = sys.argv[2], sys.argv[3]

    manifest_path = output_dir / "manifest.json"
    manifest = (
        json.loads(manifest_path.read_text())
        if manifest_path.exists()
        else {"processed": {}}
    )
    manifest["processed"][video_id] = title
    manifest_path.write_text(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
