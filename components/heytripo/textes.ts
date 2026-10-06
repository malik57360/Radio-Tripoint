import type { Langue } from "@/lib/i18n/langues"

export const LANGUES: { code: Langue; court: string; nom: string; voix: string[] }[] = [
  { code: "fr", court: "FR", nom: "Français", voix: ["fr-FR", "fr"] },
  { code: "de", court: "DE", nom: "Deutsch", voix: ["de-DE", "de"] },
  // Peu d'appareils ont une voix luxembourgeoise : l'allemand prend le relais.
  { code: "lb", court: "LB", nom: "Lëtzebuergesch", voix: ["lb-LU", "lb", "de-LU", "de-DE", "de"] },
  { code: "en", court: "EN", nom: "English", voix: ["en-GB", "en-US", "en"] },
  { code: "es", court: "ES", nom: "Español", voix: ["es-ES", "es"] },
]

/** Langue de la reconnaissance vocale (le luxembourgeois n'existe pas partout). */
export const ECOUTE: Record<Langue, string> = {
  fr: "fr-FR",
  de: "de-DE",
  lb: "lb-LU",
  en: "en-GB",
  es: "es-ES",
}

type Textes = {
  salut: [string, string]
  intro: string
  suggestions: string[]
  placeholder: string
  ecoute: string
  parle: string
  reflechit: string
  cherche: string
  photo: string
  photoDefaut: string
  retirer: string
  envoyer: string
  micro: string
  arreter: string
  son: string
  muet: string
  nouvelle: string
  radio: string
  erreur: string
  debit: string
  photoTrop: string
  micIndispo: string
  pied: string
  sources: string
}

export const TEXTES: Record<Langue, Textes> = {
  fr: {
    salut: ["Hey, moi c'est", "Tripo !"],
    intro:
      "Le guide des Trois Frontières, par Radio Tripoint. Parle-moi, écris-moi ou envoie-moi une photo.",
    suggestions: [
      "Qu'est-ce qu'on fait ce week-end ?",
      "Quelle météo demain à Sierck ?",
      "C'est quoi l'espace Schengen ?",
      "Quelles émissions sur Radio Tripoint ?",
    ],
    placeholder: "Écris à Tripo…",
    ecoute: "Je t'écoute…",
    parle: "Tripo parle",
    reflechit: "Tripo réfléchit",
    cherche: "Tripo cherche",
    photo: "Envoyer une photo",
    photoDefaut: "Qu'est-ce que tu vois sur cette photo ?",
    retirer: "Retirer la photo",
    envoyer: "Envoyer",
    micro: "Parler à Tripo",
    arreter: "Arrêter",
    son: "Voix de Tripo activée",
    muet: "Voix de Tripo coupée",
    nouvelle: "Nouvelle conversation",
    radio: "Écouter Radio Tripoint",
    erreur: "Tripo n'arrive pas à répondre pour l'instant. Réessaie dans un moment.",
    debit: "Doucement ! Trop de messages d'un coup. Réessaie dans quelques minutes.",
    photoTrop: "Cette photo n'a pas pu être lue. Essaie une autre image (JPG ou PNG).",
    micIndispo: "Le micro n'est pas disponible sur ce navigateur. Essaie Chrome ou Safari.",
    pied: "Tripo est une IA : il peut se tromper. Vérifie les infos importantes. Les photos ne sont pas conservées.",
    sources: "Sources",
  },
  de: {
    salut: ["Hey, ich bin", "Tripo!"],
    intro:
      "Der Guide fürs Dreiländereck, von Radio Tripoint. Sprich mit mir, schreib mir oder schick mir ein Foto.",
    suggestions: [
      "Was ist am Wochenende los?",
      "Wie wird das Wetter morgen in Sierck?",
      "Was ist der Schengen-Raum?",
      "Welche Sendungen gibt es bei Radio Tripoint?",
    ],
    placeholder: "Schreib Tripo…",
    ecoute: "Ich höre zu…",
    parle: "Tripo spricht",
    reflechit: "Tripo denkt nach",
    cherche: "Tripo sucht",
    photo: "Foto senden",
    photoDefaut: "Was siehst du auf diesem Foto?",
    retirer: "Foto entfernen",
    envoyer: "Senden",
    micro: "Mit Tripo sprechen",
    arreter: "Stopp",
    son: "Tripos Stimme an",
    muet: "Tripos Stimme aus",
    nouvelle: "Neues Gespräch",
    radio: "Radio Tripoint hören",
    erreur: "Tripo kann gerade nicht antworten. Versuch es gleich noch einmal.",
    debit: "Langsam! Zu viele Nachrichten auf einmal. Versuch es in ein paar Minuten wieder.",
    photoTrop: "Dieses Foto konnte nicht gelesen werden. Versuch ein anderes Bild (JPG oder PNG).",
    micIndispo: "Das Mikrofon ist in diesem Browser nicht verfügbar. Versuch Chrome oder Safari.",
    pied: "Tripo ist eine KI und kann sich irren. Prüfe wichtige Infos. Fotos werden nicht gespeichert.",
    sources: "Quellen",
  },
  lb: {
    salut: ["Hey, ech sinn", "den Tripo!"],
    intro:
      "De Guide vum Dräilännereck, vu Radio Tripoint. Schwätz mat mir, schreif mir oder schéck mir eng Foto.",
    suggestions: [
      "Wat ass um Weekend lass?",
      "Wéi gëtt d'Wieder muer zu Sierck?",
      "Wat ass de Schengen-Raum?",
      "Wéi eng Emissiounen huet Radio Tripoint?",
    ],
    placeholder: "Schreif dem Tripo…",
    ecoute: "Ech lauschteren…",
    parle: "Den Tripo schwätzt",
    reflechit: "Den Tripo iwwerleet",
    cherche: "Den Tripo sicht",
    photo: "Foto schécken",
    photoDefaut: "Wat gesäis du op dëser Foto?",
    retirer: "Foto ewechhuelen",
    envoyer: "Schécken",
    micro: "Mam Tripo schwätzen",
    arreter: "Stopp",
    son: "Dem Tripo seng Stëmm un",
    muet: "Dem Tripo seng Stëmm aus",
    nouvelle: "Neit Gespréich",
    radio: "Radio Tripoint lauschteren",
    erreur: "Den Tripo kann de Moment net äntweren. Prob et gläich nach eng Kéier.",
    debit: "Lues! Ze vill Messagen op eemol. Prob et an e puer Minutten nach eng Kéier.",
    photoTrop: "Dës Foto konnt net gelies ginn. Prob en anert Bild (JPG oder PNG).",
    micIndispo: "De Mikro ass an dësem Browser net disponibel. Prob Chrome oder Safari.",
    pied: "Den Tripo ass eng KI a kann sech iren. Iwwerpréif wichteg Infoen. Fotoe ginn net gespäichert.",
    sources: "Quellen",
  },
  en: {
    salut: ["Hey, I'm", "Tripo!"],
    intro:
      "Your guide to the Three Borders, by Radio Tripoint. Talk to me, write to me or send me a photo.",
    suggestions: [
      "What's on this weekend?",
      "What's the weather in Sierck tomorrow?",
      "What is the Schengen Area?",
      "What shows are on Radio Tripoint?",
    ],
    placeholder: "Message Tripo…",
    ecoute: "I'm listening…",
    parle: "Tripo is talking",
    reflechit: "Tripo is thinking",
    cherche: "Tripo is searching",
    photo: "Send a photo",
    photoDefaut: "What can you see in this photo?",
    retirer: "Remove photo",
    envoyer: "Send",
    micro: "Talk to Tripo",
    arreter: "Stop",
    son: "Tripo's voice on",
    muet: "Tripo's voice off",
    nouvelle: "New conversation",
    radio: "Listen to Radio Tripoint",
    erreur: "Tripo can't answer right now. Try again in a moment.",
    debit: "Easy! Too many messages at once. Try again in a few minutes.",
    photoTrop: "This photo couldn't be read. Try another image (JPG or PNG).",
    micIndispo: "The microphone isn't available in this browser. Try Chrome or Safari.",
    pied: "Tripo is an AI and can make mistakes. Check important information. Photos are not stored.",
    sources: "Sources",
  },
  es: {
    salut: ["¡Hola, soy", "Tripo!"],
    intro:
      "Tu guía de las Tres Fronteras, por Radio Tripoint. Háblame, escríbeme o mándame una foto.",
    suggestions: [
      "¿Qué hay este fin de semana?",
      "¿Qué tiempo hará mañana en Sierck?",
      "¿Qué es el espacio Schengen?",
      "¿Qué programas tiene Radio Tripoint?",
    ],
    placeholder: "Escribe a Tripo…",
    ecoute: "Te escucho…",
    parle: "Tripo habla",
    reflechit: "Tripo piensa",
    cherche: "Tripo busca",
    photo: "Enviar una foto",
    photoDefaut: "¿Qué ves en esta foto?",
    retirer: "Quitar la foto",
    envoyer: "Enviar",
    micro: "Hablar con Tripo",
    arreter: "Parar",
    son: "Voz de Tripo activada",
    muet: "Voz de Tripo desactivada",
    nouvelle: "Nueva conversación",
    radio: "Escuchar Radio Tripoint",
    erreur: "Tripo no puede responder ahora mismo. Vuelve a intentarlo en un momento.",
    debit: "¡Despacio! Demasiados mensajes a la vez. Vuelve a intentarlo en unos minutos.",
    photoTrop: "No se ha podido leer esta foto. Prueba con otra imagen (JPG o PNG).",
    micIndispo: "El micrófono no está disponible en este navegador. Prueba Chrome o Safari.",
    pied: "Tripo es una IA y puede equivocarse. Comprueba la información importante. Las fotos no se guardan.",
    sources: "Fuentes",
  },
}
