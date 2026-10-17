/*
 * Capteur du micro pour l'appel vocal de heytripo.fr (AudioWorklet).
 * Renvoie le son brut du micro par paquets d'environ 40 ms au fil de l'appel :
 * la détection de parole et l'envoi se font dans la page.
 */
class CapteurTripo extends AudioWorkletProcessor {
  constructor() {
    super()
    this.taille = 2048
    this.tampon = new Float32Array(this.taille)
    this.n = 0
  }
  process(entrees) {
    const canal = entrees[0] && entrees[0][0]
    if (canal) {
      for (let i = 0; i < canal.length; i++) {
        this.tampon[this.n++] = canal[i]
        if (this.n === this.taille) {
          this.port.postMessage(this.tampon)
          this.tampon = new Float32Array(this.taille)
          this.n = 0
        }
      }
    }
    return true
  }
}
registerProcessor("capteur-tripo", CapteurTripo)
