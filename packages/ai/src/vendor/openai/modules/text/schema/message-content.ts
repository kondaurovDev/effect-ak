import * as S from "effect/Schema";

export class ImageMessageContent
  extends S.Class<ImageMessageContent>("ImageMessageContent")({
    type: S.Literal("image_url"),
    image_url:
      S.Struct({
        url: S.String
      })
  }) {}

export class TextMessageContent
  extends S.Class<TextMessageContent>("TextMessageContent")({
    type: S.Literal("text"),
    text: S.String
  }) { }

export const OneOfMessageContent =
  S.Union(
    ImageMessageContent,
    TextMessageContent
  );

export type MessageContent = typeof MessageContent.Type
export const MessageContent =
  S.Union(
    S.String,
    S.Array(OneOfMessageContent)
  )