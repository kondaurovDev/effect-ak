import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import type { Runtime } from "@aws-sdk/client-lambda";

import type { IamRoleArn } from "#/module/iam/index.js";
import { LambdaClientService, recoverFromLambdaException } from "#/clients/lambda.js";
import { LambdaFunctionConfiguration } from "../../function-configuration/schema.js";
import { LambdaFunctionConfigurationManageService } from "../../function-configuration/index.js";
import { LambdaFunctionFactoryService } from "./factory.js";
import { LambdaFunctionSourceCode } from "../schema.js";

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
            code: LambdaFunctionSourceCode
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
          (input: {
            functionName: string,
            configuration: LambdaFunctionConfiguration,
            code: LambdaFunctionSourceCode,
            role: IamRoleArn,
            runtime: Runtime
          }) =>
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
                      Role: input.role,
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
