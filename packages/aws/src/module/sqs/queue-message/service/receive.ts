import * as Effect from "effect/Effect";
import * as S from "effect/Schema";

import { SqsClientService } from "#/clients/sqs.js"
import { SqsQueueFactoryService } from "#/module/sqs/queue/service/factory.js";
import { ValidQueueMessage } from "../schema/common.js";

export class SqsQueueMessageReceiveService
  extends Effect.Service<SqsQueueMessageReceiveService>()("SqsQueueMessageReceiveService", {
    effect:
      Effect.gen(function* () {

        const client = yield* SqsClientService;
        const queue_factory = yield* SqsQueueFactoryService

        const receiveMessages =
          (queueName: string) =>
            Effect.gen(function* () {

              const queueUrl =
                queue_factory.makeQueueUrl(queueName);

              const messages =
                yield* client.execute(
                  "receiveMessage",
                  {
                    QueueUrl: queueUrl,
                    MaxNumberOfMessages: 10
                  }
                ).pipe(
                  Effect.andThen(_ => _.Messages ?? [])
                );

              const validatedMessages =
                yield* Effect.reduce(
                  messages,
                  [] as ValidQueueMessage[],
                  (accum, curr) =>
                    Effect.match(
                      S.validate(ValidQueueMessage)(curr),
                      {
                        onFailure: () => accum,
                        onSuccess: valid => { accum.push(valid); return accum }
                      }
                    )
                );

              if (validatedMessages.length != messages.length) {
                yield* Effect.logWarning("Some messages were ignored")
              }

              return validatedMessages

            });

        return {
          receiveMessages
        } as const;

      }),
      dependencies: [
        SqsClientService.Default,
        SqsQueueFactoryService.Default
      ]
  }) { }
