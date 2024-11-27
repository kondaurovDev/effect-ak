import * as Context from "effect/Context";

import type { ApiGatewayCommandExecutor } from "../main.js";
import type { ContextConfigProvider } from "../../../provider/context-config.js";
import { BootstrapConfigProvider } from "../../../provider/bootstrap-config.js";
import { makeStageUpsertNs } from "./upsert.js"
import { makeStageSearchNs } from "./search.js";

export type ApiNsDeps = {
  executeMethod: ApiGatewayCommandExecutor,
  contextConfig: Context.Tag.Service<ContextConfigProvider>
  bootstrap: Context.Tag.Service<typeof BootstrapConfigProvider>
}

export const makeStageNs =
  (input: ApiNsDeps) => {

    const search = makeStageSearchNs(input);
    const upsert = makeStageUpsertNs({
      ...input, search
    });

    return {
      upsert, search
    } as const;

  }
