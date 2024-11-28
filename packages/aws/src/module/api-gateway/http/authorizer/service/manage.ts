import { pipe } from "effect/Function";
import * as Match from "effect/Match";
import * as Effect from "effect/Effect";

import { LambdaFunctionViewService, LambdaFunctionPermissionService } from "../../../../lambda/function/index.js";
import { CreateOrUpdateAuthorizer, LambdaAuthorizer } from "../types.js";
import { Apigatewayv2ClientService } from "../../../client.js";

export class ApiGatewayHttpAuthorizerManageService
  extends Effect.Service<ApiGatewayHttpAuthorizerManageService>()("ApiGatewayHttpAuthorizerManageService", {
    effect:
      Effect.gen(function* () {

        const $ = {
          client: yield* Apigatewayv2ClientService,
          lambdaView: yield* LambdaFunctionViewService,
          lambdaPermission: yield* LambdaFunctionPermissionService,
        }

        // https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html

        const upsertLambdaAuthorizer = 
          (input: LambdaAuthorizer) =>
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
                IdentitySource: [ ...authorizer.identitySources ],
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
                  $.client.execute(
                    "updateAuthorizer",
                    {
                      AuthorizerId,
                      ...params
                    }
                  )
                ),
                Match.orElse(() =>
                  $.client.execute(
                    "createAuthorizer",
                    {
                      ...params
                    }
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
      Apigatewayv2ClientService.Default,
      GatewayAuthorizerViewService.Default,
      LambdaFunctionViewService.Default,
      LambdaFunctionPermissionService.Default,
    ]
  }) { }

