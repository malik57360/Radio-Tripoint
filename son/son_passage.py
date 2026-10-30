"""
Son du passage vers les découvertes musicales (2,5 s) : un souffle qui
monte, une frappe sur « Les 5 », trois notes de cloche (la mineur) sur les
mots. Repères calqués sur PassageDecouvertes (Compil.tsx). Ramené à -14 LUFS.

  python3 son/son_passage.py <sortie.wav>
"""
import subprocess
import sys
import tempfile
import wave

import numpy as np

TAUX = 44100
FPS = 30
DUREE = 75 / FPS
N = int(DUREE * TAUX)
rng = np.random.default_rng(3)


def t_(d):
    return np.arange(int(d * TAUX)) / TAUX


def poser(piste, son, t, g=1.0):
    i = int(t * TAUX)
    m = min(len(son), len(piste) - i)
    piste[i : i + m] += son[:m] * g


def lisser(x, k):
    return np.convolve(x, np.ones(k) / k, "same")


def souffle(d):
    t = t_(d)
    return lisser(rng.standard_normal(len(t)), 30) * (t / d) ** 2


def impact(d=1.6):
    t = t_(d)
    b = lisser(rng.standard_normal(len(t)), 60)
    return np.sin(2 * np.pi * 48 * t) * np.exp(-t * 3.5) + b * np.exp(-t * 6) * 2


def cloche(f, d=0.9):
    t = t_(d)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.76 * t)) * np.minimum(1, t / 0.003) * np.exp(-t / 0.3)


x = np.zeros(N)
poser(x, souffle(0.25), 0, 0.5)
poser(x, impact(), 7 / FPS, 0.6)
for k, f in enumerate((880.0, 1046.5, 1318.5)):
    poser(x, cloche(f), (12 + k * 5) / FPS, 0.35)
t = np.arange(N) / TAUX
x *= np.minimum(1, (DUREE - t) / 0.3)
x = np.tanh(x * 1.2) / np.tanh(1.2)

with tempfile.TemporaryDirectory() as d:
    brut = f"{d}/brut.wav"
    with wave.open(brut, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(TAUX)
        w.writeframes((np.clip(x / np.abs(x).max(), -1, 1) * 32767 * 0.9).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", brut, "-af", "volume=-6dB", "-ar", str(TAUX), "-ac", "2", sys.argv[1]], check=True)
