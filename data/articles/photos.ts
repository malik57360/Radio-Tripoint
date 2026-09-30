import type { Visuel } from "@/types/media"

/**
 * Photos des articles repris de l'ancien site, par slug : la première sert
 * de visuel, les suivantes s'ajoutent en fin d'article.
 *
 * FICHIER GÉNÉRÉ par `node scripts/importer-photos-webador.mjs`, qui
 * télécharge les photos listées dans `scripts/photos-webador.json` vers
 * `public/media/articles/`. Vide tant qu'il n'a pas tourné.
 */
export const photos: Record<string, Visuel[]> = {}
