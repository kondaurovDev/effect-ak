import { Context, Effect, Match, pipe } from "effect";
import { CreateStageCommand, UpdateStageCommand } from "@aws-sdk/client-apigatewayv2";

import type { BootstrapConfigProvider } from "../../../provider/bootstrap-config.js";
import type { ApiGatewayCommandExecutor } from "../main.js";
import type { StageSearchNs } from "./search.js";
import type { ApiId } from "../main/types.js";
import type { HttpApiStage } from "./types.js";
import { StageName } from "./types.js";

export type StageUpsertNsDeps = {
  executeMethod: ApiGatewayCommandExecutor,
  search: StageSearchNs,
  bootstrap: Context.Tag.Service<typeof BootstrapConfigProvider>
}

export const makeStageUpsertNs =
  ({ executeMethod, search, bootstrap }: StageUpsertNsDeps) => {

    const upsertDefaultStage = (
      apiId: ApiId,
      stage: HttpApiStage
    ) =>
      pipe(
        Effect.Do,
        Effect.bind("defaultStage", () =>
          search.getStageByName(apiId, StageName("$default"))
        ),
        Effect.tap(() =>
          Effect.logInfo("Creating or updating default stage")
        ),
        Effect.bind("result", ({ defaultStage }) =>
          pipe(
            Match.value(defaultStage),
            Match.when(Match.undefined, () =>
              executeMethod(
                `create default stage for '${apiId}'`, _ =>
                _.send(
                  new CreateStageCommand({
                    StageName: "$default",
                    AutoDeploy: stage.autoDeploy,
                    ApiId: apiId,
                    StageVariables: stage.variables,
                    Tags: {
                      ...bootstrap.defaultResourceTags
                    }
                  })
                )
              )
            ),
            Match.when(Match.defined, () =>
              executeMethod(
                "updating default stage", _ =>
                _.send(
                  new UpdateStageCommand({
                    StageName: "$default",
                    AutoDeploy: stage.autoDeploy,
                    StageVariables: stage.variables,
                    ApiId: apiId
                  })
                )
              )
            ),
            Match.exhaustive
          )
        )
      )

    return {
      upsertDefaultStage
    } as const;

  }
