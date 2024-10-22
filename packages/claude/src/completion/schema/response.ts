import { Brand } from "effect";
import { Schema as S } from "@effect/schema";

export type StopReason =
  typeof StopReason.Type

export const StopReason =
  S.Literal(
    "end_turn",
    "max_tokens",
    "stop_sequence",
    "tool_use"
  );

export const messageResponseErrorCodes = [
  "no_content"
] as const;

export class MessageToolResponse
  extends S.Class<MessageToolResponse>("MessageToolResponse")({
    type: S.Literal("tool_use"),
    id: S.String,
    name: S.String,
    input: S.String
  }) { }

export class MessageTextResponse
  extends S.Class<MessageTextResponse>("MessageTextResponse")({
    type: S.Literal("text"),
    text: S.String
  }) { }

export type MessageResponseErrorCode = Brand.Branded<typeof messageResponseErrorCodes[number], "MessageResponseErrorCode">;
export const MessageResponseErrorCode = Brand.nominal<MessageResponseErrorCode>();

export type MessageResponseOutput = typeof MessageResponse.fields
export class MessageResponse
  extends S.Class<MessageResponse>("MessageResponse")({
    id: S.String,
    role: S.Literal("assistant"),
    type: S.Literal("message"),
    stop_reason: StopReason,
    model: S.String,
    content: S.Union(MessageTextResponse, MessageToolResponse).pipe(S.NonEmptyArray),
  }) {}
