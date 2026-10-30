"""
Son de « Génération Z · Pas fan de la politique » : la voix du rush
(rushes-genz/sons/parole.wav, nettoyée) posée à 3,5 s, sur le morceau de la
rubrique (la mineur, la → fa → do → sol, 88 BPM, beat feutré façon lo-fi).
Plein volume sous le titre, la citation et le générique ; sous la parole, il
ne reste que la nappe, la basse et un pouls léger, retirés de 16 dB.
Repères calqués sur GenZPolitique.tsx (TITRE 105, PAROLE 318, CITATION 105,
FIN 105 images à 30 i/s). Ramené à -14 LUFS.

  python3 son/son_genz_politique.py <parole.wav> <sortie.wav>
"""
import re
import subprocess
import sys
import tempfile
import wave

import numpy as np

TAUX = 44100
FPS = 30
TITRE, PAROLE, CITATION, FIN = 105, 318, 105, 105
DUREE = (TITRE + PAROLE + CITATION + FIN) / FPS
N = int(DUREE * TAUX)
D_PAROLE = TITRE / FPS
D_CITATION = (TITRE + PAROLE) / FPS
D_FIN = (TITRE + PAROLE + CITATION) / FPS
TEMPS = 60 / 88
rng = np.random.default_rng(11)


def t_(d):
    return np.arange(int(d * TAUX)) / TAUX


def env(n, a=0.005, r=0.2):
    t = np.arange(n) / TAUX
    return np.minimum(1, t / a) * np.exp(-t / r)


def poser(piste, son, t, g=1.0):
    i = int(t * TAUX)
    if i < 0 or i >= len(piste):
        return
    m = min(len(son), len(piste) - i)
    piste[i : i + m] += son[:m] * g


def lisser(x, k):
    return np.convolve(x, np.ones(k) / k, "same")


def kick():
    t = t_(0.5)
    f = 42 + 90 * np.exp(-t * 26)
    return np.sin(2 * np.pi * np.cumsum(f) / TAUX) * np.exp(-t * 6)


def clap():
    t = t_(0.3)
    b = lisser(rng.standard_normal(len(t)), 8)
    return b * (np.exp(-t * 18) + 0.5 * np.exp(-((t - 0.015) ** 2) / 3e-5))


def hat(ouvert=False):
    t = t_(0.25 if ouvert else 0.05)
    b = rng.standard_normal(len(t))
    b = b - lisser(b, 3)
    return b * np.exp(-t * (14 if ouvert else 80))


def basse(f, d):
    t = t_(d)
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)
    return s * np.minimum(1, t / 0.01) * np.minimum(1, (d - t) / 0.05)


def cloche(f, d=0.5):
    t = t_(d)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.76 * t)) * env(len(t), 0.003, 0.22)


def nappe(freqs, d):
    t = t_(d)
    s = sum(np.sin(2 * np.pi * f * t + 0.3 * np.sin(2 * np.pi * 0.3 * t)) + 0.2 * np.sin(4 * np.pi * f * t) for f in freqs)
    return lisser(s, 6) * np.minimum(1, t / 0.3) * np.minimum(1, np.maximum(0, d - t) / 0.6)


def souffle(d=0.5):
    t = t_(d)
    return lisser(rng.standard_normal(len(t)), 40) * np.sin(np.pi * t / d) ** 2


def impact(d=1.4):
    t = t_(d)
    b = lisser(rng.standard_normal(len(t)), 60)
    return np.sin(2 * np.pi * 48 * t) * np.exp(-t * 4) + b * np.exp(-t * 6) * 2


def lire(chemin):
    with wave.open(chemin) as w:
        assert w.getframerate() == TAUX and w.getnchannels() == 1
        return np.frombuffer(w.readframes(w.getnframes()), dtype="<i2") / 32768


def ecrire(chemin, x):
    with wave.open(chemin, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(TAUX)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())


# La mineur : Am, F, C, G — (fondamentale de la basse, accord de la nappe).
ACCORDS = [
    (110.0, [220.0, 261.63, 329.63]),
    (87.31, [174.61, 220.0, 261.63]),
    (65.41, [261.63, 329.63, 392.0]),
    (98.0, [196.0, 246.94, 293.66]),
]
ARP = [0, 2, 1, 2, 0, 1, 2, 1]
TOUT = {"kick", "clap", "hat", "basse", "arp", "nappe"}
SOUS_PAROLE = {"nappe", "basse", "pouls", "hat"}
SECTIONS = [(0, D_PAROLE, TOUT - {"clap"}), (D_PAROLE, D_CITATION, SOUS_PAROLE), (D_CITATION, DUREE, TOUT)]


def actif(t, inst):
    return any(a <= t < b and inst in s for a, b, s in SECTIONS)


p = {k: np.zeros(N) for k in ("kick", "clap", "hat", "basse", "arp", "nappe")}
mesure = 0
while mesure * 4 * TEMPS < DUREE:
    t0 = mesure * 4 * TEMPS
    racine, acc = ACCORDS[mesure % 4]
    poser(p["nappe"], nappe(acc, 4 * TEMPS + 0.6), t0)
    for pas in range(16):
        t = t0 + pas * TEMPS / 4
        if pas in (0, 6, 10) and (actif(t, "kick") or (pas == 0 and actif(t, "pouls"))):
            poser(p["kick"], kick(), t, 1 if pas == 0 else 0.75)
        if pas in (4, 12) and actif(t, "clap"):
            poser(p["clap"], clap(), t)
        roulade = mesure % 4 == 3 and pas >= 12
        if actif(t, "hat") and (pas % 2 == 0 or roulade):
            poser(p["hat"], hat(pas == 14 and not roulade), t, 0.55 if pas % 4 else 0.8)
        if pas in (0, 6, 10) and actif(t, "basse"):
            poser(p["basse"], basse(racine, TEMPS / 4 * (6 if pas == 0 else 4) * 0.95), t, 1 if pas == 0 else 0.8)
        if pas % 2 == 0 and actif(t, "arp"):
            poser(p["arp"], cloche(acc[ARP[pas // 2]] * 2, 0.4), t, 0.9 if pas % 4 == 0 else 0.6)
    mesure += 1
musique = p["kick"] * 0.95 + p["clap"] * 0.4 + p["hat"] * 0.11 + p["basse"] * 0.6 + p["arp"] * 0.13 + p["nappe"] * 0.22

# La voix, ramenée à un niveau parlé régulier.
voix = np.zeros(N)
x = lire(sys.argv[1])
fen = int(0.05 * TAUX)
rms = np.sqrt(np.mean(x[: len(x) // fen * fen].reshape(-1, fen) ** 2, axis=1))
parle = np.sort(rms)[int(len(rms) * 0.6) :].mean()
x = 0.95 * np.tanh(x / max(1e-9, parle) * 0.16 / 0.95)
poser(voix, x, D_PAROLE)

# Bruitages : titre, entrée de la parole, citation, générique.
fx = np.zeros(N)
poser(fx, impact(1.2), 14 / FPS, 0.35)
poser(fx, souffle(0.45), D_PAROLE - 0.3, 0.3)
poser(fx, souffle(0.45), D_CITATION - 0.2, 0.3)
poser(fx, impact(), D_CITATION + 7 / FPS, 0.55)
poser(fx, impact(1.5), D_FIN + 4 / FPS, 0.45)

# Musique retirée de 16 dB sous la parole, avec un peu d'avance et des rampes douces.
t = np.arange(N) / TAUX
retrait = np.where((t >= D_PAROLE - 0.15) & (t < D_CITATION - 0.1), 16.0, 0.0)
lisse = np.zeros(N)
acc = 0.0
a_att, a_rel = np.exp(-1 / (0.06 * TAUX)), np.exp(-1 / (0.25 * TAUX))
for k in range(N):
    c = a_att if retrait[k] > acc else a_rel
    acc = c * acc + (1 - c) * retrait[k]
    lisse[k] = acc
gain = 10 ** (-lisse / 20)
fondu = np.minimum(1, t / 0.1) * np.minimum(1, (DUREE - t) / 0.8)

musique = musique / max(1e-9, np.abs(musique).max()) * 0.45
fx = np.tanh(fx * 1.2) / np.tanh(1.2) * 0.5
mix = (musique * gain + fx * np.maximum(gain, 0.35)) * fondu + voix

with tempfile.TemporaryDirectory() as d:
    ecrire(f"{d}/m.wav", mix / max(1e-9, np.abs(mix).max()) * 0.9)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{d}/m.wav", "-af", "alimiter=limit=0.5:attack=2:release=80:level=false", f"{d}/l.wav"], check=True)
    mesure_ = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", f"{d}/l.wav", "-af", "ebur128", "-f", "null", "-"], check=True, capture_output=True, text=True).stderr
    sonie = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", mesure_)[-1])
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", f"{d}/l.wav", "-af", f"volume={-14 - sonie:.2f}dB,alimiter=limit=0.79:attack=1:release=60:level=false", "-ar", str(TAUX), "-ac", "2", sys.argv[2]],
        check=True,
    )
print("durée", round(DUREE, 2), "s")
