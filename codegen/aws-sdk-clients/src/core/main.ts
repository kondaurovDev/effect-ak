import { Effect, Logger, pipe, Schema as S, Array, Option } from "effect";
import { readFile } from "node:fs/promises";

import { GenerateConfig, GenerateConfigTag } from "./config.js";
import { generateCommandsSection } from "./code-sections/commands.js"
import { generateExceptionsSection } from "./code-sections/exceptions.js";
import { generateClientSection } from "./code-sections/service.js";
import { makeMorphProject } from "./make-project.js";

export type Input = {
  config: GenerateConfig,
  clientName: string,
} & ReturnType<typeof makeMorphProject>;

const generateOneClient =
  (input: Pick<Input, "clientName" | "config">) =>
    Effect.gen(function* () {
      yield* Effect.logInfo(`Generating client (${input.clientName}) =>`);
      const project = yield* Effect.try(() => makeMorphProject(input));
      yield* generateClientSection({ ...input, ...project });
      yield* generateCommandsSection({ ...input, ...project });
      yield* generateExceptionsSection({ ...input, ...project });
    });

export const generateAllEffect =
  Effect.gen(function* () {

    const config = yield* GenerateConfigTag;

    if (!config.clients || config.clients?.length == 0) {
      return yield* Effect.logWarning("No clients to generate");
    }

    yield* Effect.forEach(config.clients, clientName => {
      return generateOneClient({ clientName, config });
    })
  });

const readFileContent = 
  (fileName: string) =>
    pipe(
      Effect.tryPromise(() => readFile(fileName)),
      Effect.andThen(_ => _.toString("utf-8"))
    );

const PackageJson = 
  S.Struct({
    dependencies: S.Record({ key: S.NonEmptyString, value: S.Unknown }),
    devDependencies: S.Record({ key: S.NonEmptyString, value: S.Unknown }),
  }).pipe(
    S.partial
  )

export const generateAll =
  () =>
    pipe(
      generateAllEffect,
      Effect.provide(Logger.pretty),
      Effect.provideServiceEffect(
        GenerateConfigTag, 
        Effect.gen(function*() {
          const definedConfig = 
            yield* readFileContent("codegen-aws-sdk-clients.json").pipe(
              Effect.andThen(S.decodeUnknown(S.parseJson(GenerateConfig)))
            );

          const packageJson = 
            yield* readFileContent("package.json").pipe(
              Effect.andThen(S.decodeUnknown(S.parseJson(PackageJson)))
            );

          const clientPackagePrefix = "@aws-sdk/client-";

          const getClientNames = 
            (input: string[]) =>
              pipe(
                input,
                Array.filterMap(_ => 
                  _.startsWith(clientPackagePrefix) ? 
                    Option.some(_.slice(clientPackagePrefix.length)) : 
                    Option.none()
                ),
                Array.dedupe
              )

          const clientsInPackageJson = [
            ...(packageJson.dependencies ? getClientNames(Object.keys(packageJson.dependencies)) : []),
            ...(packageJson.devDependencies ? getClientNames(Object.keys(packageJson.devDependencies)) : []),
          ] as const;

          return GenerateConfigTag.of({ 
            target_dir: definedConfig.target_dir,
            clients: definedConfig.clients ?? clientsInPackageJson
           });
        })
      ),
      Effect.runPromise
    )
