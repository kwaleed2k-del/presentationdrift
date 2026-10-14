#!/usr/bin/env bash
# Encode a clip so it plays smoothly on a slide — even 4 at once.
#   encode-video.sh in.mp4 out.mp4 [--start 1.5] [--len 20] [--speed 1.6] [--w 960]
#   encode-video.sh frames in.mp4 out.jpg     # 5-frame strip to pick a good --start
#
# Why: 1080p full-range (yuvj420p) H.264 with long GOPs stutters or freezes when several decode together,
# and stream-copy trims (-c copy) start between keyframes and freeze. This re-encodes to 540p standard-range
# yuv420p, a keyframe every 0.5 s, no audio, faststart — and bakes the speed-up into the file
# (browser playbackRate is unreliable on these files).
set -euo pipefail

if [[ "${1:-}" == "frames" ]]; then
  in="$2"; out="$3"
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
  tmp=$(mktemp -d)
  for i in 0 1 2 3 4; do
    t=$(awk -v d="$dur" -v i="$i" 'BEGIN{printf "%.2f", d*(i+0.5)/5}')
    ffmpeg -v error -y -ss "$t" -i "$in" -frames:v 1 -vf scale=320:-1 "$tmp/f$i.jpg"
  done
  ffmpeg -v error -y -i "$tmp/f0.jpg" -i "$tmp/f1.jpg" -i "$tmp/f2.jpg" -i "$tmp/f3.jpg" -i "$tmp/f4.jpg" -filter_complex hstack=5 "$out"
  rm -r "$tmp"
  echo "✓ $out (frames at 10/30/50/70/90% of ${dur}s)"
  exit 0
fi

in="$1"; out="$2"; shift 2
start=0; len=20; speed=1; w=960
while [[ $# -gt 0 ]]; do
  case "$1" in
    --start) start="$2"; shift 2 ;;
    --len) len="$2"; shift 2 ;;
    --speed) speed="$2"; shift 2 ;;
    --w) w="$2"; shift 2 ;;
    *) echo "unknown option $1"; exit 1 ;;
  esac
done
h=$(( (w * 9 / 16) / 2 * 2 ))
ffmpeg -v error -y -ss "$start" -i "$in" -t "$len" -an \
  -vf "setpts=PTS/${speed},fps=30,scale=${w}:${h}:flags=lanczos:in_range=auto:out_range=tv,format=yuv420p" \
  -color_range tv -pix_fmt yuv420p -c:v libx264 -profile:v main -preset veryfast -crf 24 -g 15 -keyint_min 15 \
  -movflags +faststart "$out"
size=$(du -h "$out" | cut -f1)
echo "✓ $out (${w}×${h}, ${speed}×, ${len}s, ${size})"
