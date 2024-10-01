import { Schema as S } from "@effect/schema"

export type ChatId = typeof ChatId.Type;
export const ChatId = S.Number.pipe(S.brand("ChatId"))

export type ChatInfo = typeof ChatInfo.Type
export const ChatInfo =
  S.Struct({
    id: ChatId,
    type: S.Literal("private", "group", "supergroup", "channel"),
    title: S.UndefinedOr(S.String)
  }).annotations({
    identifier: "Chat"
  });

export type ChatAction = typeof ChatAction.Type
export const ChatAction =
  S.Literal("typing", "record_voice")
