import { Effect, pipe } from "effect";
import * as Sdk from "@aws-sdk/client-apigatewayv2";

import { ApiId } from "../main/types.js";
import type { ApiGatewayCommandExecutor } from "../main.js";
import { HttpRoute } from "./types.js";

export type RouteUpsertNsDeps = {
  executeMethod: ApiGatewayCommandExecutor
}

export const makeRouteUpsertNs =
  ({ executeMethod }: RouteUpsertNsDeps) => {

    const upsertHttpRoute = (
      apiId: ApiId,
      route: HttpRoute,
      activeRoutes: Sdk.Route[],
      activeIntegrations: Sdk.Integration[],
      activeAuthorizers: Sdk.Authorizer[],
    ) =>
      Effect.gen(function* () {

        const routeAuthorizer =
          activeAuthorizers.find(authorizer =>
            authorizer.Name == route.authorizerName
          );

        const routeIntegration =
          yield* pipe(
            Effect.succeed(
              activeIntegrations.find(integration =>
                integration.Description == route.integrationName
              )
            ),
            Effect.filterOrFail(_ => _ != null, () => `Integration for route '${route}' not found`)
          );

        const updateRouteWithId =
          activeRoutes.find(_ => _.Target == `integrations/${routeIntegration.IntegrationId}`)?.RouteId

        const result =
          updateRouteWithId != null ?
            executeMethod(
              "updating route", _ =>
              _.send(
                new Sdk.UpdateRouteCommand({
                  RouteId: updateRouteWithId,
                  ApiId: apiId,
                  RouteKey: route.path,
                  ...(routeAuthorizer?.AuthorizerId ? {
                    AuthorizationType: "CUSTOM",
                    AuthorizerId: routeAuthorizer.AuthorizerId
                  } : undefined)
                })
              )
            ) :
            executeMethod(
              "creating route", _ =>
              _.send(
                new Sdk.CreateRouteCommand({
                  ApiId: apiId,
                  RouteKey: route.path,
                  Target: `integrations/${routeIntegration.IntegrationId}`,
                  ...(routeAuthorizer?.AuthorizerId ? {
                    AuthorizationType: "CUSTOM",
                    AuthorizerId: routeAuthorizer.AuthorizerId
                  } : undefined)
                })
              )
            )

      })

    return {
      upsertHttpRoute
    } as const;

  }
