"""
Son de « Génération Z · Se faire entendre » : les voix des segments de
genz/decoupe.py à l'image près, sur un morceau original de la rubrique
(la mineur, la → fa → do → sol, 88 BPM, beat feutré façon lo-fi : grosse
caisse ronde, claps sur 2 et 4, charleston en croches avec une roulade toutes
les quatre mesures, basse sur la fondamentale, nappe et petit arpège).

Plein volume à l'ouverture, sur les intertitres et à la fin ; sous la parole,
il ne reste que la nappe, la basse et un pouls léger, retirés de 16 dB.
Bruitages sur les repères de GenerationZ.tsx (lettres du titre, aplats
jaunes, autocollants). Le tout ramené à -14 LUFS.

  python3 son_genz.py <dossier-sons> <timeline.json> <sortie.wav>
"""
import json
import re
import subprocess
import sys
import tempfile

import numpy as np

from son_concours import souffle_passage
from son_duel import TAUX, FPS, basse, charleston, claquement, ecrire, grosse_caisse, lire, note_cloche, passe_haut, poser, t_axe
from son_teaser import blip, impact, montee, nappe, tic

TEMPS = 60 / 88
# La mineur : Am, F, C, G — (fondamentale de la basse, accord de la nappe).
ACCORDS = [
    (110.0, [220.0, 261.63, 329.63]),
    (87.31, [174.61, 220.0, 261.63]),
    (65.41, [261.63, 329.63, 392.0]),
    (98.0, [196.0, 246.94, 293.66]),
]
ARPEGE = [0, 2, 1, 2, 0, 1, 2, 1]


def morceau(n, sections):
    """sections : [(t0, t1, {"kick", "clap", "hat", "basse", "arp", "nappe", "pouls"})]."""
    pistes = {k: np.zeros(n) for k in ("kick", "clap", "hat", "basse", "arp", "nappe")}
    actif = lambda t, inst: any(a <= t < b and inst in s for a, b, s in sections)
    double = TEMPS / 4
    mesure = 0
    while True:
        t0 = mesure * 4 * TEMPS
        if t0 >= n / TAUX:
            break
        racine, acc = ACCORDS[mesure % 4]
        if actif(t0, "nappe"):
            poser(pistes["nappe"], nappe(acc, 4 * TEMPS + 0.6, attaque=0.25, relache=0.6), t0)
        for pas in range(16):
            t = t0 + pas * double
            if pas in (0, 6, 10) and (actif(t, "kick") or (pas == 0 and actif(t, "pouls"))):
                poser(pistes["kick"], grosse_caisse(), t, 1.0 if pas == 0 else 0.75)
            if pas in (4, 12) and actif(t, "clap"):
                poser(pistes["clap"], claquement(), t)
            roulade = mesure % 4 == 3 and pas >= 12
            if actif(t, "hat") and (pas % 2 == 0 or roulade):
                poser(pistes["hat"], charleston(ouvert=pas == 14 and not roulade), t, 0.55 if pas % 4 else 0.8)
            if pas in (0, 6, 10) and actif(t, "basse"):
                poser(pistes["basse"], basse(racine, double * (6 if pas == 0 else 4) * 0.95), t, 1.0 if pas == 0 else 0.8)
            if pas % 2 == 0 and actif(t, "arp"):
                poser(pistes["arp"], note_cloche(acc[ARPEGE[pas // 2]] * 2, 0.4), t, 0.9 if pas % 4 == 0 else 0.6)
        mesure += 1
    return (
        pistes["kick"] * 0.95
        + pistes["clap"] * 0.4
        + pistes["hat"] * 0.11
        + pistes["basse"] * 0.6
        + pistes["arp"] * 0.13
        + pistes["nappe"] * 0.22
    )


def main(dossier, chemin_timeline, sortie):
    segs = json.load(open(chemin_timeline))
    debuts = np.cumsum([0] + [g["images"] for g in segs[:-1]]) / FPS
    D = {g["k"]: d for g, d in zip(segs, debuts)}
    duree = sum(g["images"] for g in segs) / FPS
    n = int(duree * TAUX)
    FIN = len(segs) - 1

    voix = np.zeros(n)
    retrait = np.zeros(n)
    for g, d in zip(segs, debuts):
        if g["role"] != "parole":
            continue
        x = passe_haut(lire(f"{dossier}/seg{g['k']}.wav"), 80)
        m = min(len(x), int(g["images"] / FPS * TAUX), n - int(d * TAUX))
        x = x[:m]
        fen = int(0.05 * TAUX)
        rms = np.sqrt(np.mean(x[: len(x) // fen * fen].reshape(-1, fen) ** 2, axis=1))
        parle = np.sort(rms)[int(len(rms) * 0.6) :].mean()
        x = 0.95 * np.tanh(x / max(1e-9, parle) * 0.16 / 0.95)
        f = int(0.008 * TAUX)
        x[:f] *= np.linspace(0, 1, f)
        x[-f:] *= np.linspace(1, 0, f)
        i = int(d * TAUX)
        voix[i : i + m] += x
        retrait[i : i + m] = 16

    tout = {"kick", "clap", "hat", "basse", "arp", "nappe"}
    sous_parole = {"nappe", "basse", "pouls", "hat"}
    sections = [(0, D[1], {"nappe", "arp", "basse"})]
    for g, d in zip(segs, debuts):
        fin_g = d + g["images"] / FPS
        if g["role"] == "chapitre":
            sections.append((d, fin_g, tout))
        elif g["role"] == "parole":
            sections.append((d, fin_g, sous_parole))
        elif g["role"] == "fin":
            sections.append((d, duree, tout))
    musique = morceau(n, sections)

    fx = np.zeros(n)
    # Ouverture : les lettres du titre, l'autocollant, la montée vers le premier aplat.
    for j in range(12):
        poser(fx, tic(grave=j % 2 == 1), (4 + j * 2) / FPS, 0.12)
    poser(fx, impact()[: int(1.2 * TAUX)], 26 / FPS, 0.35)
    poser(fx, blip(900, 1300, 0.08), 36 / FPS, 0.25)
    poser(fx, montee(D[1] - 1.6, D[1]), D[1] - 1.6, 0.22)
    # Intertitres : souffle à l'entrée de l'aplat, frappe sur le chiffre.
    for g, d in zip(segs, debuts):
        if g["role"] == "chapitre":
            poser(fx, souffle_passage(0.4), d - 0.12, 0.3)
            poser(fx, impact(), d + 4 / FPS, 0.6)
            poser(fx, souffle_passage(0.4), d + g["images"] / FPS - 0.25, 0.2)
    # Autocollants : un petit clic, discret sous la voix (repères de GenerationZ.tsx).
    for seg, t in ((2, 8.0), (2, 19.2), (3, 11.2), (3, 20.6), (5, 3.8), (7, 17.5), (7, 22.75), (8, 6.3), (8, 17.2), (8, 22.4)):
        poser(fx, blip(1200, 1500, 0.05), D[seg] + t, 0.14)
    # Fin : frappe sur la citation, puis sur la rubrique.
    poser(fx, impact(), D[FIN], 0.55)
    poser(fx, impact()[: int(1.5 * TAUX)], D[FIN] + 82 / FPS, 0.45)

    avance = int(0.15 * TAUX)
    retrait = np.maximum(retrait, np.concatenate([retrait[avance:], np.zeros(avance)]))
    lisse = np.zeros(n)
    acc = 0.0
    a_att, a_rel = np.exp(-1 / (0.06 * TAUX)), np.exp(-1 / (0.2 * TAUX))
    for k in range(n):
        c = a_att if retrait[k] > acc else a_rel
        acc = c * acc + (1 - c) * retrait[k]
        lisse[k] = acc
    gain = 10 ** (-lisse / 20)
    t = t_axe(duree)[:n]
    fondu = np.minimum(1, t / 0.1) * np.minimum(1, (duree - t) / 0.6)

    musique = musique / max(1e-9, np.abs(musique).max()) * 0.45
    fx = np.tanh(fx * 1.2) / np.tanh(1.2) * 0.5
    fond = (musique * gain + fx * np.maximum(gain, 0.35)) * fondu
    mix = fond + voix
    if len(sys.argv) > 4:
        ecrire(sortie.replace(".wav", "-voix.wav"), voix)
        ecrire(sortie.replace(".wav", "-fond.wav"), fond)
    with tempfile.TemporaryDirectory() as d:
        ecrire(f"{d}/m.wav", mix / max(1e-9, np.abs(mix).max()) * 0.9)
        subprocess.run(
            ["ffmpeg", "-v", "error", "-y", "-i", f"{d}/m.wav", "-af", "alimiter=limit=0.5:attack=2:release=80:level=false", f"{d}/l.wav"],
            check=True,
        )
        mesure = subprocess.run(
            ["ffmpeg", "-hide_banner", "-nostats", "-i", f"{d}/l.wav", "-af", "ebur128", "-f", "null", "-"],
            check=True, capture_output=True, text=True,
        ).stderr
        sonie = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", mesure)[-1])
        subprocess.run(
            ["ffmpeg", "-v", "error", "-y", "-i", f"{d}/l.wav", "-af", f"volume={-14 - sonie:.2f}dB,alimiter=limit=0.79:attack=1:release=60:level=false", "-ar", str(TAUX), "-ac", "1", sortie],
            check=True,
        )
    print("durée", round(duree, 2), "s")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3])

