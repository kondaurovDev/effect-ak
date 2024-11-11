import * as S from "effect/Schema";

export class ImageMessageContent
  extends S.Class<ImageMessageContent>("ImageMessageContent")({
    type: S.Literal("image_url"),
    image_url:
      S.Struct({
        url: S.String
      })
  }) {}

export class AudioMessageContent
  extends S.Class<AudioMessageContent>("AudioMessageContent")({
    type: S.Literal("input_audio"),
    input_audio:
      S.Struct({
        data: S.StringFromBase64,
        format: S.Literal("wav")
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
    TextMessageContent,
    AudioMessageContent
  );

export type MessageContent = typeof MessageContent.Type
export const MessageContent =
  S.Union(
    S.String,
    S.Array(OneOfMessageContent)
  )