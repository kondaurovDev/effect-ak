import * as S from "effect/Schema";
import { pipe } from "effect/Function"

import { QueueMetadata } from "./common.js";

export class CommonQueueAttributes
  extends S.Class<CommonQueueAttributes>("CommonQueueAttributes")({
    queueName: QueueMetadata.fields.name,
    queueType: S.Literal("standard", "fifo"),
    visibilityTimeout: S.suspend(() => VisibilyTimeout).pipe(S.optional),
    deliveryDelay: S.suspend(() => DeliveryDelay).pipe(S.optional),
    maximumMessageSize: S.suspend(() => MaximumMessageSize).pipe(S.optional),
    retentionPeriod: S.suspend(() => MessageRetentionPeriodInDays).pipe(S.optional),
    receiveMessageWaitTime: S.suspend(() => ReceiveMessageWaitTime).pipe(S.optional),
    redriveAllowPolicy: S.suspend(() => RedriveAllowPolicy).pipe(S.optional),
    redriveConfig: S.suspend(() => RedriveConfig).pipe(S.optional)
  }) {}

// https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html
export const VisibilyTimeout =
  pipe(
    S.Number,
    S.greaterThanOrEqualTo(0),
    S.lessThanOrEqualTo(3600 * 12)
  ).annotations({
    title: "VisibilityTimeout",
    description: "The range is from 0 seconds to 12 hours. The default value is 30 seconds."
  })

export const DeliveryDelay =
  pipe(
    S.Number,
    S.greaterThanOrEqualTo(0),
    S.lessThanOrEqualTo(60 * 15),
  ).annotations({
    title: "DeliveryDelay",
    description: "The range is from 0 seconds to 15 minutes"
  })

export const MaximumMessageSize =
  pipe(
    S.Number,
    S.greaterThanOrEqualTo(0),
    S.lessThanOrEqualTo(256)
  ).annotations({
    title: "MaximumMessageSize",
    description: "The range is from 1 KB to 256 KB. The default value is 64 KB."
  })

// https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html
export const ReceiveMessageWaitTime =
  pipe(
    S.Number,
    S.greaterThanOrEqualTo(0),
    S.lessThanOrEqualTo(20)
  ).annotations({
    title: "ReceiveMessageWaitTime",
    description: "The default value is 0 seconds, which sets short polling. Any non-zero value sets long polling."
  })

// https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html
export const MessageRetentionPeriodInDays =
  pipe(
    S.Number,
    S.greaterThanOrEqualTo(0),
    S.lessThanOrEqualTo(14),
  ).annotations({
    title: "RetentionPeriod"
  })

export const DeduplicationScope =
  pipe(
    S.Literal("queue", "messageGroup"),
  ).annotations({
    title: "DeduplicationScope"
  });

export const FifoThoughputLimit =
  pipe(
    S.Literal("perQueue", "perMessageGroupId")
  ).annotations({
    title: "FifoThoughputLimit"
  });

export const RedriveAllowPolicy =
  S.Union(
    S.Struct({
      redrivePermission: S.Literal("allowAll", "denyAll")
    }),
    S.Struct({
      redrivePermission: S.Literal("byQueue"),
      sourceQueueArns: S.NonEmptyArray(S.NonEmptyString)
    })
  ).annotations({
    title: "RedrivePolicy",
    description: "Identify which source queues can use this queue as the dead-letter queue."
  });

const dlTarget =
  pipe(
    QueueMetadata.fields.arn
  ).annotations({
    jsonSchema: { string: "deadLetter" }
  })

export const RedriveConfig =
  S.Struct({
    deadLetterTargetArn: dlTarget,
    maxReceiveCount: S.Positive
  }).annotations({
    title: "RedriveConfig"
  });
