import { compileTemplate, parse, compileScript, compileStyle } from "vue/compiler-sfc"
import { Cause, pipe, Effect } from "effect"
import { FileSystem, Path } from "@effect/platform"
import { NodeContext } from "@effect/platform-node"
import { transpile } from "typescript"
import { ModuleKind } from "typescript"
import { ScriptTarget } from "typescript"

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
        id: fileName
      })

    const jsScript = transpile(script.content, {
      module: ModuleKind.ESNext,
      target: ScriptTarget.ESNext
    })

    result.push(jsScript.replace("export default", `const ${resultObjectName} =`));

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

    const uniqueId = "id-" + fileName;

    result.push(`${resultObjectName}.render = render`);
    result.push(`${resultObjectName}.__scopeId = "${uniqueId}"`);
    result.push(`export default ${resultObjectName}`);

    const style =
      sfc_parts.descriptor?.styles.find(_ => _.scoped === true);

    if (style) {
      const compiledStyles =
        compileStyle({
          filename: fileName + ".css",
          id: uniqueId,
          source: style.content,
          scoped: true
        })

      if (compiledStyles.errors.length > 0) {
        yield* new Cause.UnknownException(sfc_parts.errors, "compiling scoped style")
      }

      yield* fs.writeFileString(path.join(__dirname, "..", ".out", fileName + ".css"), compiledStyles.code);

    }

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
