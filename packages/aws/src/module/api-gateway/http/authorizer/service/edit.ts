import { pipe } from "effect/Function";
import * as Match from "effect/Match";
import * as Effect from "effect/Effect";
import { CreateAuthorizerCommand, UpdateAuthorizerCommand } from "@aws-sdk/client-apigatewayv2";

import type { ApiId } from "../../main/types.js";
import { LambdaFunctionViewService } from "../../../../lambda/function/service/view.js";
import { BootstrapConfigProvider } from "../../../../provider/bootstrap-config.js";
import { CreateOrUpdateAuthorizer, LambdaAuthorizer } from "../types.js";
import { ApiGatewayClient } from "../../../client.js";
import { LambdaFunctionSettingsService } from "../../../../lambda/function/service/permission.js";
import { GatewayAuthorizerViewService } from "./view.js"

export class GatewayAuthorizerEditService
  extends Effect.Service<GatewayAuthorizerEditService>()("GatewayAuthorizerEditService", {
    effect:
      Effect.gen(function* () {

        const gatewayClient = yield* ApiGatewayClient;
        const gatewayView = yield* GatewayAuthorizerViewService;
        const fnView = yield* LambdaFunctionViewService;
        const fnSettings = yield* LambdaFunctionSettingsService;
        const bootstrap = yield* BootstrapConfigProvider;

        // https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html

        const upsertLambdaAuthorizer = (
          apiId: ApiId,
          authorizer: LambdaAuthorizer
        ) =>
          Effect.gen(function* () {

            const lambda =
              yield* pipe(
                fnView.getFunctionByName(
                  bootstrap.getFunctionName(authorizer.functionName)
                ),
                Effect.filterOrFail(_ => _ != null)
              )

            const authorizerUri =
              [
                `arn:aws:apigateway:${bootstrap.contextConfig[2]}:lambda:`,
                `path/2015-03-31/functions/${lambda.FunctionArn}/invocations`
              ].join();

            const params =
              CreateOrUpdateAuthorizer({
                Name: authorizer.id,
                AuthorizerType: "REQUEST",
                IdentitySource: [...authorizer.identitySources],
                ApiId: apiId,
                AuthorizerPayloadFormatVersion: "2.0",
                EnableSimpleResponses: true,
                AuthorizerResultTtlInSeconds: authorizer.cacheTtlSec,
                AuthorizerUri: authorizerUri
              });

            const current =
              yield* pipe(
                gatewayView.getApiAuthorizers(apiId),
                Effect.andThen(result => result.find(_ => _.Name == authorizer.id))
              );

            const result =
              yield* pipe(
                Match.value(current),
                Match.when(({ AuthorizerId: Match.defined }), ({ AuthorizerId }) =>
                  gatewayClient.executeMethod(
                    "update lambda authorizer", _ =>
                    _.send(
                      new UpdateAuthorizerCommand({
                        AuthorizerId,
                        ...params
                      }))
                  )
                ),
                Match.orElse(() =>
                  gatewayClient.executeMethod(
                    "create lambda authorizer", _ =>
                    _.send(
                      new CreateAuthorizerCommand({
                        ...params
                      })
                    )
                  )
                ),
              );

            yield* fnSettings.addInvokeFunctionByGatewayPermission(lambda.FunctionArn, apiId);

            return result;

          });

        return {
          upsertLambdaAuthorizer
        } as const

      }),

    dependencies: [
      ApiGatewayClient.Default,
      ApiGatewayClient.Default,
      GatewayAuthorizerViewService.Default,
      LambdaFunctionViewService.Default,
      LambdaFunctionSettingsService.Default,
      BootstrapConfigProvider.Default
    ]
  }) { }

