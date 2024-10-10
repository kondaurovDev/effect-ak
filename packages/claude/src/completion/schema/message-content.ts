import { Schema as S } from "@effect/schema"

export type MessageContent =
  typeof MessageContent.Type

export class ImageMessageContent
  extends S.Class<ImageMessageContent>("ImageMessageContent")({
    type: S.Literal("image"),
    source:
      S.Struct({
        type: S.Literal("base64"),
        media_type: S.String,
        data: S.String
      })
  }) {

    static makeFromBytes(
      bytes: Uint8Array
    ) {
      return ImageMessageContent.make({
        type: "image",
        source: {
          type: "base64",
          media_type: "image/jpeg",
          data: Buffer.from(bytes).toString("base64")
        }
      })
    } 

  }

export const TextMessageContent =
  S.Struct({
    type: S.Literal("text"),
    text: S.String
  })

export const MessageContent =
  S.Union(
    ImageMessageContent,
    TextMessageContent
  )