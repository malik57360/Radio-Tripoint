"""
Voix de Tripo pour heytripo.fr : la même que dans les vidéos de Radio Tripoint.

Piper (voix SIWIS, CC BY 4.0) puis le « traitement Tripo » des vidéos :
  ffmpeg asetrate=22050*1.28, atempo=0.86, volume=1.4
reproduit sans ffmpeg :
  - atempo 0.86  -> parole plus lente à la synthèse (length_scale / 0.86) ;
  - asetrate 1.28 -> même échantillons, fréquence annoncée × 1,28 (voix plus
    aiguë et plus rapide d'autant) ;
  - volume 1.4   -> gain, borné pour ne pas saturer.
POST {"texte": "..."} -> audio/wav. Rien n'est enregistré.
"""
import array
import io
import json
import os
import wave
from http.server import BaseHTTPRequestHandler

from piper import PiperVoice, SynthesisConfig

MODELE = os.path.join(os.path.dirname(__file__), "voix", "fr-siwis-medium.onnx")
MAX_TEXTE = 900
ORIGINES = (
    "https://heytripo.fr",
    "https://www.heytripo.fr",
    "https://tripo.radio-tripoint-officiel.fr",
    "https://www.radio-tripoint-officiel.fr",
    "https://radio-tripoint-officiel.fr",
)

_voix = None


def voix():
    global _voix
    if _voix is None:
        _voix = PiperVoice.load(MODELE)
    return _voix


def synthese(texte: str) -> bytes:
    brut = io.BytesIO()
    with wave.open(brut, "wb") as w:
        voix().synthesize_wav(texte, w, syn_config=SynthesisConfig(length_scale=1 / 0.86))
    brut.seek(0)
    with wave.open(brut, "rb") as r:
        taux, largeur, canaux = r.getframerate(), r.getsampwidth(), r.getnchannels()
        donnees = r.readframes(r.getnframes())
    if largeur == 2:
        ech = array.array("h", donnees)
        for i, v in enumerate(ech):
            ech[i] = max(-32768, min(32767, int(v * 1.4)))
        donnees = ech.tobytes()
    sortie = io.BytesIO()
    with wave.open(sortie, "wb") as w:
        w.setnchannels(canaux)
        w.setsampwidth(largeur)
        w.setframerate(int(taux * 1.28))
        w.writeframes(donnees)
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
