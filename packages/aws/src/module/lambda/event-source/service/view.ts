import { Effect } from "effect";

import { LambdaClientService } from "#/clients/lambda.js";
import { LambdaFunctionName } from "#/module/lambda/function/schema/_export.js";

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
              Effect.filterOrDieMessage(_ => _ != null, "EventSourceMappings is undefined"),
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
