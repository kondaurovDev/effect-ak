import * as Effect from "effect/Effect";

import { CommonQueueMessageAttributes, QueueMessage } from "../schema/message-attributes.js";
import { SdkSendMessage } from "../brands.js";

export class SqsQueueMessageFactoryService
  extends Effect.Service<SqsQueueMessageFactoryService>()("SqsQueueMessageFactoryService", {
    effect:
      Effect.gen(function* () {

        const makeSdkMessage = (
          message: QueueMessage
        ) => {
          switch (message.queueType) {
            case "fifo":
              return SdkSendMessage({
                MessageDeduplicationId: message.deduplicationId,
                MessageGroupId: message.groupId,
                ...commonMessageAttributesToSdkAttributes(message)
              })
            default:
              return SdkSendMessage(
                commonMessageAttributesToSdkAttributes(message)
              )
          }
        }
        
        const commonMessageAttributesToSdkAttributes = (
          message: CommonQueueMessageAttributes
        ) =>
          SdkSendMessage({
            MessageBody: message.body,
            MessageAttributes: message.attributes,
          })

        return {
          makeSdkMessage
        } as const;

      }) 
    
    }) {}