#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

VIDEO="${1:-public/video.mp4}"
CAPTIONS="${2:-public/captions.json}"
OUTPUT="${3:-out/nippard-reel.mp4}"

if [ -f "$VIDEO" ] && [ ! -f "$CAPTIONS" ]; then
  python scripts/transcribe.py "$VIDEO" --output "$CAPTIONS"
fi

npx remotion render src/index.ts NippardReel "$OUTPUT" \
  --props="{\"videoSrc\":\"${VIDEO#public/}\",\"captionsJson\":\"${CAPTIONS#public/}\"}"

ffmpeg -y -i "$OUTPUT" -c:v libx264 -pix_fmt yuv420p -c:a aac "${OUTPUT%.mp4}_social.mp4"
