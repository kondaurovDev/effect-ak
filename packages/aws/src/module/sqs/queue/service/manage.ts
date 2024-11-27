import * as Effect from "effect/Effect"

import { SqsClientService } from "../../client.js"
import { SqsQueueViewService } from "./view.js"
import { OneOfQueue } from "../types/queue.js"
import { AwsProjectIdConfig } from "../../../../internal/configuration.js";
import { SqsQueueAttributesService } from "./attributes.js";

export class SqsQueueManageService
  extends Effect.Service<SqsQueueManageService>()("SqsQueueManageService", {
    effect:
      Effect.gen(function* () {

        const $ = {
          client: yield* SqsClientService,
          view: yield* SqsQueueViewService,
          attributes: yield* SqsQueueAttributesService,
          awsConfig: yield* AwsProjectIdConfig,
        }

        const upsertQueue =
          (input: OneOfQueue) =>
            Effect.gen(function* () {

              const queueUrl = yield* $.view.getQueueUrl(input.queue);

              const attributes = $.attributes.makeQueueSdkAttributes(input.queue);
 
              if (queueUrl) {
                yield* $.client.execute(
                  "setQueueAttributes",
                  {
                    QueueUrl: queueUrl,
                    Attributes: attributes
                  }
                )
                return true;
              }

              yield* $.client.execute(
                "createQueue",
                {
                  QueueName: input.queue.queueName,
                  Attributes: attributes,
                  tags: $.awsConfig.resourceTagsMap
                }
              );

            });

        const upsertQueueAndDeadLetterQueue =
          (input: OneOfQueue) =>
            Effect.gen(function* () {

              const dl_queue = $.attributes.makeDeadLetterQueue(input.queue);
              const queue = $.attributes.makeQueue(input.queue);

              // dead letter queue
              yield* upsertQueue({
                queue: {
                  ...input.queue,
                  queueName: dl_queue.name,
                  redriveAllowPolicy: { redrivePermission: "byQueue", sourceQueueArns: [ queue.arn ] },
                }
              });

              yield* upsertQueue({
                queue: {
                  ...input.queue,
                  queueName: queue.name,
                  redriveAllowPolicy: { redrivePermission: "denyAll" },
                  redriveConfig: { maxReceiveCount: 1, deadLetterTargetArn: dl_queue.arn }
                }
              });

            })

        return {
          $, upsertQueue, upsertQueueAndDeadLetterQueue
        } as const

      }),
    dependencies: [
      SqsClientService.Default,
      SqsQueueViewService.Default,
      SqsQueueAttributesService.Default
    ]
  }) { }