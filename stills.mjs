// node stills.mjs <compo> <dossier> f1 f2 ... — un seul bundle, plusieurs images fixes.
import { bundle } from "@remotion/bundler"
import { renderStill, selectComposition } from "@remotion/renderer"
import path from "node:path"
const [compo, dossier, ...frames] = process.argv.slice(2)
const B = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell"
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") })
const composition = await selectComposition({ serveUrl, id: compo, browserExecutable: B })
for (const f of frames) {
  await renderStill({ composition, serveUrl, frame: Number(f), output: `${dossier}/${compo}-${String(f).padStart(4, "0")}.png`, browserExecutable: B, imageFormat: "png" })
}
console.log("ok", frames.length)
