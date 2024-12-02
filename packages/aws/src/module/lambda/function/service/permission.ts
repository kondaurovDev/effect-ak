import { pipe, Effect } from "effect";

import { LambdaClientService, LambdaMethodInput, recoverFromLambdaException } from "#/clients/lambda.js";
import { makeExecuteApiArnFrom } from "#/module/api-gateway/http/brands.js";
import { CoreConfigurationProviderService } from "#/core/index.js";
import { LambdaFunctionName } from "../schema/_export.js";

export class LambdaFunctionPermissionService
  extends Effect.Service<LambdaFunctionPermissionService>()("LambdaFunctionPermissionService", {
    effect:
      Effect.gen(function* () {

        const lambda = yield* LambdaClientService;
        const { getAccountId, region } = yield* CoreConfigurationProviderService;

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
            Effect.gen(function* () {
              const accountId = yield* getAccountId;

              return yield* addPermission({
                FunctionName: input.functionName,
                StatementId: `apigateway-invoke-permissions-${input.apiId}`,
                Action: "lambda:InvokeFunction",
                Principal: "apigateway.amazonaws.com",
                SourceArn:
                  makeExecuteApiArnFrom({
                    apiId: input.apiId, region, accountId
                  })
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
