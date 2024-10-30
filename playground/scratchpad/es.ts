import { buildSync } from "esbuild"

buildSync({
  bundle: true,
  minify: true,
  entryPoints: {
    transcribe: __dirname + "/../.out/transcribe.js"
  },
  format: "esm",
  external: ["vue"],
  outdir: __dirname + "/../.out"
})