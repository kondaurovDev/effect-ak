import { pipe, Effect, Cause } from "effect";

import { LambdaClientService } from "#/clients/lambda.js";
import { LambdaFunctionPermissionService } from "./permission.js";
import * as S from "../schema/_export.js";

export class LambdaFunctionInvokeService
  extends Effect.Service<LambdaFunctionInvokeService>()("LambdaFunctionInvokeService", {
    effect:
      Effect.gen(function* () {

        const lambda = yield* LambdaClientService;
        const permissions = yield* LambdaFunctionPermissionService;

        const createFunctionUrlConfig =
          (input: {
            functionName: S.LambdaFunctionName
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
            functionName: S.LambdaFunctionName
          }) =>
            pipe(
              permissions.addPermissionToBeInvokedByUrl(input),
              Effect.andThen(
                createFunctionUrlConfig(input)
              )
            )

        const invokeFunction =
          (input: {
            functionName: S.LambdaFunctionName
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
