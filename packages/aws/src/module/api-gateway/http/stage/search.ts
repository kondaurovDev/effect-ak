import * as Effect from "effect/Effect";

import { GetStageCommand, GetStageCommandInput, NotFoundException } from "@aws-sdk/client-apigatewayv2"
import { ApiId } from "../main/types.js";
import type { ApiGatewayCommandExecutor } from "../main.js"
import type { StageName } from "./types.js";

export type StageSearchNsDeps = {
  executeMethod: ApiGatewayCommandExecutor,
}

export type StageSearchNs =
  ReturnType<typeof makeStageSearchNs>

export const makeStageSearchNs =
  ({ executeMethod }: StageSearchNsDeps) => {

    const getStage = (
      command: GetStageCommandInput
    ) =>
      executeMethod(
        `getting stage by name '${command.StageName}'`, _ =>
        _.send(new GetStageCommand(command))
      ).pipe(
        Effect.catchTag("AwsServiceError", error =>
          error.cause instanceof NotFoundException ?
            Effect.succeed(undefined) :
            Effect.fail(error)
        )
      );

    const getStageByName = (
      apiId: ApiId,
      stageName: StageName
    ) =>
      getStage({
        ApiId: apiId,
        StageName: stageName
      })

    return {
      getStage, getStageByName
    } as const;

  }
