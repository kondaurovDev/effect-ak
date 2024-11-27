import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import { GetIntegrationsCommand } from "@aws-sdk/client-apigatewayv2";

import { ApiId } from "../../main/types.js";
import { ApiGatewayClient } from "../../client.js";

export class GatewayIntegrationViewService
  extends Effect.Service<GatewayIntegrationViewService>()("GatewayIntegrationViewService", {
    effect:
      Effect.gen(function* () {

        const gw = yield* ApiGatewayClient;

        const getApiIntegrations = (
          apiId: ApiId
        ) =>
          pipe(
            gw.executeMethod(
              "getting api list of integrations", _ =>
              _.send(new GetIntegrationsCommand({ ApiId: apiId }))
            ),
            Effect.andThen(_ => _.Items ?? [])
          );

        const getSqsIntegrations = (
          apiId: ApiId
        ) =>
          Effect.andThen(
            getApiIntegrations(apiId),
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
        ApiGatewayClient.Default
      ]

  }) { }
