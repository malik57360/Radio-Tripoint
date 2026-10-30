#!/bin/bash
# La vidéo du week-end en un fichier : [ouverture] + agenda (sans sa fin) +
# passage + 5 découvertes + fin de l'agenda. Tout est réencodé ensemble en
# 1080 × 1920, 30 i/s, son stéréo 44,1 kHz, puis ramené à -14 LUFS.
#   ./compil.sh <sortie.mp4> [ouverture.mp4]
set -e
SORTIE=$1
OUV=$2
D=out/compil
A=out/tripo-weekend-halloween.mp4
FIN_CARTES=26  # 780 images : l'agenda avant son « Bon week-end ! »
ffmpeg -nostdin -v error -y -i out/compil/passage-muet.mp4 -i son/passage.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest $D/passage.mp4
ffmpeg -nostdin -v error -y -t $FIN_CARTES -i $A -af "afade=t=out:st=$((FIN_CARTES-1)).6:d=0.4" -c:v libx264 -crf 16 -c:a aac -b:a 192k $D/agenda.mp4
ffmpeg -nostdin -v error -y -ss $FIN_CARTES -i $A -af "afade=t=in:d=0.3" -c:v libx264 -crf 16 -c:a aac -b:a 192k $D/agenda-fin.mp4
LISTE=()
[ -n "$OUV" ] && LISTE+=("$OUV")
LISTE+=($D/agenda.mp4 $D/passage.mp4 out/decouverte-1-john-mayer.mp4 out/decouverte-2-meersein.mp4 out/decouverte-3-blame-emeraude.mp4 out/decouverte-4-didi-b-khaid.mp4 out/decouverte-5-the-manky-melters.mp4 $D/agenda-fin.mp4)
ENTREES=(); FILTRE=""; i=0
for f in "${LISTE[@]}"; do
  ENTREES+=(-i "$f")
  FILTRE+="[$i:v]fps=30,scale=1080:1920,setsar=1,format=yuv420p[v$i];[$i:a]aformat=sample_rates=44100:channel_layouts=stereo[a$i];"
  i=$((i+1))
done
for ((k=0; k<i; k++)); do FILTRE+="[v$k][a$k]"; done
FILTRE+="concat=n=$i:v=1:a=1[v][a];[a]loudnorm=I=-14:TP=-1.5:LRA=11[an]"
ffmpeg -nostdin -v error -y "${ENTREES[@]}" -filter_complex "$FILTRE" -map "[v]" -map "[an]" -c:v libx264 -crf 18 -preset medium -c:a aac -b:a 192k -ar 44100 -movflags +faststart "$SORTIE"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$SORTIE"
