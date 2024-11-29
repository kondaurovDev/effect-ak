import * as Effect from "effect/Effect";

import { SqsQueueFactoryService } from "../../queue/index.js"
import { ReceiptHandle } from "../brands.js";
import { SqsClientService } from "#clients/sqs.js";

export class SqsQueueMessageDeleteService
  extends Effect.Service<SqsQueueMessageDeleteService>()("SqsQueueMessageDeleteService", {
    effect:
      Effect.gen(function* () {

        const client = yield* SqsClientService;
        const queue_factory = yield* SqsQueueFactoryService

        const deleteBatch =
          (queueName: string, ...ids: ReceiptHandle[]) => {

            const queueUrl =
              queue_factory.makeQueueUrl(queueName);

            const response =
              client.execute(
                "deleteMessageBatch",
                {
                  QueueUrl: queueUrl,
                  Entries:
                    ids.map((ReceiptHandle, id) => ({
                      ReceiptHandle, Id: `${ReceiptHandle}_${id}`
                    }))
                }
              );

              return response;

          };

        return {
          deleteBatch
        } as const;

      }),

    dependencies: [
      SqsClientService.Default,
      SqsQueueFactoryService.Default
    ]
  }) { }
