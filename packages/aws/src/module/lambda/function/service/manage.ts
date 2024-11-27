import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";

import type { IamRoleArn } from "../../../iam/index.js";
import { LambdaClientService, recoverFromLambdaException } from "../../client.js";
import { LambdaFunctionConfiguration } from "../../function-configuration/schema.js";
import { LambdaFunctionConfigurationManageService } from "../../function-configuration/index.js";

export class LambdaFunctionManageService
  extends Effect.Service<LambdaFunctionManageService>()("LambdaFunctionManageService", {
    effect:
      Effect.gen(function* () {

        const $ = {
          client: yield* LambdaClientService,
          configuration: yield* LambdaFunctionConfigurationManageService
        };

        const updateFunctionCode =
          (input: {
            functionName: string,
            code: Uint8Array
          }) =>
            Effect.gen(function* () {

              const response =
                yield* pipe(
                  $.client.execute(
                    "updateFunctionCode", 
                    {
                      FunctionName: input.functionName,
                      ZipFile: input.code
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
            code: Uint8Array,
            role: IamRoleArn
          }) =>
            Effect.gen(function* () {

              const currentConfiguration =
                yield* $.configuration.$.view.get(input).pipe(

                )

              if (!currentConfiguration) {
                const response =
                  yield* $.client.execute(
                    "createFunction",
                    {
                      FunctionName: input.functionName,
                      Code: {
                        ZipFile: input.code
                      },
                      Role: input.role,
                      ...input.configuration
                    }
                  );

                yield* Effect.logInfo("Function has been created", response.$metadata.httpStatusCode);
                return true;
              }

              const updateResponse =
                yield* $.client.execute(
                  "updateFunctionCode",
                  {
                    FunctionName: input.functionName,
                    ZipFile: input.code
                  }
                );

              $.configuration.syncFunctionConfiguration(input);

              return updateResponse.State;

            });


        return {
          $, updateFunctionCode, upsertFunction
        } as const;

      }),

    dependencies: [
      LambdaClientService.Default,
      LambdaFunctionConfigurationManageService.Default,
    ]
  }) { }
