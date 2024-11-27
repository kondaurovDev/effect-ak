import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { DeleteMessageBatchCommand } from "@aws-sdk/client-sqs";

import { SqsClientService } from "../../client.js"
import { QueueName, SqsQueueContextService } from "../../queue/index.js"
import { ReceiptHandle } from "../types/message.js";

export class SqsQueueMessageDeleteService
  extends Effect.Service<SqsQueueMessageDeleteService>()("SqsQueueMessageDeleteService", {
    effect:
      Effect.gen(function* () {

        const sqs = yield* SqsClientService;
        const context = yield* SqsQueueContextService;

        const deleteBatch = (
          queueName: string,
          ids: ReceiptHandle[]
        ) =>
          Effect.gen(function* () {

            const name = yield* S.validate(QueueName)(queueName);

            const queueUrl = context.getQueueUrlByName(name);

            const response =
              yield* sqs.execute(
                "delete batch of messages", _ =>
                _.deleteMessageBatch({
                  QueueUrl: queueUrl,
                  Entries:
                    ids.map((ReceiptHandle, id) => ({
                      ReceiptHandle, Id: `${ReceiptHandle}_${id}`
                    }))
                })
              );

          })

        return {
          deleteBatch
        } as const;

      }),

      dependencies: [
        SqsClientService.Default,
        SqsQueueContextService.Default
      ]
  }) { }
