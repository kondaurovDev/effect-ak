import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import * as Match from "effect/Match";
import * as Config from "effect/Config";
import { NodeCodeBundlerService, NodeZipService } from "@effect-ak/misc/node";

import { AwsProjectIdConfig } from "../../../../core/service/configuration-provider.js";
import { awsSdkModuleName } from "../../../../core/const.js";
import * as S from "../schema.js";

export class LambdaFunctionFactoryService
  extends Effect.Service<LambdaFunctionFactoryService>()("LambdaFunctionFactoryService", {
    effect:
      Effect.gen(function* () {

        const zip = yield* NodeZipService;
        const codeBundler = yield* NodeCodeBundlerService;
        const { projectId } = yield* AwsProjectIdConfig;

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
      ]
  }) { }
