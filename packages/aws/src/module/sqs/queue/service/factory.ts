import * as Effect from "effect/Effect";

import { QueueAttributes, QueueType, SdkQueueAttributes } from "../types/queue-attributes.js";
import { makeQueueUrlFrom, QueueMetadata, QueueName } from "../types/common.js";
import { AwsRegionConfig } from "../../../../internal/configuration.js";
import { StsService } from "../../../sts/service.js";

// https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SetQueueAttributes.html#API_SetQueueAttributes_RequestParameters

export class SqsQueueFactoryService
  extends Effect.Service<SqsQueueFactoryService>()("SqsQueueFactoryService", {
    effect:
      Effect.gen(function* () {

        const region = yield* AwsRegionConfig;
        const { accountId } = yield* StsService;

        const makeQueueArn =
          (queueName: QueueName): typeof QueueMetadata.fields.arn.Type =>
            `arn:aws:sqs:${region}:${accountId}:${queueName}`;

        const makeQueueUrl =
          (queueName: QueueName): typeof QueueMetadata.fields.url.Type =>
            makeQueueUrlFrom({
              region, accountId, queueName
            });

        const makeQueue =
          ({ queueName, queueType }: QueueInput) => {
            const name =
              queueType === "fifo" ?
                `${queueName}.fifo` :
                `${queueName}`;

            return QueueMetadata.make({
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

            return QueueMetadata.make({
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
          makeSdkQueueAttributes, makeQueue, makeDeadLetterQueue, makeQueueUrl, makeQueueArn
        }

      }),

    dependencies: [
      StsService.Default
    ]
  }) { }

type QueueInput = {
  queueName: QueueName,
  queueType: QueueType
}
