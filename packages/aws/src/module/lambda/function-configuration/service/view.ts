import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { LambdaClientService, recoverFromLambdaException } from "#/clients/lambda.js";
import { LambdaFunctionConfiguration } from "../schema.js";

export class LambdaFunctionConfigurationViewService
  extends Effect.Service<LambdaFunctionConfigurationViewService>()("LambdaFunctionConfigurationViewService", {
    effect:
      Effect.gen(function* () {

        const $ = {
          lambda: yield* LambdaClientService
        }

        // https://docs.aws.amazon.com/lambda/latest/api/API_GetFunctionConfiguration.html
        const get =
          (input: {
            functionName: string | undefined
          }) =>
            Effect.gen(function* () {

              const response =
                yield* $.lambda.execute(
                  "getFunctionConfiguration",
                  {
                    FunctionName: input.functionName
                  }
                ).pipe(
                  recoverFromLambdaException("ResourceNotFoundException", undefined)
                );

              if (!response) return undefined;

              const configuration =
                Schema.decodeUnknown(LambdaFunctionConfiguration)(response)

              return yield* configuration.pipe(Effect.orDie)

            });

        return {
          get
        } as const;



      }),

    dependencies: [
      LambdaClientService.Default
    ]
  }) { }



