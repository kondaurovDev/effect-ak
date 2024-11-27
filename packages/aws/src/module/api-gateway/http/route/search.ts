import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import { GetRoutesCommand } from "@aws-sdk/client-apigatewayv2";

import type { ApiId } from "../main/types.js";
import type { ApiGatewayCommandExecutor } from "../main.js";

export type RouteSearchNsDeps = {
  executeMethod: ApiGatewayCommandExecutor
}

export const makeRouteSearchNs = 
  ({ executeMethod }: RouteSearchNsDeps) => {

    const getRoutes = (
      apiId: ApiId,
    ) =>
      pipe(
        executeMethod(
          "get apis routes", _ =>
          _.send(
            new GetRoutesCommand({
              ApiId: apiId,
              MaxResults: "100",
            })
          )
        ),
        Effect.andThen(_ => _.Items ?? []),
        Effect.tap(items =>
          Effect.logDebug("routes", items)
        )
      )

    return {
      getRoutes
    } as const;

  }
