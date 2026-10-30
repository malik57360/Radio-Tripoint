"""
Son de « Tripo te présente le week-end » : un petit morceau original
d'Halloween léger (la mineur, 104 BPM : grosse caisse, claps, charleston,
basse, cloches en arpège, nappe d'orgue), des souffles sur chaque carte et
des frappes sur le titre et la fin. Repères calqués sur TripoWeekend.tsx
(INTRO 120, CARTE 132, OUTRO 150 images à 30 i/s). Ramené à -14 LUFS.

  python3 son/son_weekend.py <sortie.wav>
"""
import subprocess
import sys
import tempfile
import wave

import numpy as np

TAUX = 44100
FPS = 30
INTRO, CARTE, OUTRO, N_CARTES = 120, 132, 150, 5
DUREE = (INTRO + CARTE * N_CARTES + OUTRO) / FPS
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
    b = rng.standard_normal(len(t))
    b = np.convolve(b, np.ones(6) / 6, "same")
    return b * (np.exp(-t * 25) + 0.4 * np.exp(-((t - 0.012) ** 2) / 2e-5))


def hat(ouvert=False):
    t = t_(0.3 if ouvert else 0.06)
    b = rng.standard_normal(len(t))
    b = b - np.convolve(b, np.ones(3) / 3, "same")
    return b * np.exp(-t * (12 if ouvert else 70))


def basse(f, d):
    t = t_(d)
    s = np.sign(np.sin(2 * np.pi * f * t)) * 0.5 + np.sin(2 * np.pi * f * t)
    s = np.convolve(s, np.ones(18) / 18, "same")
    return s * env(len(t), 0.01, d * 0.6)


def cloche(f, d=0.6):
    t = t_(d)
    return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.76 * t)) * env(len(t), 0.002, 0.18)


def orgue(freqs, d):
    t = t_(d)
    s = sum(np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t) for f in freqs)
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5 * t)
    s = s * vib
    return s * np.minimum(1, t / 0.15) * np.minimum(1, (d - t) / 0.2)


def souffle(d=0.5):
    t = t_(d)
    b = rng.standard_normal(len(t))
    b = np.convolve(b, np.ones(40) / 40, "same")
    return b * np.sin(np.pi * t / d) ** 2


def impact():
    t = t_(1.4)
    b = rng.standard_normal(len(t))
    b = np.convolve(b, np.ones(60) / 60, "same")
    return 0.8 * kick()[: len(t)].tolist() + [0] * 0 if False else (np.sin(2 * np.pi * 50 * t) * np.exp(-t * 4) + b * np.exp(-t * 6) * 2)


# Am, F, C, E : fondamentale de la basse, accord de l'orgue, note des cloches
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
    intro = t0 < INTRO / FPS - 0.2
    for pas in range(16):
        t = t0 + pas * TEMPS / 4
        if not intro and pas in (0, 8, 10):
            poser(p["kick"], kick(), t)
        if not intro and pas in (4, 12):
            poser(p["clap"], clap(), t)
        if pas % 2 == 0:
            poser(p["hat"], hat(pas == 14), t, 0.6 if pas % 4 else 1)
        if pas in (0, 6, 10, 14):
            poser(p["basse"], basse(racine, TEMPS * 0.9), t, 1 if pas == 0 else 0.7)
        if pas % 2 == 0:
            poser(p["cloche"], cloche(acc[ARP[pas // 2]] * 2), t, 0.8 if pas % 4 else 1)
    mesure += 1

musique = p["kick"] * 0.9 + p["clap"] * 0.35 + p["hat"] * 0.08 + p["basse"] * 0.45 + p["cloche"] * 0.12 + p["orgue"] * 0.05

fx = np.zeros(N)
poser(fx, impact(), 44 / FPS, 0.35)  # le titre « week-end »
poser(fx, cloche(1318.5, 0.5), 22 / FPS, 0.5)  # la bulle de Tripo
for k in range(N_CARTES):
    debut = (INTRO + k * CARTE) / FPS
    poser(fx, souffle(0.45), debut - 0.2, 0.5)
    poser(fx, cloche(1760, 0.4), debut + 12 / FPS, 0.3)  # la date
poser(fx, impact(), (INTRO + N_CARTES * CARTE) / FPS, 0.45)  # la fin

t = np.arange(N) / TAUX
fondu = np.minimum(1, t / 0.3) * np.minimum(1, (DUREE - t) / 0.8)
mix = (musique / np.abs(musique).max() * 0.7 + fx * 0.6) * fondu
mix = np.tanh(mix * 1.2) / np.tanh(1.2)

with tempfile.TemporaryDirectory() as d:
    brut = f"{d}/brut.wav"
    with wave.open(brut, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(TAUX)
        w.writeframes((np.clip(mix, -1, 1) * 32767 * 0.9).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", brut, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", str(TAUX), "-ac", "2", sys.argv[1]], check=True)
print("durée", round(DUREE, 2), "s")
