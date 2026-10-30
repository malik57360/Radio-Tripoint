#!/bin/bash
# Rend les 5 découvertes musicales et y pose le son du clip.
set -e
S=/tmp/claude-0/-home-user-Vesti/44869638-2429-5d3c-b8a6-532b60185164/scratchpad
B=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
NOMS=(x john-mayer meersein blame-emeraude didi-b-khaid the-manky-melters)
mkdir -p /dev/shm/rendu-dec out
for i in ${@:-1 2 3 4 5}; do
  TMPDIR=/dev/shm/rendu-dec npx remotion render src/index.ts Decouverte$i out/dec$i-muet.mp4 --codec=h264 --crf=18 --muted --concurrency=3 --browser-executable=$B --log=error
  ffmpeg -nostdin -v error -y -i out/dec$i-muet.mp4 -i $S/rushes-decouvertes/sons/d$i.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "out/decouverte-$i-${NOMS[$i]}.mp4"
  echo "fait $i"
done
rm -rf /dev/shm/rendu-dec
echo "TOUT FINI"
