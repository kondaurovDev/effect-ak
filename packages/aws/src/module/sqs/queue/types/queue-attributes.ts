import * as S from "effect/Schema";
import * as Data from "effect/Data";

import * as A from "./sdk-attributes.js";
import { SqsMethodInput } from "../../client.js";
import type { QueueAttributeName } from "@aws-sdk/client-sqs";

export type SdkQueueAttributeName = QueueAttributeName;

export class SdkQueueAttributes 
  extends Data.Class<Exclude<SqsMethodInput<"setQueueAttributes">["Attributes"], undefined>> {}

export class CommonQueueAttributes
  extends S.Class<CommonQueueAttributes>("CommonQueueAttributes")({
    visibilityTimeout: A.VisibilyTimeout.pipe(S.optional),
    deliveryDelay: A.DeliveryDelay.pipe(S.optional),
    maximumMessageSize: A.MaximumMessageSize.pipe(S.optional),
    retentionPeriod: A.MessageRetentionPeriodInDays.pipe(S.optional),
    receiveMessageWaitTime: A.ReceiveMessageWaitTime.pipe(S.optional),
    redriveAllowPolicy: A.RedriveAllowPolicy.pipe(S.optional),
    redriveConfig: A.RedriveConfig.pipe(S.optional)
  }) {}

export class FifoQueueAttributes
  extends CommonQueueAttributes.extend<FifoQueueAttributes>("FifoQueueAttributes")({
    queueType: S.Literal("fifo"),
    throughputLimit: A.FifoThoughputLimit.pipe(S.optional),
    deduplication: A.DeduplicationScope.pipe(S.optional)
  }) { }

export class StandardQueueAttributes
  extends CommonQueueAttributes.extend<StandardQueueAttributes>("StandardQueueAttributes")({
    queueType: S.Literal("standard")
  }) { }

export type QueueType = typeof QueueAttributes.Type.queueType;
export type QueueAttributes = typeof QueueAttributes.Type;

export const QueueAttributes =
  S.Union(FifoQueueAttributes, StandardQueueAttributes).annotations({
    identifier: "SQS/QueueAttributes"
  });
