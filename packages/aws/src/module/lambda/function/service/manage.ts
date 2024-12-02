import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";

import { LambdaClientService, recoverFromLambdaException } from "#/clients/lambda.js";
import { LambdaFunctionConfigurationManageService } from "#/module/lambda/function-configuration/service/_export.js";
import { LambdaFunctionFactoryService } from "./factory.js";
import * as S from "../schema/_export.js";

export class LambdaFunctionManageService
  extends Effect.Service<LambdaFunctionManageService>()("LambdaFunctionManageService", {
    effect:
      Effect.gen(function* () {

        const $ = {
          client: yield* LambdaClientService,
          configuration: yield* LambdaFunctionConfigurationManageService,
          factory: yield* LambdaFunctionFactoryService
        };

        const updateFunctionCode =
          (input: {
            functionName: string,
            code: S.LambdaFunctionSourceCode
          }) =>
            Effect.gen(function* () {

              const response =
                yield* pipe(
                  $.client.execute(
                    "updateFunctionCode",
                    {
                      FunctionName: input.functionName,
                      ZipFile: yield* $.factory.makeCodeZipArchive(input.code)
                    }
                  ),
                ).pipe(
                  recoverFromLambdaException("ResourceNotFoundException", undefined)
                );

              if (!response) {
                yield* Effect.logWarning("Function does not exist");
                return false;
              }

              yield* Effect.logDebug("Function code has been updated");

              return true;

            });

        const upsertFunction =
          (input: S.LambdaFunctionUpsertCommand) =>
            Effect.gen(function* () {

              const currentConfiguration =
                yield* $.configuration.$.view.get(input);

              const code = yield* $.factory.makeCodeZipArchive(input.code);

              if (!currentConfiguration) {
                const response =
                  yield* $.client.execute(
                    "createFunction",
                    {
                      FunctionName: input.functionName,
                      Code: {
                        ZipFile: code
                      },
                      Role: input.iamRole,
                      Runtime: input.runtime,
                      ...input.configuration,
                    }
                  );

                yield* Effect.logInfo("Function has been created", response.$metadata.httpStatusCode);
                return true;
              }

              if (currentConfiguration.CodeSize != code.byteLength) {
                yield* $.client.execute(
                  "updateFunctionCode",
                  {
                    FunctionName: input.functionName,
                    ZipFile: code
                  }
                );
                yield* Effect.sleep("10 seconds");
              }

              yield* $.configuration.syncFunctionConfiguration(input);

              return true;

            });

        return {
          $, updateFunctionCode, upsertFunction
        } as const;

      }),

    dependencies: [
      LambdaClientService.Default,
      LambdaFunctionConfigurationManageService.Default,
      LambdaFunctionFactoryService.Default
    ]
  }) { }
