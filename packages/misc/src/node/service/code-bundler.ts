import * as Effect from "effect/Effect";
import * as Data from "effect/Data";
import * as Path from "@effect/platform/Path";

import { miscPackageName } from "../../const.js";
import { BuildSourceCodeInput } from "../types.js";

export class NodeCodeBundlerError
  extends Data.TaggedError("NodeCodeBundlerError")<{
    cause: unknown
  }> { }

export class NodeCodeBundlerService
  extends Effect.Service<NodeCodeBundlerService>()(`${miscPackageName}/NodeCodeBundlerService`, {
    effect:
      Effect.gen(function* () {

        const path = yield* Path.Path;

        const esbuild =
          yield* Effect.tryPromise(() => import("esbuild"));

        const createBundle =
          (input: typeof BuildSourceCodeInput.Type) =>
            Effect.gen(function* () {

              const buildConfig = {
                entryPoints: [
                  input.inputFilePath.join(path.sep)
                ],
                write: false,
                format: "esm",
                platform: "node",
                bundle: true,
                external: input.external,
                minify: input.minify
              } as import("esbuild").BuildOptions;

              yield* Effect.logDebug("esbuild config", buildConfig);

              const output =
                yield* Effect.tryPromise({
                  try: () => esbuild.build(buildConfig),
                  catch: error => new NodeCodeBundlerError({ cause: error as Error })
                });

              if (output.errors.length != 0) {
                return yield* new NodeCodeBundlerError({ cause: output.errors })
              }

              const code = output.outputFiles?.at(0)?.text;

              if (code == null) {
                return yield* new NodeCodeBundlerError({ cause: "generated code is undefined" })
              }

              return code;

            })

        return {
          createBundle
        } as const;

      }),
    dependencies: [
      Path.layer
    ]

  }) { }
