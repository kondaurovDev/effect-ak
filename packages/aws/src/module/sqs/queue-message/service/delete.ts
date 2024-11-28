import * as Effect from "effect/Effect";

import { SqsClientService } from "../../client.js"
import { SqsQueueFactoryService } from "../../queue/index.js"
import { ReceiptHandle } from "../types/common.js";

export class SqsQueueMessageDeleteService
  extends Effect.Service<SqsQueueMessageDeleteService>()("SqsQueueMessageDeleteService", {
    effect:
      Effect.gen(function* () {

        const $ = {
          client: yield* SqsClientService,
          factory: yield* SqsQueueFactoryService
        };

        const deleteBatch =
          (queueName: string, ...ids: ReceiptHandle[]) => {

            const queueUrl =
              $.factory.makeQueueUrl(queueName);

            const response =
              $.client.execute(
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
