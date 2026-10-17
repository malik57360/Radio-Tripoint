"""
Oreille de Tripo (appel vocal de heytripo.fr) : la parole en texte, sur le
serveur, sans service payant ni clé.

Modèle : Zipformer français de sherpa-onnx (k2-fsa, licence Apache 2.0,
appris sur Common Voice), en int8. Il reconnaît une phrase de 5 s en moins
d'une seconde, même sur un seul cœur.

POST {"pcm": "<base64>"} : PCM 16 bits, mono, 16 kHz (20 s au plus) -> {"texte": "..."}
     (le son en base64 dans du JSON : du texte passe partout, sans souci
     d'encodage binaire entre la plateforme et la fonction ; le corps brut
     application/octet-stream reste accepté)
GET  -> réveil : charge le modèle d'avance (appelé à l'ouverture d'un appel).
En cas d'échec, la réponse donne le type d'erreur (jamais le son ni le
texte) : l'écran d'appel l'affiche en petit pour qu'on sache quoi réparer.
Rien n'est enregistré : le son n'existe qu'en mémoire, le temps de la requête.
"""
import base64
import json
import os
import shutil
import threading
import time
from http.server import BaseHTTPRequestHandler

import numpy as np
import sherpa_onnx

ICI = os.path.join(os.path.dirname(__file__), "oreille")
# GitHub refuse les fichiers de plus de 100 Mo : l'encodeur est rangé en deux
# morceaux, recollés une fois par instance dans /tmp.
ENCODEUR = "/tmp/tripo-oreille-encodeur.int8.onnx"
TAUX = 16000
MAX_OCTETS = 20 * TAUX * 2
ORIGINES = (
    "https://heytripo.fr",
    "https://www.heytripo.fr",
    "https://tripo.radio-tripoint-officiel.fr",
    "https://www.radio-tripoint-officiel.fr",
    "https://radio-tripoint-officiel.fr",
)

_reco = None
# Le réveil (GET) et la première phrase (POST) peuvent arriver ensemble sur la
# même instance : un seul chargement à la fois, l'autre attend.
_verrou = threading.Lock()


def _encodeur() -> str:
    morceaux = [os.path.join(ICI, f"encodeur.int8.onnx.{i}") for i in (0, 1)]
    attendu = sum(os.path.getsize(m) for m in morceaux)
    # Un fichier incomplet (instance coupée en pleine copie) est refait.
    if os.path.exists(ENCODEUR) and os.path.getsize(ENCODEUR) == attendu:
        return ENCODEUR
    provisoire = f"{ENCODEUR}.{os.getpid()}.{threading.get_ident()}"
    with open(provisoire, "wb") as sortie:
        for chemin in morceaux:
            with open(chemin, "rb") as morceau:
                shutil.copyfileobj(morceau, sortie, 1 << 20)
    if os.path.getsize(provisoire) != attendu:
        os.remove(provisoire)
        raise OSError("encodeur incomplet")
    os.replace(provisoire, ENCODEUR)
    return ENCODEUR


def reco():
    global _reco
    with _verrou:
        if _reco is None:
            _reco = _charger()
    return _reco


def _charger():
    return sherpa_onnx.OnlineRecognizer.from_transducer(
        tokens=os.path.join(ICI, "jetons.txt"),
        encoder=_encodeur(),
        decoder=os.path.join(ICI, "decodeur.int8.onnx"),
        joiner=os.path.join(ICI, "joncteur.int8.onnx"),
        num_threads=2,
        sample_rate=TAUX,
        feature_dim=80,
        decoding_method="greedy_search",
    )


def mise_en_forme(brut: str) -> str:
    """Le modèle écrit en capitales, sans ponctuation : « Salut tripo ça va »."""
    t = " ".join(brut.lower().split())
    return t[:1].upper() + t[1:]


def transcrire(pcm: bytes) -> str:
    echantillons = np.frombuffer(pcm[: len(pcm) // 2 * 2], dtype="<i2").astype(np.float32) / 32768
    r = reco()
    flux = r.create_stream()
    flux.accept_waveform(TAUX, echantillons)
    # Un peu de silence à la fin : le modèle « en continu » finit sa phrase.
    flux.accept_waveform(TAUX, np.zeros(int(0.66 * TAUX), dtype=np.float32))
    flux.input_finished()
    while r.is_ready(flux):
        r.decode_stream(flux)
    return mise_en_forme(r.get_result(flux))


def lire_pcm(corps: bytes, type_contenu: str) -> bytes:
    if "json" in type_contenu:
        return base64.b64decode(json.loads(corps)["pcm"], validate=True)
    return corps


class handler(BaseHTTPRequestHandler):
    def _repondre(self, code: int, corps: dict):
        donnees = json.dumps(corps, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(donnees)))
        self.end_headers()
        self.wfile.write(donnees)

    def _origine_ok(self) -> bool:
        origine = self.headers.get("origin") or ""
        return not origine or origine in ORIGINES or origine.endswith(".vercel.app")

    def do_GET(self):
        # Réveil : l'instance charge le modèle pendant que Tripo dit bonjour.
        try:
            debut = time.time()
            reco()
            return self._repondre(200, {"ok": True, "ms": int((time.time() - debut) * 1000)})
        except Exception as e:
            print(f"[tripo_oreille] réveil impossible : {type(e).__name__} {str(e)[:200]}")
            return self._repondre(500, {"ok": False, "type": type(e).__name__})

    def do_POST(self):
        if not self._origine_ok():
            return self._repondre(403, {"erreur": "origine"})
        try:
            n = int(self.headers.get("content-length") or 0)
        except ValueError:
            n = 0
        if n <= 0 or n > MAX_OCTETS * 2:
            return self._repondre(400, {"erreur": "taille"})
        corps = self.rfile.read(n)
        try:
            pcm = lire_pcm(corps, self.headers.get("content-type") or "")
        except Exception:
            return self._repondre(400, {"erreur": "format"})
        if not pcm or len(pcm) > MAX_OCTETS:
            return self._repondre(400, {"erreur": "taille"})
        try:
            return self._repondre(200, {"texte": transcrire(pcm)})
        except Exception as e:  # journal minimal, sans le son ni le texte
            print(f"[tripo_oreille] échec : {type(e).__name__} {str(e)[:200]}")
            return self._repondre(500, {"erreur": "reconnaissance", "type": type(e).__name__})
