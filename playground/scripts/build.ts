import { compileTemplate, parse, compileScript } from "vue/compiler-sfc"
import { Cause, pipe, Effect } from "effect"
import { FileSystem, Path } from "@effect/platform"
import { NodeContext } from "@effect/platform-node"

const compileVueFile = (
  fileName: string
) =>
  Effect.gen(function* () {

    const result = [] as string[];

    const resultObjectName = "_SFC";

    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;

    const content = yield* fs.readFileString(path.join(__dirname, "..", "pages", fileName + ".vue"));

    const sfc_parts = parse(content);

    if (sfc_parts.errors.length > 0) {
      yield* new Cause.UnknownException(sfc_parts.errors, "parsing file")
    }

    const script =
      compileScript(sfc_parts.descriptor!, {
        id: fileName,
      })

    result.push(script.content.replace("export default", `const ${resultObjectName} =`));

    result.push("// next, template");

    const template =
      compileTemplate({
        id: fileName,
        source: sfc_parts.descriptor.template?.content!,
        filename: fileName + ".vue",
        compilerOptions: {
          bindingMetadata: script.bindings
        }
      })

    if (template.errors.length > 0) {
      yield* new Cause.UnknownException(sfc_parts.errors, "compiling template")
    }

    result.push(template.code);

    result.push(`${resultObjectName}.render = render`);
    result.push(`export default ${resultObjectName}`);
    
    yield* fs.writeFileString(path.join(__dirname, "..", ".out", fileName + ".js"), result.join("\n"));

  })

await pipe(
  Effect.all([
    compileVueFile("transcribe"),
    compileVueFile("main")
  ]),
  Effect.provide(NodeContext.layer),
  Effect.runPromise
)
