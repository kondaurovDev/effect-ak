import * as Effect from "effect/Effect";
import * as Equal from "effect/Equal";
import * as Schema from "effect/Schema";

import { LambdaClientService } from "../../client.js";
import { LambdaFunctionConfiguration } from "../schema.js";
import { LambdaFunctionConfigurationViewService } from "./view.js";
import { LambdaFunctionConfigurationFactoryService } from "./factory.js";

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
            functionName: string,
            configuration: LambdaFunctionConfiguration,
          }) =>
            Effect.gen(function* () {

              if (!Schema.is(LambdaFunctionConfiguration)(input.configuration)) {
                yield* Effect.logWarning("input configuration is not an instance of LambdaFunctionConfiguration")
              }

              const currentConfiguration =
                yield* $.view.get({
                  functionName: input.functionName
                });

              if (currentConfiguration == null) {
                yield* Effect.logWarning("Function not found");
                return false;
              }

              if (Equal.equals(currentConfiguration, input.configuration)) {
                yield* Effect.logDebug("Function configuration is up to date");
                return false;
              }

              const response =
                yield* $.client.execute(
                  "updateFunctionConfiguration",
                  {
                    FunctionName: input.functionName,
                    ...input.configuration
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



