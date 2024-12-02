import * as Effect from "effect/Effect";

import { LambdaClientService } from "#/clients/lambda.js";
import { LambdaEventSourceViewService } from "./view.js";

export class LambdaEventSourceSqsService
  extends Effect.Service<LambdaEventSourceSqsService>()("LambdaEventSourceSqsService", {
    effect:
      Effect.gen(function* () {

        const lambda = yield* LambdaClientService;
        const view = yield* LambdaEventSourceViewService;

        const upsert = (
          functionName: FnT.FunctionArn | FnT.FunctionName,
          queueArn: QueueT.QueueArn,
          eventSource: T.StandardQueueEventSource | T.FifoQueueEventSource
        ) =>
          Effect.gen(function* () {
      
            const current =
              yield* view.getByEventSourceArn(functionName, queueArn);
      
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
              yield* lambda.execute(
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
