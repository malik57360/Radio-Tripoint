"use client"

import { useState } from "react"
import { ChampChoix, ChampTexte } from "@/components/forms/Champs"
import { useT } from "@/components/i18n/Langue"
import {
  libellesPaysAgenda,
  libellesTypesOrganisation,
  paysAgenda,
  typesOrganisation,
} from "@/lib/formulaires/schemas"
import type { Trad } from "@/lib/i18n/langues"

/** Le numéro demandé dépend du pays et du type de structure : libellé et aide suivent le choix. */
const AIDES: Record<string, { libelle: Trad; aide: Trad; exemple: string }> = {
  "FR-entreprise": {
    libelle: {
      fr: "SIRET",
      de: "SIRET-Nummer",
      lb: "SIRET-Nummer",
      en: "SIRET number",
      es: "Número SIRET",
    },
    aide: {
      fr: "14 chiffres (ou SIREN, 9 chiffres). Contrôlé dans l'annuaire officiel de l'État.",
      de: "14 Ziffern (oder SIREN, 9 Ziffern). Wird im amtlichen Verzeichnis des französischen Staates geprüft.",
      lb: "14 Zifferen (oder SIREN, 9 Zifferen). Gëtt am offiziellen Verzeechnes vum franséische Staat kontrolléiert.",
      en: "14 digits (or SIREN, 9 digits). Checked against the French State's official register.",
      es: "14 cifras (o SIREN, 9 cifras). Se comprueba en el registro oficial del Estado francés.",
    },
    exemple: "123 456 789 00012",
  },
  "FR-association": {
    libelle: {
      fr: "Numéro RNA ou SIRET",
      de: "RNA- oder SIRET-Nummer",
      lb: "RNA- oder SIRET-Nummer",
      en: "RNA or SIRET number",
      es: "Número RNA o SIRET",
    },
    aide: {
      fr: "RNA : W suivi de 9 chiffres (sur le récépissé de la préfecture). Ou le SIRET de l'association.",
      de: "RNA: W gefolgt von 9 Ziffern (auf der Bestätigung der Präfektur). Oder die SIRET-Nummer des Vereins.",
      lb: "RNA: W mat 9 Zifferen (op der Bestätegung vun der Préfecture). Oder d'SIRET-Nummer vun der Associatioun.",
      en: "RNA: W followed by 9 digits (on the prefecture's receipt). Or the association's SIRET.",
      es: "RNA: W seguido de 9 cifras (en el resguardo de la prefectura). O el SIRET de la asociación.",
    },
    exemple: "W572001234",
  },
  "LU-entreprise": {
    libelle: {
      fr: "Numéro RCS Luxembourg",
      de: "Nummer im RCS Luxemburg",
      lb: "Nummer am RCS Lëtzebuerg",
      en: "Luxembourg RCS number",
      es: "Número RCS de Luxemburgo",
    },
    aide: {
      fr: "Numéro au Registre de commerce et des sociétés. Vérifié à la main par la radio.",
      de: "Nummer im Handels- und Gesellschaftsregister. Wird vom Sender von Hand geprüft.",
      lb: "Nummer am Handels- a Gesellschaftsregister. Gëtt vum Radio vun Hand kontrolléiert.",
      en: "Trade and Companies Register number. Checked by hand by the station.",
      es: "Número del Registro Mercantil y de Sociedades. Lo comprueba la radio a mano.",
    },
    exemple: "B123456",
  },
  "LU-association": {
    libelle: {
      fr: "Numéro RCS de l'asbl",
      de: "RCS-Nummer der asbl",
      lb: "RCS-Nummer vun der asbl",
      en: "RCS number of the asbl",
      es: "Número RCS de la asbl",
    },
    aide: {
      fr: "Les asbl sont inscrites au RCS (numéro commençant par F). Vérifié à la main par la radio.",
      de: "Die asbl sind im RCS eingetragen (Nummer beginnt mit F). Wird vom Sender von Hand geprüft.",
      lb: "D'asbl sinn am RCS ageschriwwen (Nummer fänkt mat F un). Gëtt vum Radio vun Hand kontrolléiert.",
      en: "Non-profits (asbl) are listed in the RCS (number starting with F). Checked by hand by the station.",
      es: "Las asbl están inscritas en el RCS (número que empieza por F). Lo comprueba la radio a mano.",
    },
    exemple: "F1234",
  },
  "DE-entreprise": {
    libelle: {
      fr: "Numéro au Handelsregister",
      de: "Handelsregisternummer",
      lb: "Handelsregisternummer",
      en: "Handelsregister number",
      es: "Número del Handelsregister",
    },
    aide: {
      fr: "Tribunal et numéro (ex. Amtsgericht Saarbrücken HRB 12345). Vérifié à la main par la radio.",
      de: "Gericht und Nummer (z. B. Amtsgericht Saarbrücken HRB 12345). Wird vom Sender von Hand geprüft.",
      lb: "Geriicht an Nummer (z. B. Amtsgericht Saarbrücken HRB 12345). Gëtt vum Radio vun Hand kontrolléiert.",
      en: "Court and number (e.g. Amtsgericht Saarbrücken HRB 12345). Checked by hand by the station.",
      es: "Tribunal y número (p. ej. Amtsgericht Saarbrücken HRB 12345). Lo comprueba la radio a mano.",
    },
    exemple: "HRB 12345",
  },
  "DE-association": {
    libelle: {
      fr: "Numéro au Vereinsregister",
      de: "Vereinsregisternummer",
      lb: "Vereinsregisternummer",
      en: "Vereinsregister number",
      es: "Número del Vereinsregister",
    },
    aide: {
      fr: "Tribunal et numéro (ex. Amtsgericht Saarbrücken VR 1234). Vérifié à la main par la radio.",
      de: "Gericht und Nummer (z. B. Amtsgericht Saarbrücken VR 1234). Wird vom Sender von Hand geprüft.",
      lb: "Geriicht an Nummer (z. B. Amtsgericht Saarbrücken VR 1234). Gëtt vum Radio vun Hand kontrolléiert.",
      en: "Court and number (e.g. Amtsgericht Saarbrücken VR 1234). Checked by hand by the station.",
      es: "Tribunal y número (p. ej. Amtsgericht Saarbrücken VR 1234). Lo comprueba la radio a mano.",
    },
    exemple: "VR 1234",
  },
}

/** Type de structure, pays d'immatriculation et numéro officiel. */
export function ChampsOrganisation() {
  const t = useT()
  const [type, setType] = useState("entreprise")
  const [pays, setPays] = useState("FR")
  const [particulier, setParticulier] = useState(false)
  const a = AIDES[`${pays}-${type}`] ?? AIDES["FR-entreprise"]
  const caseParticulier = (
    <label className="flex cursor-pointer items-start gap-3 sm:col-span-2">
      <input
        type="checkbox"
        name="particulier"
        value="oui"
        checked={particulier}
        onChange={(e) => {
          setParticulier(e.target.checked)
          setType("entreprise")
          setPays("FR")
        }}
        className="mt-0.5 size-5 flex-none cursor-pointer accent-[var(--accent)]"
      />
      <span className="text-encre-2 text-sm leading-relaxed">
        <strong className="text-encre">
          {t({
            fr: "Je suis un particulier",
            de: "Ich bin eine Privatperson",
            lb: "Ech sinn eng Privatpersoun",
            en: "I am a private individual",
            es: "Soy un particular",
          })}
        </strong>
        <br />
        {t({
          fr: "Pas d'entreprise ni d'association : pas de numéro à donner, l'équipe vérifie votre demande.",
          de: "Kein Unternehmen und kein Verein: keine Nummer nötig, das Team prüft Ihre Anfrage.",
          lb: "Kee Betrib a keng Associatioun: keng Nummer néideg, d'Team kontrolléiert Är Ufro.",
          en: "No company or association: no number needed, the team reviews your request.",
          es: "Sin empresa ni asociación: no hace falta ningún número, el equipo revisa su solicitud.",
        })}
      </span>
    </label>
  )
  if (particulier) return <div className="grid gap-5 sm:grid-cols-2">{caseParticulier}</div>
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {caseParticulier}
      <ChampChoix
        name="type_org"
        libelle={t({
          fr: "Vous êtes",
          de: "Sie sind",
          lb: "Dir sidd",
          en: "You are",
          es: "Usted es",
        })}
        options={typesOrganisation}
        libelles={libellesTypesOrganisation}
        onChange={(e) => setType(e.target.value)}
      />
      <ChampChoix
        name="pays_org"
        libelle={t({
          fr: "Immatriculée en",
          de: "Eingetragen in",
          lb: "Ageschriwwen an",
          en: "Registered in",
          es: "Registrada en",
        })}
        options={paysAgenda}
        libelles={libellesPaysAgenda}
        onChange={(e) => setPays(e.target.value)}
      />
      <ChampTexte
        name="organisation"
        libelle={t({
          fr: "Nom de la structure",
          de: "Name der Organisation",
          lb: "Numm vun der Organisatioun",
          en: "Organisation name",
          es: "Nombre de la organización",
        })}
        autoComplete="organization"
      />
      <ChampTexte
        name="identifiant"
        libelle={t(a.libelle)}
        aide={t(a.aide)}
        placeholder={a.exemple}
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  )
}
