"""
Voix de Tripo pour les vidéos : la même que sur heytripo.fr (Piper, voix
SIWIS CC BY 4.0, lue par sherpa-onnx, puis le « traitement Tripo » :
parole ralentie, fréquence × 1,28). Le modèle vient du dépôt du site
(api/voix) ; tout tourne ici, rien ne passe par le site en ligne.

  python3 outils/voix_tripo.py <repliques.json> <dossier-sortie> [api/]
repliques.json : [["nom", "texte à dire"], …] → <nom>.wav (44,1 kHz) et
duree.json ({nom: secondes}).

Autre langue : VOIX_MODELE=<dossier d'un modèle Piper de sherpa-onnx> (par
exemple vits-piper-de_DE-thorsten-medium, voix Thorsten, CC0, pour
l'allemand) ; le traitement Tripo reste le même. Pour vérifier à la
transcription, ralentir d'abord (asetrate=44100/1.28) : sur la voix
accélérée, Whisper perd la fin des phrases alors qu'elle est bien là.
"""
import importlib.util
import json
import os
import subprocess
import sys
import tempfile

repliques = json.load(open(sys.argv[1]))
sortie = sys.argv[2]
api = sys.argv[3] if len(sys.argv) > 3 else "/home/user/radio-tripoint/api"
spec = importlib.util.spec_from_file_location("tripo_voix", os.path.join(api, "tripo_voix.py"))
tripo = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tripo)

modele = os.environ.get("VOIX_MODELE")
if modele:
    import sherpa_onnx

    onnx = next(f for f in os.listdir(modele) if f.endswith(".onnx"))
    tripo._voix = sherpa_onnx.OfflineTts(
        sherpa_onnx.OfflineTtsConfig(
            model=sherpa_onnx.OfflineTtsModelConfig(
                vits=sherpa_onnx.OfflineTtsVitsModelConfig(
                    model=os.path.join(modele, onnx),
                    tokens=os.path.join(modele, "tokens.txt"),
                    data_dir=os.path.join(modele, "espeak-ng-data"),
                    noise_scale=0.667,
                    noise_scale_w=0.8,
                    length_scale=1 / 0.86,
                ),
                num_threads=2,
            ),
            max_num_sentences=1,
        )
    )

durees = {}
with tempfile.TemporaryDirectory() as d:
    for nom, texte in repliques:
        brut = os.path.join(d, f"{nom}.wav")
        open(brut, "wb").write(tripo.synthese(texte))
        fin = os.path.join(sortie, f"{nom}.wav")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", brut, "-af", "highpass=f=70,alimiter=limit=0.9", "-ar", "44100", "-ac", "1", fin], check=True)
        sec = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", fin], capture_output=True, text=True).stdout)
        durees[nom] = round(sec, 3)
        print(f"{nom}: {sec:.2f} s")
json.dump(durees, open(os.path.join(sortie, "duree.json"), "w"), indent=1)
