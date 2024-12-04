import { Effect, Either, pipe } from "effect";
import * as TsMorph from "ts-morph"

import * as Path from "path";

export class WriteCodeService
  extends Effect.Service<WriteCodeService>()("WriteCodeService", {
    scoped:
      Effect.gen(function* () {

        const outDir = [__dirname, "..", "..", "code"];

        const project = new TsMorph.Project();

        yield* Effect.addFinalizer(() =>
          pipe(
            Effect.tryPromise(() => project.save()),
            Effect.merge,
            Effect.andThen(result =>
              Effect.logInfo("Morph project closed", result)
            )
          )
        );

        const createTsFile =
          (input: {
            fileName: string,
          }) =>
            Either.try(() => {
              const src =
                project.createSourceFile(Path.join(...outDir, input.fileName + ".ts"), "", { overwrite: true });

              return src;
            })

        return {
          createTsFile
        } as const;

      })
  }) { }
