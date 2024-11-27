import * as Effect from "effect/Effect";
import * as Cause from "effect/Cause";

import { LambdaClientService } from "../../client.js";
import { LambdaFunctionName } from "../../function/schema.js";

export class LambdaEventSourceViewService
  extends Effect.Service<LambdaEventSourceViewService>()("LambdaEventSourceViewService", {
    effect:
      Effect.gen(function* () {

        const lambda = yield* LambdaClientService;

        const getIdByFunctionName =
          (input: {
            functionName: LambdaFunctionName
          }) =>
            lambda.execute(
              "listEventSourceMappings",
              {
                FunctionName: input.functionName
              }
            ).pipe(
              Effect.andThen(_ => _.EventSourceMappings),
              Effect.filterOrFail(_ => _ != null, () => new Cause.RuntimeException("EventSourceMappings is undefined")),
              Effect.andThen(_ => _.length == 0 ? Effect.succeed(undefined) : Effect.fromNullable(_.at(0)?.UUID))
            )


        return {
          getIdByFunctionName
        } as const;

      }),

    dependencies: [
      LambdaClientService.Default
    ]
  }) { }
