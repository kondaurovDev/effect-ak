import { ImageMessageContent } from "../schema/message-content.js"

export const makeImageMessage = (
  bytes: Uint8Array
) =>
  ImageMessageContent.make({
    type: "image_url",
    image_url: {
      url: `data:image/jpeg;base64,${Buffer.from(bytes).toString("base64")}`
    }
  })
