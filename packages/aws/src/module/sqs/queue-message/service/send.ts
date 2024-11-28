import * as Effect from "effect/Effect";
import * as Array from "effect/Array";

import { SqsClientService } from "../../client.js"
import { SqsQueueFactoryService } from "../../queue/service/factory.js";

type Message = {
  body: string,
  groupId?: string,
  deduplicationId?: string
}

export class SqsQueueMessageSendService
  extends Effect.Service<SqsQueueMessageSendService>()("SqsQueueMessageSendService", {
    effect:
      Effect.gen(function* () {

        const $ = {
          client: yield* SqsClientService,
          factory: yield* SqsQueueFactoryService
        };

        const sendMessage =
          (queueName: string, message: Message) => {
            const queueUrl =
              $.factory.makeQueueUrl(queueName);

            const response =
              $.client.execute(
                "sendMessage",
                {
                  QueueUrl: queueUrl,
                  MessageBody: message.body,
                  ...(message.groupId ? {
                    MessageGroupId: message.groupId
                  } : undefined),
                  ...(message.deduplicationId ? {
                    MessageDeduplicationId: message.deduplicationId
                  } : undefined)
                }
              );

            return response;
          };

        const sendManyMessages =
          (queueName: string, ...messages: Message[]) => {

            const queueUrl =
              $.factory.makeQueueUrl(queueName);

            const forResult =
              Effect.forEach(
                Array.split(10)(messages),
                chunk =>
                  $.client.execute(
                    "sendMessageBatch",
                    {
                      QueueUrl: queueUrl,
                      Entries:
                        chunk.map(message => ({
                          Id: message.deduplicationId,
                          MessageBody: message.body,
                          ...(message.groupId ? {
                            MessageGroupId: message.groupId
                          } : undefined),
                          ...(message.deduplicationId ? {
                            MessageDeduplicationId: message.deduplicationId
                          } : undefined)
                        }))
                    }
                  )
              );

            return forResult;

          };


        return {
          sendMessage, sendManyMessages
        }

      }),

    dependencies: [
      SqsClientService.Default,
      SqsQueueFactoryService.Default
    ]
  }) { }
