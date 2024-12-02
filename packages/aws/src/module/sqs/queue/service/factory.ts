import { Effect } from "effect";

import { CoreConfigurationProviderService } from "#/core/index.js";
import { QueueAttributes, QueueType, SdkQueueAttributes } from "../schema/queue-attributes.js";
import * as S from "../schema/common.js";

// https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SetQueueAttributes.html#API_SetQueueAttributes_RequestParameters

export class SqsQueueFactoryService
  extends Effect.Service<SqsQueueFactoryService>()("SqsQueueFactoryService", {
    effect:
      Effect.gen(function* () {

        const { getAccountId, region } = yield* CoreConfigurationProviderService;

        const accountId = yield* getAccountId;

        const makeQueueArn =
        (queueName: S.QueueName): S.QueueArn =>
          `arn:aws:sqs:${region}:${accountId}:${queueName}`;

        const makeQueueUrl =
          (queueName: S.QueueName): S.QueueUrl =>
            S.makeQueueUrlFrom({
              region, accountId, queueName
            });

        const makeQueue =
          ({ queueName, queueType }: QueueInput) => {
            const name =
              queueType === "fifo" ?
                `${queueName}.fifo` :
                `${queueName}`;

            return S.QueueMetadata.make({
              name: queueName,
              arn: makeQueueArn(name),
              url: makeQueueUrl(name)
            })
          }

        const makeDeadLetterQueue =
          ({ queueName, queueType }: QueueInput) => {
            const name =
              queueType === "fifo" ?
                `${queueName}-dl.fifo` :
                `${queueName}-dl`;

            return S.QueueMetadata.make({
              name: queueName,
              arn: makeQueueArn(name),
              url: makeQueueUrl(name)
            })
          }

        const makeSdkQueueAttributes =
          (queue: QueueAttributes) => {
            switch (queue.queueType) {
              case "fifo":
                return new SdkQueueAttributes({
                  FifoQueue: "true",
                  ...(
                    queue.throughputLimit ? {
                      FifoThroughputLimit: queue.throughputLimit
                    } : undefined
                  ),
                  ...(
                    queue.deduplication ? {
                      ContentBasedDeduplication: "false",
                      DeduplicationScope: queue.deduplication
                    } : undefined),
                  ...commonToSdkAttributes(queue)
                });
              default:
                return commonToSdkAttributes(queue);
            }
          }

        const commonToSdkAttributes =
          (queue: QueueAttributes) => {
            return new SdkQueueAttributes({
              VisibilityTimeout: queue.visibilityTimeout?.toString() ?? "60",
              DelaySeconds: queue.deliveryDelay?.toString() ?? "0",
              ...(queue.maximumMessageSize ? {
                MaximumMessageSize: (queue.maximumMessageSize * 1024).toString()
              } : undefined),
              ...(queue.retentionPeriod ? {
                MessageRetentionPeriod: (queue.retentionPeriod * 3600 * 24).toString()
              } : undefined),
              ...(queue.receiveMessageWaitTime ? {
                ReceiveMessageWaitTimeSeconds: queue.receiveMessageWaitTime.toString()
              } : undefined),
              ...(queue.redriveAllowPolicy ? {
                RedriveAllowPolicy: (JSON.stringify(queue.redriveAllowPolicy)).toString()
              } : undefined),
              ...(queue.redriveConfig ? {
                RedrivePolicy: JSON.stringify(queue.redriveConfig)
              } : undefined)
            })
          }

        return {
          makeSdkQueueAttributes,
          makeQueue, makeDeadLetterQueue,
          makeQueueUrl, makeQueueArn
        } as const

      })
  }) { }

type QueueInput = {
  queueName: S.QueueName,
  queueType: QueueType
}
