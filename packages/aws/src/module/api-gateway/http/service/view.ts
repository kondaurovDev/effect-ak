import { NotFoundException } from "@aws-sdk/client-apigatewayv2";
import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";

import { ApiGatewayClientService } from "../../client.js";
import { ResourceGroupsTagSearchService } from "../../../resource-groups/index.js";

export class ApiGatewayViewService
  extends Effect.Service<ApiGatewayViewService>()("ApiGatewayViewService", {
    effect:
      Effect.gen(function* () {

        const tagSearch = yield* ResourceGroupsTagSearchService;
        const apiGateway = yield* ApiGatewayClientService;
        const ctx = yield* ApiGatewayContextService;

        const getProjectApiId = 
          (input: {
            gatewayType: ApiGatewayType
          }) =>
          pipe(
            tagSearch.getOneResourceArnByTags({
              resourceType: "apigateway",
              tags: ctx.resourceTags(input)
            }),
            Effect.andThen(arn =>
              arn == null ?
                Effect.succeed(undefined) :
                pipe(
                  Effect.fromNullable(arn.split("/apis/").at(1)),
                  Effect.catchTag(
                    "NoSuchElementException",
                    () => new ServiceError({ description: "Api is found but apiId is not defined" })
                  )
                )
            )
          );

        const getApi =
          (input: {
            apiId: string
          }) =>
            pipe(
              apiGateway.execute(
                `get api`, _ =>
                _.getApi({
                  ApiId: input.apiId
                })
              ),
              Effect.catchTag("AwsServiceError", error =>
                error.cause instanceof NotFoundException ?
                  Effect.succeed(undefined) :
                  Effect.fail(error)
              )
            );

        return {
          getProjectApiId, getApi
        } as const;

      }),
    dependencies: [
      ApiGatewayClientService.Default,
      ResourceGroupsTagSearchService.Default,
      ApiGatewayContextService.Default
    ]
  }) { }
