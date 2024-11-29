import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import * as Array from "effect/Array";
import * as Option from "effect/Option";

import { recoverFromSqsException, SqsClientService } from "../../client.js";
import { QueueName } from "../schema/common.js";
import { SdkQueueAttributeName, SdkQueueAttributes } from "../schema/queue-attributes.js";
import * as C from "../../const.js";

// https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html#events-sqs-eventsource

export class SqsQueueViewService
  extends Effect.Service<SqsQueueViewService>()("SqsQueueViewService", {
    effect:
      Effect.gen(function* () {

        const sqs = yield* SqsClientService;

        const getQueuesList =
          (input: {
            prefix: string
          }) =>
            pipe(
              sqs.execute(
                "listQueues",
                {
                  QueueNamePrefix: input.prefix
                }
              ),
              Effect.map(_ => _.QueueUrls == null ? Array.empty() : _.QueueUrls),
              Effect.andThen(
                Array.filterMap(
                  url => Option.fromNullable(url.split("/").at(-1))
                )
              )
            );

        const getQueueUrl =
          (input: {
            queueName: QueueName
          }) =>
            Effect.gen(function* () {

              const response =
                yield* sqs.execute(
                  "getQueueUrl",
                  {
                    QueueName: input.queueName
                  }
                );

              if (!response.QueueUrl) {
                yield* Effect.die("The queue exists but 'QueueUrl' is undefined")
              }

              return response.QueueUrl;

            }).pipe(
              recoverFromSqsException("QueueDoesNotExist", undefined)
            );

        const getQueueAttributes =
          (input: {
            queueName: QueueName,
            attributeNames: SdkQueueAttributeName[]
          }) =>
            Effect.gen(function* () {

              const url = 
                input.queueName.startsWith(C.sqs_queue_url_beginning) ? input.queueName : yield* getQueueUrl(input);

              if (!url) return undefined;

              const response =
                yield* sqs.execute(
                  "getQueueAttributes", 
                  {
                    QueueUrl: url,
                    AttributeNames: input.attributeNames
                  }
                );

              if (!response.Attributes) {
                return yield* Effect.die("The queue exists but 'Attributes' is undefined")
              }

              return new SdkQueueAttributes(response.Attributes)

            });

        return {
          getQueuesList, getQueueUrl, getQueueAttributes
        } as const;

      }),

    dependencies: [
      SqsClientService.Default
    ]
  }) { }
