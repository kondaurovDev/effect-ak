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

export class Metadata 
  extends S.Class<Metadata>("Metadata")({
    user_id: S.String
  }) {}

export type MessageCompletionRequestInput = typeof MessageCompletionRequest.fields
export class MessageCompletionRequest
  extends S.Class<MessageCompletionRequest>("MessageCompletionRequest")({
    model: S.Literal("claude-3-opus-20240229"),
    messages: S.Array(Message),
    max_tokens: S.Number,
    metadata: Metadata.pipe(S.optional),
    system: S.String.pipe(S.optional),
    temperature: S.Number.pipe(S.optional)
  }) { };
