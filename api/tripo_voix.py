"""
Voix de Tripo pour heytripo.fr : la même que dans les vidéos de Radio Tripoint.

Le modèle Piper (voix SIWIS, CC BY 4.0), lu par sherpa-onnx, puis le
« traitement Tripo » des vidéos :
  ffmpeg asetrate=22050*1.28, atempo=0.86, volume=1.4
reproduit sans ffmpeg :
  - atempo 0.86  -> parole plus lente à la synthèse (length_scale / 0.86) ;
  - asetrate 1.28 -> même échantillons, fréquence annoncée × 1,28 (voix plus
    aiguë et plus rapide d'autant) ;
  - volume 1.4   -> crête ramenée au maximum (comme Piper), gain, borné.
sherpa-onnx plutôt que le paquet piper : mêmes poids, mais sans onnxruntime
ni numpy, la fonction tient sous les 225 Mo de Vercel (voir api/voix/MODELE.md).
POST {"texte": "..."} -> audio/wav. Rien n'est enregistré.
"""
import array
import io
import json
import os
import sys
import threading
import wave
from http.server import BaseHTTPRequestHandler

import sherpa_onnx

ICI = os.path.join(os.path.dirname(os.path.abspath(__file__)), "voix")
MAX_TEXTE = 900
ORIGINES = (
    "https://heytripo.fr",
    "https://www.heytripo.fr",
    "https://tripo.radio-tripoint-officiel.fr",
    "https://www.radio-tripoint-officiel.fr",
    "https://radio-tripoint-officiel.fr",
)

_voix = None
_verrou = threading.Lock()


def voix():
    global _voix
    with _verrou:
        if _voix is None:
            _voix = sherpa_onnx.OfflineTts(
                sherpa_onnx.OfflineTtsConfig(
                    model=sherpa_onnx.OfflineTtsModelConfig(
                        vits=sherpa_onnx.OfflineTtsVitsModelConfig(
                            model=os.path.join(ICI, "fr-siwis-medium.onnx"),
                            tokens=os.path.join(ICI, "jetons.txt"),
                            data_dir=os.path.join(ICI, "espeak-ng-data"),
                            noise_scale=0.667,
                            noise_scale_w=0.8,
                            length_scale=1 / 0.86,
                        ),
                        num_threads=2,
                    ),
                    max_num_sentences=1,
                )
            )
    return _voix


def synthese(texte: str) -> bytes:
    audio = voix().generate(texte, sid=0, speed=1.0)
    crete = max([0.01] + [abs(x) for x in audio.samples])
    gain = 32767 / crete * 1.4
    ech = array.array("h", (max(-32768, min(32767, int(x * gain))) for x in audio.samples))
    if sys.byteorder != "little":
        ech.byteswap()
    sortie = io.BytesIO()
    with wave.open(sortie, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(int(audio.sample_rate * 1.28))
        w.writeframes(ech.tobytes())
    return sortie.getvalue()


class handler(BaseHTTPRequestHandler):
    def _repondre(self, code: int, corps: bytes, type_: str = "application/json"):
        self.send_response(code)
        self.send_header("Content-Type", type_)
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(corps)))
        self.end_headers()
        self.wfile.write(corps)

    def do_GET(self):
        # Vérification rapide (« santé ») : la voix se charge et répond.
        try:
            d = synthese("Salut, c'est Tripo !")
            return self._repondre(200, json.dumps({"ok": True, "octets": len(d)}).encode())
        except Exception as e:
            return self._repondre(500, json.dumps({"ok": False, "erreur": type(e).__name__}).encode())

    def do_POST(self):
        origine = self.headers.get("origin") or ""
        if origine and not (origine in ORIGINES or origine.endswith(".vercel.app")):
            return self._repondre(403, b'{"erreur":"origine"}')
        try:
            n = min(int(self.headers.get("content-length") or 0), 8000)
            texte = str(json.loads(self.rfile.read(n) or b"{}").get("texte", "")).strip()[:MAX_TEXTE]
        except Exception:
            return self._repondre(400, b'{"erreur":"requete"}')
        if not texte:
            return self._repondre(400, b'{"erreur":"vide"}')
        try:
            return self._repondre(200, synthese(texte), "audio/wav")
        except Exception as e:  # journal minimal, sans le texte
            print(f"[tripo_voix] échec : {type(e).__name__}")
            return self._repondre(500, b'{"erreur":"synthese"}')
