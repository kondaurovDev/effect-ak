import { Config, Effect, Either, pipe } from "effect";
import * as TsMorph from "ts-morph"

import * as Path from "path";
import { writeTypes } from "./types";
import { writeMethods } from "./methods";

export class CodeWriterService
  extends Effect.Service<CodeWriterService>()("CodeWriterService", {
    scoped:
      Effect.gen(function* () {

        const writeToDir =
          yield* Config.array(Config.nonEmptyString(), "client-out-dir");

        const project = new TsMorph.Project();

        const saveFiles =
          pipe(
            Effect.tryPromise(() => project.save()),
            Effect.andThen(result =>
              Effect.logInfo("Morph project closed", result)
            )
          );

        const createTsFile =
          (name: string, ...dir: string[]) =>
            Either.try(() => {
              const to = Path.join(...writeToDir, ...dir, name + ".ts");
              console.log("Creating source file", to)
              return project.createSourceFile(to, "", { overwrite: true });
            });

        const typeSrcFile = yield* createTsFile("types");

        const apiSrcFile = yield* createTsFile("api");

        return {
          saveFiles,
          createTsFile,
          writeTypes: writeTypes(typeSrcFile),
          writeMethods: writeMethods(apiSrcFile)
        } as const;

      })
  }) { }
