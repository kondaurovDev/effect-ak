import { pipe } from "effect/Function";
import * as Match from "effect/Match";
import * as Effect from "effect/Effect";

import { ApiGatewayClientService } from "../../client.js";
import { ApiGatewayViewService } from "./view.js";

export class ApiGatewayHttpManageService
  extends Effect.Service<ApiGatewayHttpManageService>()("ApiGatewayHttpManageService", {
    effect:
      Effect.gen(function* () {

        const gw = yield* ApiGatewayClientService;
        const view = yield* ApiGatewayViewService;

        const upsertDefault = 
          Effect.gen(function* () {

            const name = `${ctx.ctx.projectId}-default`;

            const defaultApiId =
              yield* view.getProjectApiId({
                gatewayType: "https"
              });

            if (defaultApiId == null) {
              const create = 
                yield* gw.execute(
                  "creating http api", _ =>
                  _.createApi({
                    Name: name,
                    ProtocolType: "HTTP",
                    Tags: 
                      ctx.resourceTags({
                        gatewayType: "https"
                      }),
                    CorsConfiguration: {
                      AllowOrigins: [
                        "*"
                      ]
                    }
                  })
                )
                
            }
            
            const update =
              gw.execute(
                "updating http api", _ =>
                _.updateApi({
                  ApiId: apiId,
                  Name: gateway.name,
                  Description: description,
                  CorsConfiguration: {
                    AllowOrigins: [
                      "*"
                    ]
                  }
                })
              );
  
            return pipe(
              Match.value(apiId),
              Match.when(Match.undefined, () => create),
              Match.when(Match.defined, () => update),
              Match.exhaustive,
              Effect.andThen(result => result.ApiId),
              Effect.filterOrFail(_ => _ != null),
              Effect.andThen(ApiId)
            );


          })



        };
    
        return {
          upsertHttpApi
        } as const;

      }),
      dependencies: [
        ApiGatewayClientService.Default,
      ]
  }) {}
