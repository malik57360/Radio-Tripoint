# Atelier vidéo Radio Tripoint

Les vidéos verticales de la radio (1080 × 1920, 30 i/s), montées en code avec
Remotion : agenda du week-end présenté par Tripo, reportages (habillage du
reportage du gymnase Norbert Noël), rubrique Génération Z.

Cette branche (`atelier-video`) n'a rien à voir avec le site : elle n'est
jamais fusionnée dans `main`, et `vercel.json` y coupe les déploiements.

## Règle n° 1 : on ne perd plus rien

Le conteneur de travail est effacé sans prévenir. Tout ce qui sert à refaire
une vidéo est poussé ici **à chaque livraison** : code, scripts de son,
outils, polices, logo. Ce dépôt est **public** : jamais de rushes, de sons
tirés des rushes ni de vidéos rendues (`.gitignore` les refuse). Ceux-là vont
dans le dépôt privé `radio-tripoint-videos`.

## Composer

```sh
npm install
npx remotion studio                      # aperçu
node stills.mjs <Compo> apercu 10 200    # images fixes de contrôle
TMPDIR=/dev/shm/rendu npx remotion render src/index.ts <Compo> out/muet.mp4 \
  --codec=h264 --crf=18 --muted --concurrency=2 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
ffmpeg -i out/muet.mp4 -i son/<son>.wav -map 0:v -map 1:a -c:v copy \
  -c:a aac -b:a 192k -shortest -movflags +faststart out/<nom>.mp4
```

`TMPDIR=/dev/shm/…` : le Chrome de Remotion écrit ses fichiers temporaires
sur le disque, qui se remplit vite dans le conteneur.

| Composition | Fichier | Son |
| --- | --- | --- |
| `TripoWeekend` | `src/agenda/TripoWeekend.tsx` | `python3 son/son_weekend.py son/bande.wav` |
| `GenZPolitique` | `src/reportage/GenZPolitique.tsx` | `python3 son/son_genz_politique.py <parole.wav> son/genz-politique.wav` |
| `Decouverte1` à `5` | `src/decouverte/Decouverte.tsx` | le son du clip (`./rendre-decouvertes.sh`) |

Découverte musicale du week-end : le clip recadré depuis l'enregistrement
d'écran YouTube (sans pubs ni boutons), en carte sur sa propre image
floutée ; artiste, titre, infos vérifiées (sinon rien) et chaîne YouTube.

Habillage des reportages : `src/reportage/habillage.tsx` (titre Anton
blanc et or, cartouche « Reportage · Radio Tripoint », nom à l'écran,
sous-titres, citation, générique). Les sons sont des morceaux originaux
synthétisés en numpy, ramenés à -14 LUFS.

## Rushes

Préparation d'un rush (image 1080 × 1920 nettoyée, voix filtrée) :

```sh
IMAGE="fps=30,hqdn3d=1:1:4:4,scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,unsharp=5:5:0.4,eq=contrast=1.07:saturation=1.1:gamma=0.98,tpad=stop_mode=clone:stop_duration=3"
ffmpeg -ss <début> -i rush.mov -vf "$IMAGE" -frames:v <images> -an -c:v libx264 -crf 17 public/<dossier>/parole.mp4
ffmpeg -ss <début> -t <durée> -i rush.mov -vn \
  -af "highpass=f=80,afftdn=nf=-30,acompressor=threshold=-24dB:ratio=3:attack=6:release=120:makeup=4" \
  -ar 44100 -ac 1 parole.wav
```

Génération Z : jeunes de 15-17 ans, filmés sans visage, jamais nommés.
Autorisation parentale avant toute publication d'un mineur reconnaissable.

## Transcription

`outils/transcrire.py <vidéo> [langue]` : Whisper turbo et Silero VAD via
sherpa-onnx (`python3 -m pip install sherpa-onnx`). Modèles dans `$ASR` :

```sh
curl -LO https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/silero_vad.onnx
curl -LO https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-turbo.tar.bz2
tar xjf sherpa-onnx-whisper-turbo.tar.bz2
```

## Autres dossiers

- `horoscope/` : écriture du jour (`ecrire-1030.py`) et espaces insécables
  (`nbsp.py`) pour `data/horoscope.json` du site.
- `archives/genz-1-se-faire-entendre/` : montage et son du premier épisode
  Génération Z, retrouvés dans l'historique ; ils importent un socle perdu
  (`../annonces/commun`, `son_duel`, `son_teaser`…) et servent de référence.
