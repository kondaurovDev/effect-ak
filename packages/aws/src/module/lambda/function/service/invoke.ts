import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import * as Cause from "effect/Cause";

import { LambdaClientService } from "../../client.js";
import { LambdaFunctionPermissionService } from "./permission.js";
import { LambdaFunctionName } from "../schema.js";

export class LambdaFunctionInvokeService
  extends Effect.Service<LambdaFunctionInvokeService>()("LambdaFunctionInvokeService", {
    effect:
      Effect.gen(function* () {

        const lambda = yield* LambdaClientService;
        const permissions = yield* LambdaFunctionPermissionService;

        const createFunctionUrlConfig =
          (input: {
            functionName: LambdaFunctionName
          }) =>
            lambda.execute(
              "createFunctionUrlConfig",
              {
                FunctionName: input.functionName,
                AuthType: "NONE"
              }
            ).pipe(
              Effect.andThen(_ => _.FunctionUrl),
              Effect.filterOrFail(_ => _ != null, () => new Cause.RuntimeException("FunctionUrl is undefined"))
            )

        const enableFunctionUrl =
          (input: {
            functionName: LambdaFunctionName
          }) =>
            pipe(
              permissions.addPermissionToBeInvokedByUrl(input),
              Effect.andThen(
                createFunctionUrlConfig(input)
              )
            )

        const invokeFunction =
          (input: {
            functionName: LambdaFunctionName
            args: unknown,
            async: boolean
          }) =>
            lambda.execute(
              "invoke",
              {
                FunctionName: input.functionName,
                Payload: JSON.stringify(input.args),
                InvocationType: input.async ? "Event" : "RequestResponse"
              }
            );

        return {
          createFunctionUrlConfig, enableFunctionUrl, invokeFunction
        } as const

      }),

    dependencies: [
      LambdaClientService.Default,
      LambdaFunctionPermissionService.Default
    ]
  }) { }
