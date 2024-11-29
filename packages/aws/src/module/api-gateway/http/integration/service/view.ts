import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";

import { Apigatewayv2ClientService } from "#clients/apigatewayv2.js";

export class HttpApiGatewayIntegrationViewService
  extends Effect.Service<HttpApiGatewayIntegrationViewService>()("HttpApiGatewayIntegrationViewService", {
    effect:
      Effect.gen(function* () {

        const client = yield* Apigatewayv2ClientService;

        const getApiIntegrations =
          (input: {
            apiId: string
          }) =>
            pipe(
              client.execute(
                "getIntegrations",
                {
                  ApiId: input.apiId
                }
              ),
              Effect.andThen(_ => _.Items ?? [])
            );

        const getSqsIntegrations =
          (input: {
            apiId: string
          }) =>
            Effect.andThen(
              getApiIntegrations(input),
              integrations =>
                integrations.filter(_ =>
                  _.IntegrationType === "AWS_PROXY" &&
                  _.IntegrationSubtype?.startsWith("SQS")
                )
            );

        return {
          getApiIntegrations, getSqsIntegrations
        } as const

      }),

    dependencies: [
      Apigatewayv2ClientService.Default
    ]

  }) { }
