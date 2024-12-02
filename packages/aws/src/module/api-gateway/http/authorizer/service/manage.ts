import * as Effect from "effect/Effect";

import { LambdaFunctionViewService, LambdaFunctionPermissionService } from "#/module/lambda/function/index.js";
import { AwsRegionConfig } from "#/core/index.js";
import { Apigatewayv2ClientService } from "#/clients/apigatewayv2.js";
import { ApiGatewayHttpViewService } from "#/module/api-gateway/http/service/view.js";
import { CreateOrUpdateAuthorizer, LambdaAuthorizer } from "../types.js";
import { ApiGatewayHttpAuthorizerViewService } from "./view.js";
import { makeLambdaFunctionAuthorizerArnFrom } from "../const.js";

export class ApiGatewayHttpAuthorizerManageService
  extends Effect.Service<ApiGatewayHttpAuthorizerManageService>()("ApiGatewayHttpAuthorizerManageService", {
    effect:
      Effect.gen(function* () {

        const region = yield* AwsRegionConfig;

        const client = yield* Apigatewayv2ClientService;
        const view = yield* ApiGatewayHttpAuthorizerViewService;
        const gw_view = yield* ApiGatewayHttpViewService;
        const lambda_permission = yield* LambdaFunctionPermissionService;

        // https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html

        const upsertLambdaAuthorizer =
          (input: LambdaAuthorizer) =>
            Effect.gen(function* () {

              const projectApi = yield* gw_view.getProjectApiGateway;

              if (!projectApi) {
                return yield* Effect.die("Default http api gateway does not exist")
              }

              const authUri =
                makeLambdaFunctionAuthorizerArnFrom({
                  region, functionArn: input.functionArn
                })

              const params =
                CreateOrUpdateAuthorizer({
                  Name: input.name,
                  AuthorizerType: "REQUEST",
                  IdentitySource: [...input.identitySources],
                  ApiId: projectApi.apiId,
                  AuthorizerPayloadFormatVersion: "2.0",
                  EnableSimpleResponses: true,
                  AuthorizerResultTtlInSeconds: input.cacheTtl,
                  AuthorizerUri: authUri
                });

              const current =
                yield* view.getOne({
                  name: input.name,
                  apiId: projectApi.apiId
                });

              if (!current) {
                yield* client.execute(
                  "createAuthorizer",
                  {
                    ...params
                  }
                )
                return;
              }

              yield* client.execute(
                "updateAuthorizer",
                {
                  AuthorizerId: current.AuthorizerId,
                  ...params
                }
              );

              const fnName = input.functionArn.split(":").at(-1);

              if (!fnName) {
                return yield* Effect.die("Function name is undefined");
              }

              yield* lambda_permission.addInvokeFunctionByGatewayPermission({
                apiId: projectApi.apiId,
                functionName: fnName
              });

            });

        return {
          upsertLambdaAuthorizer
        } as const

      }),

    dependencies: [
      Apigatewayv2ClientService.Default,
      ApiGatewayHttpAuthorizerViewService.Default,
      LambdaFunctionViewService.Default,
      LambdaFunctionPermissionService.Default,
    ]
  }) { }
