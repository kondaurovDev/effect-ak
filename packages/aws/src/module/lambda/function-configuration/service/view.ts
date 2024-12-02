import { Effect, Schema } from "effect";

import { LambdaClientService, LambdaMethodOutput, recoverFromLambdaException } from "#/clients/lambda.js";
import { LambdaFunctionConfigurationSdk } from "../schema/_export.js";

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
            functionName: string | undefined,
            beforeDecode?: 
              (input: LambdaMethodOutput<"getFunctionConfiguration">) => LambdaMethodOutput<"getFunctionConfiguration">
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

              return yield* Schema.decode(LambdaFunctionConfigurationSdk)(input.beforeDecode ? input.beforeDecode(response) : response);

            }).pipe(
              Effect.orDie
            );

        return {
          get
        } as const;

      }),

    dependencies: [
      LambdaClientService.Default
    ]
  }) { }



