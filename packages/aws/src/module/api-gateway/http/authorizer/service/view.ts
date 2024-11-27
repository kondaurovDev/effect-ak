import { pipe } from "effect";
import * as Effect from "effect/Effect";
import { GetAuthorizersCommand } from "@aws-sdk/client-apigatewayv2";

import type { ApiId } from "../../main/types.js";
import { ApiGatewayClient } from "../../../client.js";

export class GatewayAuthorizerViewService
  extends Effect.Service<GatewayAuthorizerViewService>()("GatewayAuthorizerViewService", {
    effect:
      Effect.gen(function* () {

        const gatewayClient = yield* ApiGatewayClient;

        const getApiAuthorizers =
          (apiId: ApiId) =>
            pipe(
              gatewayClient.executeMethod(
                `getting api authorizers of ${apiId}`, _ =>
                _.send(
                  new GetAuthorizersCommand({
                    ApiId: apiId,
                    MaxResults: "20"
                  }))
              ),
              Effect.andThen(_ => _.Items ?? [])
            );

        return {
          getApiAuthorizers
        } as const;

      }),
    dependencies: [
      ApiGatewayClient.Default
    ]
  }) { }
