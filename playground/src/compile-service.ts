import { compileTemplate, parse, compileScript, compileStyle } from "vue/compiler-sfc"
import { Cause, pipe, Effect, Config } from "effect"
import { FileSystem } from "@effect/platform"
import { NodeContext } from "@effect/platform-node"
import { transpile, ModuleKind, ScriptTarget } from "typescript"

export class CompileVueService
  extends Effect.Service<CompileVueService>()("CompileVueService", {
    effect:
      Effect.gen(function* () {

        const fs = yield* FileSystem.FileSystem;
        const componentsDir = yield* Config.nonEmptyString("vueComponentsDir");
        const componentsOutDir = yield* Config.nonEmptyString("vueComponentsOutDir");

        const compileVueFile = (
          componentName: string
        ) =>
          Effect.gen(function* () {

            const jsResult = [] as string[];

            const resultObjectName = "_SFC";

            const uniqueId = "id-" + componentName;
            const content = yield* fs.readFileString(`${componentsDir}/${componentName}.vue`);

            const sfc_parts = parse(content);

            if (sfc_parts.errors.length > 0) {
              yield* new Cause.UnknownException(sfc_parts.errors, "parsing file")
            }

            const script =
              compileScript(sfc_parts.descriptor!, {
                id: componentName
              })

            const jsScript = transpile(script.content, {
              module: ModuleKind.ESNext,
              target: ScriptTarget.ESNext
            })

            jsResult.push(jsScript.replace("export default", `const ${resultObjectName} =`));

            jsResult.push("// next, template");

            const template =
              compileTemplate({
                id: componentName,
                source: sfc_parts.descriptor.template?.content!,
                filename: componentName + ".vue",
                compilerOptions: {
                  ...(script.bindings ? {
                    bindingMetadata: script.bindings!
                  } : undefined)
                }
              })

            if (template.errors.length > 0) {
              yield* new Cause.UnknownException(sfc_parts.errors, "compiling template")
            }

            jsResult.push(template.code);

            jsResult.push(`${resultObjectName}.render = render`);
            jsResult.push(`${resultObjectName}.__scopeId = "${uniqueId}"`);
            jsResult.push(`export default ${resultObjectName}`);

            const style =
              sfc_parts.descriptor?.styles.find(_ => _.scoped === true);

            if (style) {
              const compiledStyles =
                compileStyle({
                  filename: componentName + ".css",
                  id: uniqueId,
                  source: style.content,
                  scoped: true
                })

              if (compiledStyles.errors.length > 0) {
                yield* new Cause.UnknownException(sfc_parts.errors, "compiling scoped style")
              }

              yield* fs.writeFileString(`${componentsOutDir}/${componentName}.css`, compiledStyles.code);

            }

            yield* fs.writeFileString(`${componentsOutDir}/${componentName}.js`, jsResult.join("\n"));

          });

        const compileAll =
          pipe(
            Effect.all([
              compileVueFile("transcribe"),
              compileVueFile("main")
            ]),
            Effect.andThen(() => "Compiled"),
            Effect.provide(NodeContext.layer)
          )

        return {
          compileVueFile, compileAll
        } as const;

      }),

    dependencies: [
      NodeContext.layer
    ]

  }) { }
