import { Effect } from "effect";

import { LambdaClientService } from "#/clients/lambda.js";
import { LambdaEventSourceViewService } from "./view.js";
import * as S from "../schema/_export.js";

export class LambdaEventSourceSqsService
  extends Effect.Service<LambdaEventSourceSqsService>()("LambdaEventSourceSqsService", {
    effect:
      Effect.gen(function* () {

        const $ = {
          lambda: yield* LambdaClientService,
          view: yield* LambdaEventSourceViewService
        }

        const upsert = 
          (input: S.LambdaEventSourceUpsertQueueCommand) =>
          Effect.gen(function* () {
      
            const current =
              yield* $.view.getIdByFunctionName(input);
      
            const commonAttributes = {
              Enabled: eventSource.active,
              EventSourceArn: queueArn,
              BatchSize: eventSource.batchSize,
              ScalingConfig: {
                MaximumConcurrency: eventSource.maximumConcurrency
              },
              ...(eventSource.enablePartialResponse ? {
                FunctionResponseTypes: [
                  "ReportBatchItemFailures"
                ]
              } : undefined),
              ...(eventSource.queueType == "standard" ? {
                MaximumBatchingWindowInSeconds: eventSource.batchWindow
              } : undefined)
            } as T.SdkCommonEventSourceMappingAttributes;
      
            yield* Effect.logDebug("esm common attributes", commonAttributes);

            if (current == null) {
              yield* $.lambda.execute(
                "createEventSourceMapping",
                {
                  FunctionName: functionName,
                  ...commonAttributes
                }
              )
            } else if (current.UUID != null) {
              yield* lambda.execute(
                "updateEventSourceMapping",
                {
                  ...commonAttributes,
                  UUID: current.UUID
                }
              )
            } else {
              yield* Effect.logWarning("No event source match");
            }
      
          });
      
        return {
          upsert
        } as const;

      }),

      dependencies: [
        LambdaClientService.Default,
        LambdaEventSourceViewService.Default
      ]
  }) { }
