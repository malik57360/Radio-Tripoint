"""
Découpe du zapping du week-end : chaque plan du rush devient une vidéo
1080 × 1920 à 30 i/s (accélérée, ralentie ou figée au besoin) et son son,
dans le même rythme. Le montage (src/zapping/Zapping.tsx) relit
public/zapping/timeline.json.

  python3 outils/decoupe_zapping.py <rush> <public/zapping> <dossier-sons>
"""
import json
import subprocess
import sys

FPS = 30
# (nom, début, fin, vitesse, chaîne, légende, sous-titres [(s, texte)], effet)
PLANS = [
    ("bienvenue", 0.05, 1.45, 1, "CH 01 · Halloween", None, [(0.0, "« Bienvenue ! »")], None),
    ("squelette", 1.55, 3.35, 1, "CH 01 · Halloween", "Ambiance : posée.", [], None),
    ("cornemuse", 4.0, 7.0, 1, "CH 02 · Cornemuse", "Ça souffle fort ce week-end", [], None),
    ("piano", 10.5, 13.0, 1, "CH 03 · Piano bar", "Pendant ce temps…", [], None),
    ("essai1", 30.3, 32.2, 1, "CH 04 · Sport", "Essai n° 1…", [], "rate"),
    ("avance", 32.2, 35.2, 3, "CH 04 · Sport", None, [], "avance"),
    ("essai2", 35.2, 36.95, 1, "CH 04 · Sport", "Essai n° 2…", [], None),
    ("ralenti", 36.2, 37.15, 0.4, "Ralenti", None, [], "panier"),
    ("joie", 37.0, 40.0, 1, "CH 04 · Sport", "La joie.", [(0.0, "« Ouais ! »")], None),
    ("fier", 40.0, 42.0, 1, "CH 04 · Sport", "Fier ? Très fier.", [], "zoom"),
    ("cygne", 42.3, 45.3, 1, "CH 05 · Nature", "Invité surprise : le cygne noir", [], None),
    ("maillot", 46.35, 49.35, 1, "CH 06 · Interview", "Il attend sa question", [(1.7, "« Je pensais qu'il y avait une question »"), (3.15, "« Vidéo, mon gars. »"), (4.05, "« Ah, une vidéo ! »")], "fige_son"),
    ("heron", 52.3, 55.0, 1, "CH 07 · Nature", "Le héron : zéro stress", [], None),
    ("ecureuil", 60.9, 64.9, 1, "CH 07 · Nature", "(Cherchez bien.)", [(0.2, "« Viens voir l'écureuil ! »")], None),
    ("nuit1", 67.0, 68.5, 1, "CH 08 · En direct", None, [(0.0, "« Micro test, c'est bon ? »")], None),
    ("nuit2", 69.0, 72.6, 1, "CH 08 · En direct", None, [(0.0, "« Alors franchement, vous avez fait un travail incroyable. »")], None),
    ("nuit3", 75.9, 79.35, 1, "CH 08 · En direct", "Cadeau !", [(0.0, "« Radio Tripoint a décidé de vous offrir deux places de cinéma. »")], None),
    ("nuit4", 79.4, 81.0, 1, "CH 08 · En direct", None, [(0.0, "« Merci beaucoup ! »")], None),
    ("nuit5", 84.5, 87.45, 1, "CH 08 · En direct", None, [(0.0, "« En plus, il y a un nouveau film qui est sorti… »")], None),
    ("nuit6", 90.2, 94.0, 1, "CH 08 · En direct", None, [(0.0, "« On va pas faire la pub… »"), (1.6, "« On coupe, on coupe, on coupe ! »")], "coupe"),
    ("brouillard", 94.2, 96.2, 1, None, None, [], "fin"),
]
FIGE_SON = 2.0  # « maillot » : l'image se fige, le dialogue continue
FIGE_RATE = 18  # images figées sur « RATÉ »
FIGE_COUPE = 24  # écran de neige « COUPÉ ! »

IMAGE = "scale=1080:1920:flags=lanczos,hqdn3d=1:1:3:3,unsharp=5:5:0.4,eq=contrast=1.05:saturation=1.12"


def main(rush, pub, sons):
    lignes = []
    for nom, a, b, v, chaine, legende, st, effet in PLANS:
        duree_src = b - a
        n = round(duree_src / v * FPS)
        vf = f"setpts=PTS/{v},fps=30,{IMAGE}" if v != 1 else f"fps=30,{IMAGE}"
        if effet == "rate":
            vf += f",tpad=stop_mode=clone:stop_duration={FIGE_RATE / FPS:.4f}"
            n += FIGE_RATE
        duree_son = duree_src
        if effet == "fige_son":
            vf += f",tpad=stop_mode=clone:stop_duration={FIGE_SON:.4f}"
            n += round(FIGE_SON * FPS)
            duree_son = duree_src + FIGE_SON
        subprocess.run(
            ["ffmpeg", "-nostdin", "-v", "error", "-y", "-ss", str(a), "-t", f"{duree_src:.3f}", "-i", rush, "-vf", vf,
             "-frames:v", str(n), "-an", "-c:v", "libx264", "-crf", "17", "-preset", "medium", "-pix_fmt", "yuv420p", f"{pub}/{nom}.mp4"],
            check=True,
        )
        # Son : accéléré façon cassette (aigu), ralenti grave ; figé = silence.
        af = "aresample=44100"
        if v == 3:
            af = "asetrate=44100*3,aresample=44100"
        elif v == 0.4:
            af = "asetrate=44100*0.4,aresample=44100"
        d = n / FPS
        subprocess.run(
            ["ffmpeg", "-nostdin", "-v", "error", "-y", "-ss", str(a), "-t", f"{duree_son:.3f}", "-i", rush, "-vn",
             "-af", f"{af},afade=t=in:d=0.02,afade=t=out:st={max(0, duree_son / v - 0.04):.3f}:d=0.04,apad=whole_dur={d:.4f}",
             "-ac", "1", "-ar", "44100", f"{sons}/{nom}.wav"],
            check=True,
        )
        if effet == "coupe":
            n += FIGE_COUPE
        lignes.append({"nom": nom, "images": n, "chaine": chaine, "legende": legende,
                       "sous_titres": [{"t": t, "texte": x} for t, x in st], "effet": effet})
        print(f"{nom}: {a}-{b}s ×{v} → {n} images", flush=True)
    json.dump(lignes, open(f"{pub}/timeline.json", "w"), ensure_ascii=False, indent=1)
    total = sum(l["images"] for l in lignes)
    print("plans", total, "images =", round(total / FPS, 1), "s")


if __name__ == "__main__":
    main(*sys.argv[1:4])
