import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";

import { LambdaClientService, LambdaMethodInput, recoverFromLambdaException } from "../../client.js";
import { LambdaFunctionName } from "../schema.js";
import { makeExecuteApiArnFrom } from "../../../api-gateway/http/const.js";
import { AwsRegionConfig } from "../../../../internal/configuration.js";
import { StsService } from "../../../sts/service.js";

export class LambdaFunctionPermissionService
  extends Effect.Service<LambdaFunctionPermissionService>()("LambdaFunctionPermissionService", {
    effect:
      Effect.gen(function* () {

        const lambda = yield* LambdaClientService;
        const region = yield* AwsRegionConfig;
        const { accountId } = yield* StsService;

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
                  apiId: input.apiId, region, accountId
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
