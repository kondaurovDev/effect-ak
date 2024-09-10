import { Schema as S } from "@effect/schema"

export const ChatId = 
  S.Union(S.Number, S.String);

export type ChatInfo = typeof ChatInfo.Type
export const ChatInfo =
  S.Struct({
    id: ChatId,
    type: S.Literal("private", "group", "supergroup", "channel"),
    title: S.optional(S.String)
  }).annotations({
    identifier: "Chat"
  });

export type ChatAction = typeof ChatAction.Type
export const ChatAction =
  S.Literal("typing", "record_voice")
