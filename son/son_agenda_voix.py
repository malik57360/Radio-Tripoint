"""
Son de l'agenda du week-end raconté par Tripo : le minutage suit les
répliques (public/agenda-voix/duree.json) et il est écrit dans
minutage.json, que TripoWeekend.tsx relit ; puis le morceau d'Halloween de
son_weekend.py (la mineur, 104 BPM), baissé de 12 dB sous la voix, des
souffles sur chaque carte et la voix de Tripo par-dessus. Ramené à -14 LUFS.

  python3 son/son_agenda_voix.py <sortie.wav> [public/agenda-voix-de]
Le second argument choisit le dossier des répliques (version allemande).
"""
import json
import math
import subprocess
import sys
import tempfile
import wave

import numpy as np

TAUX = 44100
FPS = 30
DOSSIER = sys.argv[2] if len(sys.argv) > 2 else "public/agenda-voix"
durees = json.load(open(f"{DOSSIER}/duree.json"))
N_CARTES = 5

# Minutage, en images : chaque scène dure le temps de sa réplique (avec un minimum).
intro = max(120, math.ceil((durees["v0"] + 1.2) * FPS))
cartes = [max(132, math.ceil((durees[f"v{k + 1}"] + 1.0) * FPS)) for k in range(N_CARTES)]
outro = max(150, math.ceil((durees["v6"] + 1.8) * FPS))
debuts = [intro + sum(cartes[:k]) for k in range(N_CARTES)]
debut_outro = intro + sum(cartes)
total = debut_outro + outro
voix = [(0, 18)] + [(k + 1, debuts[k] + 10) for k in range(N_CARTES)] + [(6, debut_outro + 12)]
json.dump(
    {"intro": intro, "cartes": cartes, "outro": outro, "voix": [{"n": n, "image": i} for n, i in voix]},
    open(f"{DOSSIER}/minutage.json", "w"),
    indent=1,
)

DUREE = total / FPS
N = int(DUREE * TAUX)
TEMPS = 60 / 104
rng = np.random.default_rng(7)


def t_(d):
    return np.arange(int(d * TAUX)) / TAUX


def env(n, a=0.005, r=0.2):
    t = np.arange(n) / TAUX
    return np.minimum(1, t / a) * np.exp(-t / r)


def poser(piste, son, t, g=1.0):
    i = int(t * TAUX)
    if i >= len(piste):
        return
    m = min(len(son), len(piste) - i)
    piste[i : i + m] += son[:m] * g


def kick():
    t = t_(0.45)
    f = 45 + 110 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / TAUX) * np.exp(-t * 7)


def clap():
    t = t_(0.25)
    b = np.convolve(rng.standard_normal(len(t)), np.ones(6) / 6, "same")
    return b * (np.exp(-t * 25) + 0.4 * np.exp(-((t - 0.012) ** 2) / 2e-5))


def hat(ouvert=False):
    t = t_(0.3 if ouvert else 0.06)
    b = rng.standard_normal(len(t))
    b = b - np.convolve(b, np.ones(3) / 3, "same")
    return b * np.exp(-t * (12 if ouvert else 70))


def basse(f, d):
    t = t_(d)
    s = np.sign(np.sin(2 * np.pi * f * t)) * 0.5 + np.sin(2 * np.pi * f * t)
    return np.convolve(s, np.ones(18) / 18, "same") * env(len(t), 0.01, d * 0.6)


def cloche(f, d=0.6):
    t = t_(d)
    return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.76 * t)) * env(len(t), 0.002, 0.18)


def orgue(freqs, d):
    t = t_(d)
    s = sum(np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t) for f in freqs)
    return s * (1 + 0.004 * np.sin(2 * np.pi * 5 * t)) * np.minimum(1, t / 0.15) * np.minimum(1, (d - t) / 0.2)


def souffle(d=0.5):
    t = t_(d)
    return np.convolve(rng.standard_normal(len(t)), np.ones(40) / 40, "same") * np.sin(np.pi * t / d) ** 2


def impact():
    t = t_(1.4)
    b = np.convolve(rng.standard_normal(len(t)), np.ones(60) / 60, "same")
    return np.sin(2 * np.pi * 50 * t) * np.exp(-t * 4) + b * np.exp(-t * 6) * 2


def lire(chemin):
    with wave.open(chemin) as w:
        assert w.getframerate() == TAUX
        return np.frombuffer(w.readframes(w.getnframes()), dtype="<i2") / 32768


ACCORDS = [
    (110.0, [220.0, 261.63, 329.63]),
    (87.31, [174.61, 220.0, 261.63]),
    (65.41, [261.63, 329.63, 392.0]),
    (82.41, [207.65, 246.94, 329.63]),
]
ARP = [0, 2, 1, 2, 0, 1, 2, 1]
p = {k: np.zeros(N) for k in ("kick", "clap", "hat", "basse", "cloche", "orgue")}
mesure = 0
while mesure * 4 * TEMPS < DUREE:
    t0 = mesure * 4 * TEMPS
    racine, acc = ACCORDS[mesure % 4]
    poser(p["orgue"], orgue(acc, 4 * TEMPS), t0)
    calme = t0 < intro / FPS - 0.2
    for pas in range(16):
        t = t0 + pas * TEMPS / 4
        if not calme and pas in (0, 8, 10):
            poser(p["kick"], kick(), t)
        if not calme and pas in (4, 12):
            poser(p["clap"], clap(), t)
        if pas % 2 == 0:
            poser(p["hat"], hat(pas == 14), t, 0.6 if pas % 4 else 1)
        if pas in (0, 6, 10, 14):
            poser(p["basse"], basse(racine, TEMPS * 0.9), t, 1 if pas == 0 else 0.7)
        if pas % 2 == 0:
            poser(p["cloche"], cloche(acc[ARP[pas // 2]] * 2), t, 0.8 if pas % 4 else 1)
    mesure += 1
musique = p["kick"] * 0.9 + p["clap"] * 0.35 + p["hat"] * 0.08 + p["basse"] * 0.45 + p["cloche"] * 0.12 + p["orgue"] * 0.05
musique = musique / np.abs(musique).max() * 0.5

fx = np.zeros(N)
poser(fx, impact(), 44 / FPS, 0.35)
for k in range(N_CARTES):
    poser(fx, souffle(0.45), debuts[k] / FPS - 0.2, 0.5)
poser(fx, impact(), debut_outro / FPS, 0.45)

# La voix de Tripo, et la musique qui s'efface dessous (12 dB, attaque 0,15 s, retour 0,4 s).
parole = np.zeros(N)
retrait = np.zeros(N)
for n, image in voix:
    x = lire(f"{DOSSIER}/v{n}.wav")
    x = x / max(1e-9, np.abs(x).max()) * 0.9
    i = int(image / FPS * TAUX)
    m = min(len(x), N - i)
    parole[i : i + m] += x[:m]
    retrait[max(0, i - int(0.15 * TAUX)) : i + m] = 12
lisse = np.zeros(N)
acc_ = 0.0
a_att, a_rel = np.exp(-1 / (0.06 * TAUX)), np.exp(-1 / (0.4 * TAUX))
for k in range(N):
    c = a_att if retrait[k] > acc_ else a_rel
    acc_ = c * acc_ + (1 - c) * retrait[k]
    lisse[k] = acc_
gain = 10 ** (-lisse / 20)

t = np.arange(N) / TAUX
fondu = np.minimum(1, t / 0.3) * np.minimum(1, (DUREE - t) / 0.8)
mix = (musique * gain + np.tanh(fx * 1.2) / np.tanh(1.2) * 0.45 * np.maximum(gain, 0.4)) * fondu + parole * 0.85

with tempfile.TemporaryDirectory() as d:
    brut = f"{d}/brut.wav"
    with wave.open(brut, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(TAUX)
        w.writeframes((np.clip(mix / max(1e-9, np.abs(mix).max()) * 0.9, -1, 1) * 32767).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", brut, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", str(TAUX), "-ac", "2", sys.argv[1]], check=True)
print("minutage", intro, cartes, outro, "total", total, "images =", round(DUREE, 2), "s")
