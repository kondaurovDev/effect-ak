import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { ResourceGroupsTagSearchService } from "../../../resource-groups/index.js";
import { Apigatewayv2ClientService, recoverFromApigatewayv2Exception } from "../../client.js";
import { ApiGatewayHttpFactoryService } from "./factory.js";
import { ApiGatewayArn } from "../_schema/common.js";

export class ApiGatewayHttpViewService
  extends Effect.Service<ApiGatewayHttpViewService>()("ApiGatewayHttpViewService", {
    effect:
      Effect.gen(function* () {

        const $ = {
          client: yield* Apigatewayv2ClientService,
          tags: yield* ResourceGroupsTagSearchService,
          factory: yield* ApiGatewayHttpFactoryService
        }

        const getProjectApiGateway =
          Effect.gen(function* () {

            const response =
              yield* $.tags.getOneResourceArnByTags({
                resourceType: "apigateway",
                tags: $.factory.makeResourceTags()
              });

            if (!response) return undefined;

            const validated = yield* Schema.validate(ApiGatewayArn)(response).pipe(Effect.orDie);

            return {
              arn: validated,
              apiId: validated.split("/").at(-1)
            };
            
          });

        const get =
          (input: {
            apiId: string
          }) =>
            $.client.execute(
              "getApi", {
                ApiId: input.apiId
              }
            ).pipe(
              recoverFromApigatewayv2Exception("NotFoundException", undefined),
            );

        return {
          $, getProjectApiGateway, get
        } as const;

      }),
    dependencies: [
      Apigatewayv2ClientService.Default,
      ResourceGroupsTagSearchService.Default,
      ApiGatewayHttpFactoryService.Default
    ]
  }) { }
