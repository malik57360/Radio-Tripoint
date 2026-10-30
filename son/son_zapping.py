"""
Son du zapping du week-end : le son de chaque plan (outils/decoupe_zapping.py),
bout à bout aux images de Zapping.tsx, et les bruitages de la télé :
allumage, neige à chaque changement de chaîne, « boing » sur l'essai raté,
klaxon de stade et cloche sur le panier, bip de censure sur « coupé », la
télé qui s'éteint. Un petit rythme (112 BPM) sous les plans sans parole ni
musique. Ramené à -14 LUFS.

  python3 son/son_zapping.py <dossier-sons> <sortie.wav>
"""
import json
import subprocess
import sys
import tempfile
import wave

import numpy as np

TAUX = 44100
FPS = 30
OUVERTURE = 75
FIGE_RATE, FIGE_COUPE = 18, 24
dossier, sortie = sys.argv[1], sys.argv[2]
plans = json.load(open("public/zapping/timeline.json"))
debuts = [OUVERTURE + sum(p["images"] for p in plans[:k]) for k in range(len(plans))]
total = OUVERTURE + sum(p["images"] for p in plans)
N = int(total / FPS * TAUX)
rng = np.random.default_rng(5)
s = lambda img: img / FPS


def t_(d):
    return np.arange(int(d * TAUX)) / TAUX


def poser(piste, son, t, g=1.0):
    i = int(t * TAUX)
    if i < 0 or i >= len(piste):
        return
    m = min(len(son), len(piste) - i)
    piste[i : i + m] += son[:m] * g


def lire(chemin):
    with wave.open(chemin) as w:
        return np.frombuffer(w.readframes(w.getnframes()), dtype="<i2") / 32768


def neige(d=0.2):
    t = t_(d)
    b = rng.standard_normal(len(t))
    b = b - np.convolve(b, np.ones(4) / 4, "same")
    return b * np.exp(-t / (d * 0.5)) * 0.8


def clic():
    t = t_(0.03)
    return np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 200)


def boing():
    t = t_(0.55)
    f = 520 * np.exp(-t * 3.2) + 90 + 25 * np.sin(2 * np.pi * 14 * t)
    return np.sin(2 * np.pi * np.cumsum(f) / TAUX) * np.exp(-t * 3) * 0.9


def klaxon(d=0.7):
    t = t_(d)
    s_ = sum(2 * ((f * t) % 1) - 1 for f in (233.1, 293.7, 349.2))
    return np.convolve(s_, np.ones(6) / 6, "same") * np.minimum(1, t / 0.02) * np.minimum(1, (d - t) / 0.1) * 0.35


def cloche(f=1568.0, d=0.8):
    t = t_(d)
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.76 * t)) * np.exp(-t * 4)


def bip(d=0.4):
    t = t_(d)
    return np.sin(2 * np.pi * 1000 * t) * np.minimum(1, t / 0.005) * np.minimum(1, (d - t) / 0.005) * 0.6


def extinction():
    t = t_(0.35)
    f = 1400 * np.exp(-t * 9) + 60
    return np.sin(2 * np.pi * np.cumsum(f) / TAUX) * np.exp(-t * 5) * 0.6


def impact():
    t = t_(0.9)
    b = np.convolve(rng.standard_normal(len(t)), np.ones(50) / 50, "same")
    return np.sin(2 * np.pi * 55 * t) * np.exp(-t * 5) + b * np.exp(-t * 7) * 2


def kick():
    t = t_(0.35)
    f = 50 + 120 * np.exp(-t * 35)
    return np.sin(2 * np.pi * np.cumsum(f) / TAUX) * np.exp(-t * 9)


def caisse():
    t = t_(0.2)
    return rng.standard_normal(len(t)) * np.exp(-t * 22) * 0.6 + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.5


def charleston():
    t = t_(0.05)
    b = rng.standard_normal(len(t))
    return (b - np.convolve(b, np.ones(3) / 3, "same")) * np.exp(-t * 80) * 0.5


# Le son des plans
plans_son = np.zeros(N)
for p, d in zip(plans, debuts):
    poser(plans_son, lire(f"{dossier}/{p['nom']}.wav"), s(d))

fx = np.zeros(N)
# Allumage : la télé s'allume, la neige, le titre qui tombe, trois notes.
poser(fx, clic(), s(2), 0.8)
poser(fx, neige(1.1), s(4), 0.5)
poser(fx, impact(), s(18), 0.7)
for k, f in enumerate((784.0, 988.0, 1175.0)):
    poser(fx, cloche(f, 0.5), s(26 + k * 4), 0.35)
for p, d in zip(plans, debuts):
    poser(fx, neige(0.2), s(d) - 0.03, 0.55)
    poser(fx, clic(), s(d), 0.5)
    if p["effet"] == "rate":
        poser(fx, boing(), s(d + p["images"] - FIGE_RATE), 0.9)
    if p["effet"] == "panier":
        poser(fx, cloche(1568.0), s(d + 50), 0.6)
        poser(fx, cloche(2093.0), s(d + 54), 0.5)
        poser(fx, klaxon(), s(d + 52), 1.0)
    if p["effet"] == "coupe":
        poser(fx, bip(0.45), s(d + p["images"] - FIGE_COUPE), 1.0)
        poser(fx, neige(0.8), s(d + p["images"] - FIGE_COUPE), 0.6)
    if p["effet"] == "fin":
        poser(fx, extinction(), s(d + p["images"] - 12), 1.0)

# Petit rythme sous les plans sans parole ni musique.
rythme = np.zeros(N)
SANS_PAROLE = {"squelette", "essai1", "avance", "essai2", "fier", "cygne", "heron"}
temps = 60 / 112
for p, d in zip(plans, debuts):
    if p["nom"] not in SANS_PAROLE:
        continue
    t0, t1 = s(d), s(d + p["images"])
    k = int(np.ceil(t0 / (temps / 2)))
    while k * temps / 2 < t1:
        t = k * temps / 2
        poser(rythme, charleston(), t, 0.5)
        if k % 4 == 0:
            poser(rythme, kick(), t)
        if k % 4 == 2:
            poser(rythme, caisse(), t)
        k += 1

mix = plans_son * 1.0 + np.tanh(fx * 1.1) / np.tanh(1.1) * 0.5 + rythme * 0.18
t = np.arange(N) / TAUX
mix *= np.minimum(1, (total / FPS - t) / 0.05)
with tempfile.TemporaryDirectory() as d:
    brut = f"{d}/brut.wav"
    with wave.open(brut, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(TAUX)
        w.writeframes((np.clip(mix / max(1e-9, np.abs(mix).max()) * 0.9, -1, 1) * 32767).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", brut, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", str(TAUX), "-ac", "2", sortie], check=True)
print("durée", round(total / FPS, 2), "s")
