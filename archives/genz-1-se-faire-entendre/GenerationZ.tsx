/**
 * « Génération Z · Se faire entendre » : deux jeunes de la rubrique des
 * 15-17 ans, filmés au micro Radio Tripoint sans visage, l'un en allemand,
 * l'autre en français, sur les manifestations, la politique et la montée des
 * extrêmes. Rushes découpés par genz/decoupe.py (public/genz).
 *
 * Langage de la rubrique : jaune du logo, noir, blanc ; titres qui claquent
 * lettre à lettre, intertitres en aplat jaune (01 · 02 · 03), mots-clés en
 * autocollants, zooms sautés au fil des phrases. Les passages en allemand
 * gardent la phrase d'origine au-dessus de la traduction ; les questions de
 * la radio ont leur propre cartouche. Les sous-titres et les mots-clés ne
 * reprennent que ce qui est dit (transcrit et vérifié) ; aucun commentaire
 * n'est ajouté. Personne n'est nommé.
 */
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import timeline from "../../public/genz/timeline.json";
import { C, EXPO, Grain, PREMIUM, prog, SORTIE, texte, titre } from "../annonces/commun";

const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);

type Segment = { k: number; images: number; role: string };
const SEGMENTS = timeline as Segment[];
const DEBUTS = SEGMENTS.reduce<number[]>((acc, _, i) => [...acc, i === 0 ? 0 : acc[i - 1] + SEGMENTS[i - 1].images], []);
export const DUREE_GENZ = SEGMENTS.reduce((t, seg) => t + seg.images, 0);
const FIN = SEGMENTS.length - 1;

const local = (f: number, seg: number) => f - DEBUTS[seg];
const dans = (f: number, seg: number) => f >= DEBUTS[seg] && f < DEBUTS[seg] + SEGMENTS[seg].images;

/** Une ligne de sous-titre : (seconde, texte) ; q = question de la radio ; de = phrase d'origine en allemand. */
type Ligne = { t: number; fr: string; q?: boolean; de?: string };
const L = (t: number, fr: string, extra: Partial<Ligne> = {}): Ligne => ({ t, fr, ...extra });
const Q = (t: number, fr: string) => L(t, fr, { q: true });
const D = (t: number, de: string, fr: string) => L(t, fr, { de });

const SOUS_TITRES: Record<number, Ligne[]> = {
  2: [
    D(0.15, "Hallo zusammen.", "Bonjour à tous."),
    D(1.6, "Ich unterstütze die Demonstration in Frankreich,", "Je soutiens les manifestations en France,"),
    D(4.4, "weil Studenten ihre Meinung sagen dürfen.", "parce que les étudiants ont le droit de donner leur avis."),
    D(7.7, "Aber ich bin gegen Gewalt und Zerstörung.", "Mais je suis contre la violence et la destruction."),
    D(11.67, "Es ist nicht gut, Geschäfte kaputt zu machen,", "Ce n'est pas bien de casser des magasins,"),
    D(15.9, "weil die Besitzer nicht dafür können.", "parce que les propriétaires n'y sont pour rien."),
    D(18.6, "Man kann auch friedlich demonstrieren.", "On peut aussi manifester pacifiquement."),
    D(21.6, "Dankeschön.", "Merci."),
  ],
  3: [
    Q(0.2, "Tu as assisté, tu as participé"),
    Q(2.15, "à quelques manifestations."),
    Q(3.55, "On tient quand même à préciser"),
    Q(4.35, "que tu n'as pas été du côté"),
    Q(5.8, "des casseurs et des violents."),
    Q(7.75, "Mais qu'est-ce que tu penses de ça ?"),
    L(10.25, "Moi, je pense qu'en vrai,"),
    L(11.0, "il faut se faire entendre quand même."),
    L(12.5, "Parce que les manifestations, ça sert à ça :"),
    L(14.1, "à se faire entendre."),
    L(15.4, "Parce que je pense que"),
    L(17.0, "les personnes en haut, en France,"),
    L(20.2, "n'entendent pas assez nos revendications."),
    L(22.6, "C'est pour ça, il faut se faire entendre."),
  ],
  5: [
    Q(0.35, "Déjà, tu dis ne pas aimer la politique."),
    Q(2.35, "Pourquoi ?"),
    L(3.5, "Parce que ça ne m'intéresse pas."),
    L(6.1, "Je ne trouve pas intéressant de regarder ça."),
  ],
  7: [
    Q(0.6, "Alors, tu es français, issu de l'immigration."),
    Q(3.45, "Et quand tu vois qu'il y a"),
    Q(5.0, "un peu une montée des extrêmes,"),
    Q(7.7, "est-ce que tu trouves ça légitime ?"),
    Q(9.15, "Est-ce que tu comprends leur démarche,"),
    Q(11.0, "aux personnes qui veulent ramener la France"),
    Q(13.9, "à des heures sombres ?"),
    Q(16.4, "Est-ce que tu comprends ça ?"),
    L(17.45, "Pas du tout, je comprends pas."),
    L(18.75, "Parce que là, en vrai, la France, avant,"),
    L(21.0, "elle se portait bien."),
    L(21.85, "C'était tranquillement,"),
    L(22.7, "liberté, égalité, fraternité."),
    L(23.7, "Il y avait pas de problème de racisme,"),
    L(25.2, "il y avait pas de truc bizarre"),
    L(27.0, "avec la montée du fascisme, je sais pas quoi."),
    L(29.15, "Donc en vrai, je comprends pas."),
    L(31.1, "Simplement, l'État fait tout pour nous nuire,"),
    L(34.3, "j'ai l'impression."),
  ],
  8: [
    D(0.2, "Ich mache mir Sorgen über den Aufstieg der AfD in Deutschland.", "Je m'inquiète de la montée de l'AfD en Allemagne."),
    D(5.35, "Ich finde, dass jeder Mensch die gleichen Rechte haben sollte,", "Je trouve que chaque personne devrait avoir les mêmes droits,"),
    D(8.8, "egal woher er kommt.", "peu importe d'où elle vient."),
    D(11.33, "Ich verstehe, dass manche Menschen unzufrieden sind,", "Je comprends que certaines personnes soient mécontentes,"),
    D(14.66, "aber ich finde es wichtig,", "mais je trouve important"),
    D(16.65, "dass wir offen bleiben und niemanden ausgrenzen.", "que nous restions ouverts, sans exclure personne."),
    D(21.64, "Meiner Meinung nach sollten wir zusammenhalten", "À mon avis, nous devrions rester unis"),
    D(24.5, "und friedliche Lösungen finden.", "et trouver des solutions pacifiques."),
    D(28.39, "Danke an alle.", "Merci à tous."),
  ],
};

/** Mots-clés en autocollant : (segment, seconde, durée, texte) — des mots prononcés. */
const MOTS: [number, number, number, string][] = [
  [2, 8.0, 3.2, "Contre la violence"],
  [2, 19.2, 2.6, "Pacifiquement"],
  [3, 11.2, 3.0, "Se faire entendre"],
  [3, 20.6, 2.4, "Nos revendications"],
  [5, 3.8, 2.6, "Ça ne m'intéresse pas"],
  [7, 17.5, 1.9, "Pas du tout"],
  [7, 22.75, 1.05, "Liberté · égalité · fraternité"],
  [8, 6.3, 2.6, "Les mêmes droits"],
  [8, 17.2, 3.0, "Rester ouverts"],
  [8, 22.4, 3.2, "Rester unis"],
];

const CHAPITRES: Record<number, [string, string]> = {
  1: ["01", "Manifester"],
  4: ["02", "La politique"],
  6: ["03", "Les extrêmes"],
};

/* ─── Les plans ─────────────────────────────────────────────────────────── */

const ECHELLES = [1.02, 1.13, 1.06];
const ORIGINES = ["50% 45%", "52% 40%", "47% 48%"];

/** Zoom sauté toutes les deux phrases, poussée lente entre deux sauts. */
const Plan: React.FC<{ seg: Segment }> = ({ seg }) => {
  const f = useCurrentFrame();
  const lignes = SOUS_TITRES[seg.k] ?? [];
  let i = 0;
  lignes.forEach((l, j) => {
    if (f >= s(l.t)) i = Math.floor(j / 2);
  });
  const flou = seg.role === "intro" || seg.role === "fin";
  const echelle = (flou ? 1.1 : ECHELLES[i % 3]) + 0.025 * (f / seg.images);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(`genz/seg${seg.k}.mp4`)}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${echelle})`,
          transformOrigin: flou ? "50% 45%" : ORIGINES[i % 3],
          filter: flou ? "blur(14px) brightness(0.45) saturate(1.1)" : undefined,
        }}
      />
    </AbsoluteFill>
  );
};

/* ─── Habillage ─────────────────────────────────────────────────────────── */

const Degrades: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 15%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.78) 100%), radial-gradient(ellipse 80% 65% at 50% 45%, transparent 55%, rgba(0,0,0,0.5) 100%)",
    }}
  />
);

/** Le cadre jaune de la rubrique, tracé à l'ouverture. */
const Cadre: React.FC = () => {
  const f = useCurrentFrame();
  const p = prog(f, 6, 30, EXPO);
  return (
    <AbsoluteFill style={{ padding: 28, pointerEvents: "none" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 40, boxShadow: `inset 0 0 0 5px ${C.jaune}`, opacity: 0.9 * p, transform: `scale(${1.03 - 0.03 * p})` }} />
    </AbsoluteFill>
  );
};

/** En haut : l'autocollant de la rubrique et le logo. */
const EnTete: React.FC = () => {
  const f = useCurrentFrame();
  const o = prog(f, DEBUTS[1], DEBUTS[1] + 10) * (1 - prog(f, DEBUTS[FIN], DEBUTS[FIN] + 8));
  return (
    <div style={{ position: "absolute", left: 64, right: 64, top: 84, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: o }}>
      <div style={{ ...titre(46, C.noir), background: C.jaune, padding: "10px 20px 8px", borderRadius: 10, transform: "rotate(-2deg)", boxShadow: "0 8px 30px rgba(0,0,0,0.45)" }}>
        Génération Z
      </div>
      <Img src={staticFile("logo.png")} style={{ width: 86, height: 86, borderRadius: 999, boxShadow: "0 6px 24px rgba(0,0,0,0.5)" }} />
    </div>
  );
};

/** VO allemande : une pastille pendant les passages en allemand. */
const Langue: React.FC = () => {
  const f = useCurrentFrame();
  for (const seg of [2, 8]) {
    if (!dans(f, seg)) continue;
    const l = local(f, seg);
    const p = prog(l, 6, 18, EXPO) * (1 - prog(l, SEGMENTS[seg].images - 8, SEGMENTS[seg].images, SORTIE));
    return (
      <div style={{ position: "absolute", left: 64, top: 186, display: "flex", alignItems: "center", gap: 12, opacity: p, transform: `translateX(${(1 - p) * -30}px)` }}>
        <div style={{ ...texte(26, C.noir, 900), background: C.blanc, padding: "6px 12px", borderRadius: 8, letterSpacing: "0.08em" }}>DE</div>
        <div style={{ ...texte(28, C.blanc, 750), textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>VO allemande · sous-titrée en français</div>
      </div>
    );
  }
  return null;
};

/** Ouverture : GÉNÉRATION Z lettre à lettre, l'accroche de la rubrique, puis le titre du sujet. */
const Ouverture: React.FC = () => {
  const f = useCurrentFrame();
  if (!dans(f, 0)) return null;
  const n = SEGMENTS[0].images;
  const sortie = prog(f, n - 8, n, SORTIE);
  const lettres = "GÉNÉRATION Z".split("");
  const autocollant = prog(f, 36, 46, EXPO);
  const sujet = (k: number) => prog(f, 58 + k * 6, 58 + k * 6 + 16, PREMIUM);
  const surligne = prog(f, 70, 92, EXPO);
  return (
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 80, paddingRight: 80, opacity: 1 - sortie }}>
      <div style={{ display: "flex", flexWrap: "nowrap" }}>
        {lettres.map((c, i) => {
          const p = prog(f, 4 + i * 2, 4 + i * 2 + 8, EXPO);
          return (
            <span key={i} style={{ ...titre(150, C.jaune), display: "inline-block", whiteSpace: "pre", opacity: p, transform: `translateY(${(1 - p) * 60}px) scale(${1.4 - 0.4 * p})`, textShadow: "0 0 60px rgba(249,184,0,0.35)" }}>
              {c}
            </span>
          );
        })}
      </div>
      <div style={{ marginTop: 26, opacity: autocollant, transform: `rotate(-3deg) scale(${1.3 - 0.3 * autocollant})`, transformOrigin: "left center", alignSelf: "flex-start" }}>
        <span style={{ ...texte(38, C.noir, 900), background: C.blanc, padding: "10px 22px", borderRadius: 10 }}>Le rendez-vous des 15-17 ans</span>
      </div>
      <div style={{ marginTop: 90 }}>
        <div style={{ ...texte(30, C.jaune, 800), letterSpacing: "0.28em", opacity: sujet(0) }}>LE SUJET</div>
        <div style={{ position: "relative", display: "inline-block", marginTop: 14 }}>
          <div style={{ position: "absolute", left: -10, right: -10, bottom: 6, height: 40, background: C.jaune, transform: `scaleX(${surligne})`, transformOrigin: "left", borderRadius: 4 }} />
          <div style={{ ...titre(112, C.blanc), position: "relative", opacity: sujet(1), transform: `translateY(${(1 - sujet(1)) * 30}px)` }}>Se faire entendre</div>
        </div>
        <div style={{ ...texte(40, C.blanc, 650), marginTop: 22, opacity: sujet(2), lineHeight: 1.25 }}>
          Manifestations, politique, extrêmes :<br />deux jeunes, deux langues.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Intertitre : un aplat jaune monte, le numéro et le mot claquent, l'aplat repart vers le haut. */
const Chapitre: React.FC = () => {
  const f = useCurrentFrame();
  for (const [i, [num, mot]] of Object.entries(CHAPITRES)) {
    const seg = Number(i);
    if (!dans(f, seg)) continue;
    const l = local(f, seg);
    const n = SEGMENTS[seg].images;
    const entree = prog(l, 0, 7, EXPO);
    const sortie = prog(l, n - 7, n, SORTIE);
    const texteP = prog(l, 4, 12, EXPO);
    return (
      <AbsoluteFill style={{ background: C.jaune, transform: `translateY(${(1 - entree) * 100 - sortie * 100}%)`, justifyContent: "center", paddingLeft: 90 }}>
        <div style={{ ...titre(300, C.noir), opacity: texteP, transform: `translateX(${(1 - texteP) * -80}px)` }}>{num}</div>
        <div style={{ ...titre(150, C.noir), marginTop: 10, opacity: texteP, transform: `translateX(${(1 - texteP) * 80}px)` }}>{mot}</div>
        <div style={{ ...texte(34, C.noir, 800), marginTop: 30, letterSpacing: "0.2em", opacity: texteP }}>GÉNÉRATION Z · RADIO TRIPOINT</div>
      </AbsoluteFill>
    );
  }
  return null;
};

/** Mot-clé : autocollant jaune, légèrement de travers, qui tape puis s'efface. */
const Mot: React.FC<{ texte: string; duree: number; i: number }> = ({ texte: mot, duree, i }) => {
  const f = useCurrentFrame();
  const d = s(duree);
  if (f > d) return null;
  const p = prog(f, 0, 7, EXPO);
  const sortie = prog(f, d - 6, d, SORTIE);
  const angle = i % 2 ? 3 : -3;
  const long = mot.length > 18;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 268, display: "flex", justifyContent: "center", opacity: 1 - sortie }}>
      <div
        style={{
          ...titre(long ? 84 : 112, C.noir),
          background: C.jaune,
          padding: "16px 30px 10px",
          borderRadius: 14,
          textAlign: "center",
          lineHeight: 0.95,
          transform: `rotate(${angle}deg) scale(${1.5 - 0.5 * p})`,
          opacity: p,
          boxShadow: "0 16px 50px rgba(0,0,0,0.5)",
          maxWidth: 900,
        }}
      >
        {mot}
      </div>
    </div>
  );
};

/** Ce qu'est l'AfD, pour qui regarde côté français (le nom du parti, rien de plus). */
const NoteAfD: React.FC = () => {
  const f = useCurrentFrame();
  const seg = 8;
  if (!dans(f, seg)) return null;
  const l = local(f, seg);
  const a = s(1.4);
  const b = s(5.2);
  if (l < a || l > b) return null;
  const p = prog(l, a, a + 10, EXPO) * (1 - prog(l, b - 8, b, SORTIE));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 268, display: "flex", justifyContent: "center", opacity: p, transform: `translateY(${(1 - p) * -20}px)` }}>
      <div style={{ background: "rgba(0,0,0,0.78)", borderRadius: 18, padding: "18px 30px", boxShadow: `inset 0 0 0 3px ${C.jaune}`, textAlign: "center" }}>
        <div style={{ ...titre(80, C.jaune) }}>AfD</div>
        <div style={{ ...texte(32, C.blanc, 700), marginTop: 8 }}>Alternative für Deutschland</div>
        <div style={{ ...texte(26, "#cfcfc8", 650), marginTop: 4 }}>parti politique allemand</div>
      </div>
    </div>
  );
};

const SousTitres: React.FC = () => {
  const f = useCurrentFrame();
  let c: (Ligne & { de0: number }) | null = null;
  for (const [i, lignes] of Object.entries(SOUS_TITRES)) {
    const seg = Number(i);
    const d0 = DEBUTS[seg];
    for (let j = 0; j < lignes.length; j++) {
      const de = d0 + s(lignes[j].t);
      const a = j + 1 < lignes.length ? d0 + s(lignes[j + 1].t) : d0 + SEGMENTS[seg].images;
      if (f >= de && f < a) c = { ...lignes[j], de0: de };
    }
  }
  if (!c) return null;
  const p = prog(f, c.de0, c.de0 + 5, PREMIUM);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, bottom: 400, display: "flex", justifyContent: "center", opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>
      <div
        style={{
          maxWidth: 960,
          textAlign: "center",
          padding: "16px 28px 18px",
          borderRadius: 20,
          background: c.q ? "rgba(249,184,0,0.94)" : "rgba(0,0,0,0.72)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
        }}
      >
        {c.q && <div style={{ ...texte(24, C.noir, 900), letterSpacing: "0.22em", marginBottom: 6 }}>LA QUESTION DE RADIO TRIPOINT</div>}
        {c.de && <div style={{ ...texte(30, "#d6d6cf", 600), fontStyle: "italic", lineHeight: 1.2, marginBottom: 8 }}>{c.de}</div>}
        <div style={{ ...texte(c.q ? 48 : 54, c.q ? C.noir : C.blanc, 800), lineHeight: 1.18 }}>{c.fr}</div>
      </div>
    </div>
  );
};

/** La fin : leur dernière phrase en grand, puis la rubrique et la radio. */
const Fin: React.FC = () => {
  const f = useCurrentFrame();
  const d0 = DEBUTS[FIN];
  if (f < d0) return null;
  const g = f - d0;
  const citation = prog(g, 0, 12, EXPO) * (1 - prog(g, 78, 88, SORTIE));
  const ligne = (k: number) => prog(g, k * 5, k * 5 + 14, PREMIUM);
  const p = (k: number) => prog(g, 88 + k * 6, 88 + k * 6 + 16, PREMIUM);
  return (
    <AbsoluteFill>
      {g < 90 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: citation, paddingBottom: 100 }}>
          <div style={{ textAlign: "center", paddingLeft: 70, paddingRight: 70 }}>
            <div style={{ ...texte(30, C.jaune, 800), letterSpacing: "0.26em", opacity: ligne(0), marginBottom: 26 }}>TRADUIT DE L'ALLEMAND</div>
            {["« Rester unis", "et trouver", "des solutions", "pacifiques »"].map((l, k) => (
              <div key={l} style={{ overflow: "hidden", paddingTop: 18 }}>
                <div style={{ ...titre(k === 3 ? 150 : 120, k === 3 ? C.jaune : C.blanc), transform: `translateY(${(1 - ligne(k + 1)) * 120}%)` }}>{l}</div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      )}
      {g >= 82 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 140 }}>
          <div style={{ ...titre(150, C.jaune), opacity: p(0), transform: `scale(${1.2 - 0.2 * p(0)})` }}>Génération Z</div>
          <div style={{ ...texte(40, C.noir, 900), background: C.blanc, padding: "10px 22px", borderRadius: 10, marginTop: 24, transform: "rotate(-2deg)", opacity: p(1) }}>
            Et toi, tu en penses quoi ?
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 70, opacity: p(2) }}>
            <Img src={staticFile("logo.png")} style={{ width: 120, height: 120, borderRadius: 999, boxShadow: "0 0 60px rgba(249,184,0,0.35)" }} />
            <div>
              <div style={{ ...titre(70, C.blanc) }}>Radio Tripoint</div>
              <div style={{ ...texte(32, C.jaune, 800), marginTop: 6 }}>Le Média des trois frontières</div>
            </div>
          </div>
          <div style={{ ...texte(34, "#cfcfc8", 650), marginTop: 34, opacity: p(3) }}>radio-tripoint-officiel.fr</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const GenerationZ: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {SEGMENTS.map((seg, i) =>
        seg.role === "chapitre" ? null : (
          <Sequence key={seg.k} from={DEBUTS[i]} durationInFrames={seg.images}>
            <Plan seg={seg} />
          </Sequence>
        ),
      )}
      <Degrades />
      <Cadre />
      <Ouverture />
      <EnTete />
      <Langue />
      {MOTS.map(([seg, de, duree, mot], i) => (
        <Sequence key={`${seg}-${de}`} from={DEBUTS[seg] + s(de)} durationInFrames={s(duree) + 1} layout="none">
          <Mot texte={mot} duree={duree} i={i} />
        </Sequence>
      ))}
      <NoteAfD />
      <SousTitres />
      <Chapitre />
      <Fin />
      <Grain />
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(1 - prog(f, 0, 6), prog(f, DUREE_GENZ - 10, DUREE_GENZ)) }} />
    </AbsoluteFill>
  );
};

