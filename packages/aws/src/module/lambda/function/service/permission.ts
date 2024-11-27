import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";

import { LambdaClientService, LambdaMethodInput, recoverFromLambdaException } from "../../client.js";
import { LambdaFunctionName } from "../schema.js";

export class LambdaFunctionPermissionService
  extends Effect.Service<LambdaFunctionPermissionService>()("LambdaFunctionPermissionService", {
    effect:
      Effect.gen(function* () {

        const lambda = yield* LambdaClientService;

        const addPermission =
          (input: LambdaMethodInput<"addPermission">) =>
            pipe(
              lambda.execute("addPermission", input),
              Effect.andThen(() => true),
              recoverFromLambdaException("ResourceConflictException", false)
            );

        const addPermissionToBeInvokedByUrl =
          (input: {
            functionName: LambdaFunctionName
          }) =>
            addPermission({
              FunctionName: input.functionName,
              StatementId: "url",
              Action: "lambda:InvokeFunctionUrl",
              Principal: "*",
              FunctionUrlAuthType: "NONE",
            });

        const addInvokeFunctionByGatewayPermission =
          (input: {
            functionName: LambdaFunctionName,
            apiId: unknown
          }) =>
            addPermission({
              FunctionName: input.functionName,
              StatementId: `apigateway-invoke-permissions-${input.apiId}`,
              Action: "lambda:InvokeFunction",
              Principal: "apigateway.amazonaws.com",
              SourceArn: deps.gwInfo.getExecuteApiArn(apiId)
            });

        return {
          addPermission, addPermissionToBeInvokedByUrl, addInvokeFunctionByGatewayPermission
        } as const;

      }),

    dependencies: [
      LambdaClientService.Default
    ]
  }) { }

