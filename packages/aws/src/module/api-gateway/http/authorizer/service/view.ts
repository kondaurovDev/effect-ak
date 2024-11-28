import { pipe } from "effect";
import * as Effect from "effect/Effect";

import { Apigatewayv2ClientService } from "../../../client.js";

export class ApiGatewayHttpAuthorizerViewService
  extends Effect.Service<ApiGatewayHttpAuthorizerViewService>()("ApiGatewayHttpAuthorizerViewService", {
    effect:
      Effect.gen(function* () {

        const client = yield* Apigatewayv2ClientService;

        const getApiAuthorizers =
          (input: {
            apiId: string
          }) =>
            pipe(
              client.execute(
                "getAuthorizers",
                {
                  ApiId: input.apiId
                }
              ),
              Effect.andThen(_ => _.Items ?? [])
            );

        return {
          getApiAuthorizers
        } as const;

      }),
    dependencies: [
      Apigatewayv2ClientService.Default
    ]
  }) { }
