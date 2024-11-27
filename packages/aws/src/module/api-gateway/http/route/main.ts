import * as Context from "effect/Context";

import type { ContextConfigProvider } from "../../../provider/context-config.js";
import { makeRouteUpsertNs } from "./route.js"
import { makeRouteSearchNs } from "./search.js";
import type { ApiGatewayCommandExecutor } from "../main.js";

export type RouteNsDeps = {
  executeMethod: ApiGatewayCommandExecutor,
  contextConfig: Context.Tag.Service<ContextConfigProvider>
}

export const makeRouteNs =
  (input: RouteNsDeps) => {

    const upsert = makeRouteUpsertNs(input);
    const search = makeRouteSearchNs(input);

    return {
      upsert, search
    } as const;

  }
