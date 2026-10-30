// node stills-multi.mjs <dossier> Compo:frame Compo:frame … — un seul bundle.
import { bundle } from "@remotion/bundler"
import { renderStill, selectComposition } from "@remotion/renderer"
import path from "node:path"
const [dossier, ...cibles] = process.argv.slice(2)
const B = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell"
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") })
for (const c of cibles) {
  const [id, f] = c.split(":")
  const composition = await selectComposition({ serveUrl, id, browserExecutable: B })
  await renderStill({ composition, serveUrl, frame: Number(f), output: `${dossier}/${id}-${f.padStart(4, "0")}.png`, browserExecutable: B, imageFormat: "png" })
}
console.log("ok", cibles.length)
