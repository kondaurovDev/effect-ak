import * as Effect from "effect/Effect";

import { AwsProjectIdConfig } from "../../../../core/service/configuration-provider.js";
import { ApiGatewayHttpViewService } from "./view.js";
import { Apigatewayv2ClientService } from "../../client.js";
import { ApiGatewayHttpFactoryService } from "./factory.js";

export class ApiGatewayHttpManageService
  extends Effect.Service<ApiGatewayHttpManageService>()("ApiGatewayHttpManageService", {
    effect:
      Effect.gen(function* () {

        const $ = {
          client: yield* Apigatewayv2ClientService,
          view: yield* ApiGatewayHttpViewService,
          factory: yield* ApiGatewayHttpFactoryService
        }

        const config = yield* AwsProjectIdConfig;

        const upsertDefault = 
          Effect.gen(function* () {

            const name = `${config.projectId}-default`;

            const defaultApiId =
              yield* $.view.getProjectApiGateway;

            if (defaultApiId?.apiId == null) {
              const create = 
                yield* $.client.execute(
                  "createApi",
                  {
                    Name: name,
                    ProtocolType: "HTTP",
                    Tags: $.factory.makeResourceTagsMap(),
                    CorsConfiguration: {
                      AllowOrigins: [
                        "*"
                      ]
                    }
                  }
                );

              return yield* Effect.logInfo("http api gateway has been created");
            }

          })
    
        return {
          upsertDefault
        } as const;

      }),
      dependencies: [
        Apigatewayv2ClientService.Default,
        ApiGatewayHttpViewService.Default,
        ApiGatewayHttpFactoryService.Default
      ]
  }) {}
