import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import * as Match from "effect/Match";
import { CreateIntegrationCommand, UpdateIntegrationCommand } from "@aws-sdk/client-apigatewayv2";

import { HttpApiGatewayIntegrationViewService } from "./view.js";

export class ApiGatewayHttpIntegrationLambdaService
  extends Effect.Service<ApiGatewayHttpIntegrationLambdaService>()("ApiGatewayHttpIntegrationLambdaService", {
    effect:
      Effect.gen(function* () {

        const gw = yield* ApiGatewayClient;
        const view = yield* GatewayIntegrationViewService;
        const fnInfo = yield* LambdaFunctionInfoService;
        const fnSettings = yield* LambdaFunctionSettingsService;

        const upsertIntegration = (
          apiId: ApiId,
          description: IntegrationDescription,
          functionName: FunctionName,
          timeout: number
        ) =>
          Effect.gen(function* () {
    
            const functionArn = fnInfo.getFunctionArnFromName(functionName);
    
            const currentIntegration =
              yield* pipe(
                view.getApiIntegrations(apiId),
                Effect.andThen(integrations =>
                  integrations.find(_ => _.Description == description)
                )
              );
    
            const integrationId = 
              yield* pipe(
                Match.value(currentIntegration == null),
                Match.when(true, () =>
                  pipe(
                    gw.executeMethod(
                      `create lambda integration '${description}'`, _ =>
                      _.send(
                        new CreateIntegrationCommand({
                          ApiId: apiId,
                          IntegrationType: "AWS_PROXY",
                          PayloadFormatVersion: "2.0",
                          IntegrationUri: functionArn,
                          TimeoutInMillis: timeout,
                          Description: description
                        })
                      )
                    ),
                    Effect.andThen(result =>
                      S.validate(IntegrationId)(result.IntegrationId)
                    )
                  )
                ),
                Match.when(false, () =>
                  pipe(
                    S.validate(IntegrationId)(currentIntegration?.IntegrationId),
                    Effect.andThen(integrationId =>
                      gw.executeMethod(
                        `update lambda integration '${description}'`, _ =>
                        _.send(
                          new UpdateIntegrationCommand({
                            IntegrationId: integrationId,
                            ApiId: apiId,
                            IntegrationUri: functionArn,
                            TimeoutInMillis: timeout
                          }))
                      )
                    ),
                    Effect.andThen(result =>
                      S.validate(IntegrationId)(result.IntegrationId)
                    )
                  )
                ),
                Match.exhaustive
              );
    
            yield* fnSettings.addInvokeFunctionByGatewayPermission(functionName, apiId)
    
            return integrationId;
    
          })
    
          return {
            upsertIntegration
          } as const;

      }),

      dependencies: [
        ApiGatewayClient.Default,
        GatewayIntegrationViewService.Default,
        LambdaFunctionInfoService.Default,
        LambdaFunctionSettingsService.Default
      ]
    
    }) {}

