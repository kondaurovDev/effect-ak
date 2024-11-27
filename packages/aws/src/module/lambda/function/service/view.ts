import * as Effect from "effect/Effect";

import { LambdaClientService } from "../../client.js";

export class LambdaFunctionViewService
  extends Effect.Service<LambdaFunctionViewService>()("LambdaFunctionViewService", {
    effect:
      Effect.gen(function* () {

        const lambda = yield* LambdaClientService;

        return {

        } as const;

      }),
    dependencies: [
      LambdaClientService.Default
    ]
  }) { }