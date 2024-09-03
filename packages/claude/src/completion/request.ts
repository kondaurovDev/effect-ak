import { Brand } from "effect";
import { Schema as S } from "@effect/schema"
import { MessageContent } from "./message-content.js";

export type RequestMessage =
  typeof Message.Type & Brand.Brand<"RequestMessage">;
export const RequestMessage = Brand.nominal<RequestMessage>();

export const Message =
  S.Struct({
    role: S.Literal("user", "assistant"),
    content: S.Array(MessageContent)
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
