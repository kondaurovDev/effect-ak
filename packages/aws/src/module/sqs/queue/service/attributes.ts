import * as Effect from "effect/Effect";

import { AllQueueAttributes, OneOfQueue } from "../types/queue.js";
import { QueueMetadata, QueueName } from "../types/common.js";
import { AwsRegionConfig } from "../../../../internal/configuration.js";
import { StsService } from "../../../sts/service.js";

// https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SetQueueAttributes.html#API_SetQueueAttributes_RequestParameters

export class SqsQueueAttributesService
  extends Effect.Service<SqsQueueAttributesService>()("SqsQueueAttributesService", {
    effect:
      Effect.gen(function* () {

        const region = yield* AwsRegionConfig;
        const { accountId } = yield* StsService;

        const makeQueueArn =
          (input: {
            queueName: QueueName
          }): typeof QueueMetadata.fields.arn.Type =>
            `arn:aws:sqs:${region}:${accountId}:${input.queueName}`;

        const makeQueueUrl =
          (input: {
            queueName: QueueName
          }): typeof QueueMetadata.fields.url.Type =>
            `https://sqs.${region}.amazonaws.com/${accountId}/${input.queueName}`;

        const makeQueue =
          (queue: OneOfQueue["queue"]) => {
            const queueName =
              queue.queueType === "fifo" ?
                `${queue.queueName}.fifo` :
                `${queue.queueName}`;

            return QueueMetadata.make({
              name: queueName,
              arn: makeQueueArn({ queueName }),
              url: makeQueueUrl({ queueName })
            })
          }

        const makeDeadLetterQueue =
          (queue: OneOfQueue["queue"]) => {
            const queueName =
              queue.queueType === "fifo" ?
                `${queue.queueName}-dl.fifo` :
                `${queue.queueName}-dl`;

            return QueueMetadata.make({
              name: queueName,
              arn: makeQueueArn({ queueName }),
              url: makeQueueUrl({ queueName })
            })
          }

        const makeQueueSdkAttributes =
          (queue: OneOfQueue["queue"]) => {
            switch (queue.queueType) {
              case "fifo":
                return new AllQueueAttributes({
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
          (queue: OneOfQueue["queue"]) => {
            return new AllQueueAttributes({
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
          makeQueueSdkAttributes, makeQueue, makeDeadLetterQueue
        }

      }),

    dependencies: [
      StsService.Default
    ]
  }) { }