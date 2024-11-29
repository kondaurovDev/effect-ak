import { pipe } from "effect";
import * as Effect from "effect/Effect";

import { Apigatewayv2ClientService } from "#clients/apigatewayv2.js";

export class ApiGatewayHttpAuthorizerViewService
  extends Effect.Service<ApiGatewayHttpAuthorizerViewService>()("ApiGatewayHttpAuthorizerViewService", {
    effect:
      Effect.gen(function* () {

        const client = yield* Apigatewayv2ClientService;

        const getAll =
          (input: {
            apiId: string
          }) =>
            pipe(
              client.execute(
                "getAuthorizers",
                {
                  ApiId: input.apiId,
                }
              ),
              Effect.andThen(_ => _.Items ?? [])
            );

        const getOne =
          (input: {
            apiId: string,
            name: string
          }) => {
            const name = input.name.toLocaleLowerCase();
            return pipe(
              getAll(input),
              Effect.andThen(_ =>
                _.find(_ => _.Name?.toLowerCase() == name)
              )
            )
          }

        return {
          getAll, getOne
        } as const;

      }),
    dependencies: [
      Apigatewayv2ClientService.Default
    ]
  }) { }
