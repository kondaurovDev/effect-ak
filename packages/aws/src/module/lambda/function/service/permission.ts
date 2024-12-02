import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";

import { LambdaClientService, LambdaMethodInput, recoverFromLambdaException } from "#/clients/lambda.js";
import { makeExecuteApiArnFrom } from "#/module/api-gateway/http/brands.js";
import { CoreConfigurationProviderService } from "#/core/index.js";
import { LambdaFunctionName } from "../schema.js";

export class LambdaFunctionPermissionService
  extends Effect.Service<LambdaFunctionPermissionService>()("LambdaFunctionPermissionService", {
    effect:
      Effect.gen(function* () {

        const lambda = yield* LambdaClientService;
        const { getAccountId, region } = yield* CoreConfigurationProviderService;

        const accountId = yield* getAccountId;

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
            apiId: string
          }) =>
            addPermission({
              FunctionName: input.functionName,
              StatementId: `apigateway-invoke-permissions-${input.apiId}`,
              Action: "lambda:InvokeFunction",
              Principal: "apigateway.amazonaws.com",
              SourceArn:
                makeExecuteApiArnFrom({
                  apiId: input.apiId, region, accountId: yield* accountId
                })
            })

        return {
          addPermission, addPermissionToBeInvokedByUrl, addInvokeFunctionByGatewayPermission
        } as const;

      }),

    dependencies: [
      LambdaClientService.Default
    ]
  }) { }
