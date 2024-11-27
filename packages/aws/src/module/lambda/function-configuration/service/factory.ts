import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import * as Config from "effect/Config";
import { NodeCodeBundlerService } from "@effect-ak/misc/node";

import { awsSdkModuleName } from "../../../../internal/const.js";
import { LambdaFunctionConfiguration } from "../schema.js";

export class LambdaFunctionConfigurationFactoryService
  extends Effect.Service<LambdaFunctionConfigurationFactoryService>()("LambdaFunctionConfigurationFactoryService", {
    effect:
      Effect.gen(function* () {

        const minifyCode = 
          yield* pipe(
            Config.boolean("minify-code"),
            Config.nested(awsSdkModuleName),
            Config.withDefault(true)
          );

        const makeConfiguration = 
          (input: LambdaFunctionConfiguration) =>
            Schema.decode(LambdaFunctionConfiguration)(input)

        return {
          makeConfiguration
        } as const;

      }),

      dependencies: [
        NodeCodeBundlerService.Default
      ]
  }) { }
