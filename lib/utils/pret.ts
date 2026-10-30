/**
 * Lancement en douceur : la classe « lancement » est posée sur <html> dès
 * le début, et retirée un peu après le chargement de la page (au plus tard
 * au bout de 4 s). Pendant ce temps, seules jouent les animations d'entrée ;
 * les animations d'ambiance (app/globals.css), le spectre et le démarrage du
 * direct attendent, pour que le téléphone ne fasse qu'une chose à la fois.
 * Une mise en page sans ce script (Zaza, HeyTripo…) n'a jamais la classe :
 * rien n'y attend.
 */
export const scriptPret = `(function(){var d=document.documentElement,f=0;d.classList.add("lancement");function p(){if(f)return;f=1;d.classList.remove("lancement");d.dispatchEvent(new Event("pret"))}function l(){setTimeout(p,600)}if(document.readyState==="complete")l();else addEventListener("load",l,{once:true});setTimeout(p,4000)})()`

/** Appelle `faire` quand la page est prête ; renvoie de quoi annuler. */
export function quandPret(faire: () => void): () => void {
  const d = document.documentElement
  if (!d.classList.contains("lancement")) {
    const id = setTimeout(faire, 0)
    return () => clearTimeout(id)
  }
  d.addEventListener("pret", faire, { once: true })
  return () => d.removeEventListener("pret", faire)
}
