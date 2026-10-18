# Voix de Tripo

- `fr-siwis-medium.onnx` : voix Piper « fr_FR-siwis-medium » (jeu de données
  SIWIS, licence CC BY 4.0), la même que dans les vidéos. Seules des
  métadonnées ont été ajoutées pour sherpa-onnx (model_type=vits,
  comment=piper, voice=fr, has_espeak=1…) : les poids sont inchangés.
- `jetons.txt` : la table phonème → identifiant de `fr-siwis-medium.onnx.json`.
- `espeak-ng-data/` : données du phonétiseur espeak-ng (GPL-3.0), reprises de
  l'archive `vits-piper-fr_FR-siwis-medium` de sherpa-onnx (k2-fsa, tts-models).
