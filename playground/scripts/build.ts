import { compileTemplate, parse } from "vue/compiler-sfc"
import { readFile, writeFile } from "fs/promises"

const content = (await readFile(__dirname + "/../pages/transcribe.vue")).toString("utf-8");

const parts = parse(content);

const template = 
  compileTemplate({
    id: "zxc",
    source: parts.descriptor.template?.content!,
    filename: "transcribe.vue",
  })

  

await writeFile(__dirname + "/../.out/template.js", template.code);

console.log("done", { template })
