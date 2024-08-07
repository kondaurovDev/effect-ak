import { Brand } from "effect";
import { Schema as S } from "@effect/schema"

export type RequestMessage = 
  typeof Message.Type & Brand.Brand<"RequestMessage">;
export const RequestMessage = Brand.nominal<RequestMessage>();

export const inlineImage = (
  bytes: Uint8Array
) =>
  ({
    type: "image",
    source: {
      type: "base64",
      media_type: "image/jpeg",
      data: Buffer.from(bytes).toString("base64")
    }
  }) as MessageContent

export type MessageContent =
  typeof MessageContent.Type

export const MessageContent = 
  S.Union(
    S.Struct({
      type: S.Literal("image"),
      source:
        S.Struct({
          type: S.Literal("base64"),
          media_type: S.String,
          data: S.String
        })
    }),
    S.Struct({
      type: S.Literal("text"),
      text: S.String
    })
  )

export const Message =
  S.Struct({
    role: S.Literal("user", "assistant"),
    content:
      S.Array(
        MessageContent
      )
  })

export class CreateMessageRequest
  extends S.Class<CreateMessageRequest>("ChatCompletionRequest")({
    model: S.String,
    messages: S.Array(Message),
    max_tokens: S.Number,
    metadata:
      S.optional(
        S.Struct({
          user_id: S.String
        })
      ),
    system: S.optional(S.String),
    temperature: S.optional(S.Number)
  }) { };
