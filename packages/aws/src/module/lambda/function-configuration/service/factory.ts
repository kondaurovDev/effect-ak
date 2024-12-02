import { Effect, Schema } from "effect";

import * as S from "../schema/_export.js";

export class LambdaFunctionConfigurationFactoryService
  extends Effect.Service<LambdaFunctionConfigurationFactoryService>()("LambdaFunctionConfigurationFactoryService", {
    effect:
      Effect.gen(function* () {

        const make = 
          (input: Omit<S.LambdaFunctionConfigurationSyncCommand, "functionName">) =>
            Schema.decode(S.LambdaFunctionConfigurationSdk)({
              Environment: {
                Variables: input.environment
              },
              Handler: input.handler,
              MemorySize: input.memorySize,
              Timeout: input.timeout
            });

        return {
          make
        } as const;

      })
  }) { }
