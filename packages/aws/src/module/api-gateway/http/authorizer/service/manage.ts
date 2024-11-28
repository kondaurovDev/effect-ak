import { pipe } from "effect/Function";
import * as Match from "effect/Match";
import * as Effect from "effect/Effect";
import { CreateAuthorizerCommand, UpdateAuthorizerCommand } from "@aws-sdk/client-apigatewayv2";

import { LambdaFunctionViewService } from "../../../../lambda/function/service/view.js";
import { CreateOrUpdateAuthorizer, LambdaAuthorizer } from "../types.js";
import { Apigatewayv2ClientService } from "../../../client.js";

export class ApiGatewayHttpAuthorizerManageService
  extends Effect.Service<ApiGatewayHttpAuthorizerManageService>()("ApiGatewayHttpAuthorizerManageService", {
    effect:
      Effect.gen(function* () {

        const $ = {
          client: yield* Apigatewayv2ClientService,
          lambdaView: yield* LambdaFunctionViewService,
        }

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

