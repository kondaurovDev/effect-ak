import * as S from "effect/Schema";

import * as MA from "./sdk-attributes.js";
import * as QA from "../../queue/schema/sdk-attributes.js";

export class CommonQueueMessageAttributes extends
  S.Class<CommonQueueMessageAttributes>("CommonQueueMessageAttributes")({
    attributes: MA.MessageAttibutes,
    body: MA.MessageBody
  }) { }

export class MessageToFifoQueue extends
  CommonQueueMessageAttributes.extend<MessageToFifoQueue>("MessageToFifoQueue")({
    queueType: S.Literal("fifo"),
    deduplicationId: MA.MessageDeduplicationId,
    groupId: MA.MessageGroupId,
  }) { }

export class MessageToStandardQueue extends
  CommonQueueMessageAttributes.extend<MessageToStandardQueue>("MessageToStandardQueue")({
    queueType: S.Literal("standard"),
    deliveryDelay: QA.DeliveryDelay.pipe(S.optional)
  }) { }

export type QueueMessage = typeof QueueMessage.Type
export const QueueMessage =
  S.Union(
    MessageToFifoQueue,
    MessageToStandardQueue
  ).annotations({
    identifier: "QueueMessage"
  })