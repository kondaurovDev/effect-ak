import { pipe } from "effect/Function";
import { FileSystem } from "@effect/platform/FileSystem";
import { Path } from "@effect/platform/Path";
import * as String from "effect/String";
import * as Effect from "effect/Effect";
import { NodeContext } from "@effect/platform-node";

export class UtilService
  extends Effect.Service<UtilService>()("UtilService", {
    effect:
      Effect.gen(function* () {

        const fsService = yield* FileSystem;
        const pathService = yield* Path;

        const readFileBytesFromProjectRoot = (
          path: string[]
        ) =>
          pipe(
            Effect.succeed(pathService.resolve(...path)),
            Effect.tap(_ => Effect.logInfo("reading file", _)),
            Effect.andThen(fsService.readFile),
            Effect.catchAll(() => Effect.succeed(new Uint8Array()))
          );

        const readFileFromProjectRoot = (
          path: string[]
        ) =>
          pipe(
            readFileBytesFromProjectRoot(path),
            Effect.andThen(_ =>
              Buffer.from(_).toString("utf-8")
            )
          );

        const readFileFromNodeModules = (
          path: string[]
        ) =>
          readFileFromProjectRoot(
            ["node_modules", ...path]
          )

        return {
          readFileFromProjectRoot,
          readFileFromNodeModules,
          readFileBytesFromProjectRoot
        } as const;

      }),

    dependencies: [
      NodeContext.layer
    ]
  }) { }
