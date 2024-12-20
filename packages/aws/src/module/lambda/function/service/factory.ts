import { pipe, Effect, Match, Config } from "effect";
import { NodeCodeBundlerService, NodeZipService } from "@effect-ak/misc/node";

import { awsSdkModuleName } from "#/core/const.js";
import { CoreConfigurationProviderService } from "#/core/index.js";
import * as S from "../schema/_export.js";

export class LambdaFunctionFactoryService
  extends Effect.Service<LambdaFunctionFactoryService>()("LambdaFunctionFactoryService", {
    effect:
      Effect.gen(function* () {

        const zip = yield* NodeZipService;
        const codeBundler = yield* NodeCodeBundlerService;
        const { projectId } = yield* CoreConfigurationProviderService;

        const minifyCode = 
          yield* pipe(
            Config.boolean("minify-code"),
            Config.nested(awsSdkModuleName),
            Config.withDefault(true)
          );

        const makeFunctionName =
          (name: string) =>
            `${projectId}-${name}`;

        const makeCodeZipArchive =
          (handlerCode: S.LambdaFunctionSourceCode) =>
            Effect.gen(function* () {

              const code =
                yield* pipe(
                  Match.value(handlerCode),
                  Match.when({ type: "inline" }, _ =>
                    Effect.succeed(_.code)
                  ),
                  Match.when({ type: "file" }, input =>
                    codeBundler.createBundle({
                      inputFilePath: input.path,
                      external: input.external,
                      minify: input.minify ?? minifyCode
                    })
                  ),
                  Match.exhaustive
                );

              const archive =
                yield* zip.createZipArchive([
                  {
                    type: "file",
                    name: "index.mjs",
                    content: code
                  }
                ]);

              return Uint8Array.from(archive);

            })

        return {
          makeFunctionName, makeCodeZipArchive
        } as const;

      }),

      dependencies: [
        NodeZipService.Default,
        NodeCodeBundlerService.Default,
        CoreConfigurationProviderService.Default
      ]
  }) { }
