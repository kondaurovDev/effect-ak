import { Effect, Equal } from "effect";

import { LambdaClientService } from "#/clients/lambda.js";
import { LambdaFunctionConfigurationViewService } from "./view.js";
import { LambdaFunctionConfigurationFactoryService } from "./factory.js";
import * as S from "../schema/_export.js";

export class LambdaFunctionConfigurationManageService
  extends Effect.Service<LambdaFunctionConfigurationManageService>()("LambdaFunctionConfigurationManageService", {
    effect:
      Effect.gen(function* () {

        const $ = {
          client: yield* LambdaClientService,
          view: yield* LambdaFunctionConfigurationViewService,
          factory: yield* LambdaFunctionConfigurationFactoryService
        };

        const syncFunctionConfiguration =
          (input: {
            functionName: string
          } & S.LambdaFunctionConfigurationSyncCommand) =>
            Effect.gen(function* () {

              const currentConfiguration =
                yield* $.factory.make(input);

              const deployedConfiguration =
                yield* $.view.get({
                  functionName: input.functionName
                });

              if (deployedConfiguration == null) {
                yield* Effect.logWarning("Function not found");
                return false;
              }

              if (Equal.equals(deployedConfiguration, currentConfiguration)) {
                yield* Effect.logDebug("Function configuration is up to date");
                return false;
              }

              const response =
                yield* $.client.execute(
                  "updateFunctionConfiguration",
                  {
                    FunctionName: input.functionName,
                    ...currentConfiguration
                  }
                );

              yield* Effect.logDebug("Function configurations has been updated", response.$metadata);
            });

        return {
          $,
          syncFunctionConfiguration
        } as const;

      }),
      dependencies: [
        LambdaClientService.Default,
        LambdaFunctionConfigurationViewService.Default,
        LambdaFunctionConfigurationFactoryService.Default
      ]
  }) { }



