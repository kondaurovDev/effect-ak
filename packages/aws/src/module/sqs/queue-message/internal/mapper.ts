import { CommonQueueMessageAttributes, QueueMessage, SdkSendMessage } from "../types/common.js";

export const getMessageSdkAttributes = (
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

