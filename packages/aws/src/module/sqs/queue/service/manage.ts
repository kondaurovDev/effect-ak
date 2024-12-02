import * as Effect from "effect/Effect"
import * as Equal from "effect/Equal"

import { SqsClientService } from "#/clients/sqs.js"
import { CoreConfigurationProviderService } from "#/core/index.js"
import { SqsQueueViewService } from "./view.js"
import { QueueAttributes } from "../schema/queue-attributes.js"
import { SqsQueueFactoryService } from "./factory.js";
import { QueueName } from "../schema/common.js"

export class SqsQueueManageService
  extends Effect.Service<SqsQueueManageService>()("SqsQueueManageService", {
    effect:
      Effect.gen(function* () {

        const { resourceTagsMap } = yield* CoreConfigurationProviderService;

        const $ = {
          client: yield* SqsClientService,
          view: yield* SqsQueueViewService,
          factory: yield* SqsQueueFactoryService
        }

        const upsertQueue =
          (input: {
            queueName: QueueName,
            attributes: QueueAttributes
          }) =>
            Effect.gen(function* () {

              const queueUrl = yield* $.view.getQueueUrl(input);

              const attributes = $.factory.makeSdkQueueAttributes(input.attributes);

              if (queueUrl) {
                const currentAttributes = yield* $.view.getQueueAttributes({ 
                  queueName: queueUrl, attributeNames: Object.keys(attributes) as any
                });

                if (!currentAttributes)
                  return yield* Effect.die("Current queue's attributes are undefined");

                if (Equal.equals(attributes, currentAttributes)) {
                  yield* Effect.logDebug("Queue's attributes are the same");
                  return true;
                }

                yield* $.client.execute(
                  "setQueueAttributes",
                  {
                    QueueUrl: queueUrl,
                    Attributes: attributes
                  }
                );

                yield* Effect.logDebug("Queue's attributes have been updated");
              }

              yield* $.client.execute(
                "createQueue",
                {
                  QueueName: input.queueName,
                  Attributes: attributes,
                  tags: resourceTagsMap
                }
              );

            });

        const upsertQueueAndDeadLetterQueue =
          (input: {
            queueName: QueueName,
            attributes: QueueAttributes
          }) =>
            Effect.gen(function* () {

              const dl_queue = $.factory.makeDeadLetterQueue({ 
                queueName: input.queueName, queueType: input.attributes.queueType 
              });

              const queue = $.factory.makeQueue({
                queueName: input.queueName, queueType: input.attributes.queueType
              });

              // dead letter queue
              yield* upsertQueue({
                queueName: dl_queue.name,
                attributes: {
                  ...input.attributes,
                  redriveAllowPolicy: { redrivePermission: "byQueue", sourceQueueArns: [ queue.arn ] }
                }
              });

              yield* upsertQueue({
                queueName: queue.name,
                attributes: {
                  ...input.attributes,
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
      SqsQueueFactoryService.Default
    ]
  }) { }