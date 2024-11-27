import * as Effect from "effect/Effect";
import * as Array from "effect/Array";
import * as S from "effect/Schema";
import { SendMessageBatchCommand, SendMessageCommand } from "@aws-sdk/client-sqs";

import { SqsClientService } from "../../client.js"
import { QueueName, SqsQueueContextService } from "../../queue/index.js"

type Message = {
  body: string,
  groupId?: string,
  deduplicationId?: string
}

export class SqsQueueMessageSendService
  extends Effect.Service<SqsQueueMessageSendService>()("SqsQueueMessageSendService", {
    effect:
      Effect.gen(function* () {

        const sqs = yield* SqsClientService;
        const context = yield* SqsQueueContextService;

        const getQueueUrl =
          (queueName: string) =>
            S.validate(QueueName)(queueName).pipe(
              Effect.andThen(context.getQueueUrlByName)
            )

        const sendMessage = (
          queueName: string,
          message: Message
        ) =>
          Effect.gen(function* () {

            const queueUrl = yield* getQueueUrl(queueName);

            yield* Effect.log("sending message", { queueUrl })

            return (
              yield* sqs.execute(
                `send message to SQS queue`, _ =>
                _.send(
                  new SendMessageCommand({
                    QueueUrl: queueUrl,
                    MessageBody: message.body,
                    ...(message.groupId ? {
                      MessageGroupId: message.groupId
                    } : undefined),
                    ...(message.deduplicationId ? {
                      MessageDeduplicationId: message.deduplicationId
                    } : undefined)
                  })
                )
              )
            )
          })

        const sendManyMessages = (
          queueName: string,
          messages: Message[]
        ) =>
          Effect.gen(function* () {

            const queueUrl = yield* getQueueUrl(queueName);

            return (
              yield* Effect.forEach(Array.split(10)(messages), chunk =>
                sqs.execute(
                  "sending many messages to queue", _ =>
                  _.send(
                    new SendMessageBatchCommand({
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
                    })
                  )
                )
              )
            )
          })

        return {
          sendMessage, sendManyMessages
        }

      }),

    dependencies: [
      SqsClientService.Default,
      SqsQueueContextService.Default
    ]
  }) { }
