import * as Effect from "effect/Effect";
import * as S from "effect/Schema";

import { SqsClientService } from "../../client.js"
import { QueueName, SqsQueueContextService } from "../../queue/index.js"
import { ValidQueueMessage } from "../types/message.js";

export class SqsQueueMessageReceiveService
  extends Effect.Service<SqsQueueMessageReceiveService>()("SqsQueueMessageReceiveService", {
    effect:
      Effect.gen(function* () {

        const sqs = yield* SqsClientService;
        const context = yield* SqsQueueContextService;

        const receiveMessages =
          (queueName: string) =>
            Effect.gen(function* () {

              const name = yield* S.validate(QueueName)(queueName);

              const queueUrl = context.getQueueUrlByName(name);

              const messages =
                yield* sqs.execute(
                  "receive batch of messages", _ =>
                  _.receiveMessage({
                    QueueUrl: queueUrl,
                    MaxNumberOfMessages: 10
                  })
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
        SqsQueueContextService.Default
      ]
  }) { }

