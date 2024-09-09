import { Schema as S } from "@effect/schema"

export const ChatId = 
  S.Union(S.Number, S.String);

export const Chat =
  S.Struct({
    id: ChatId,
    type: S.Literal("private", "group", "supergroup", "channel"),
    title: S.optional(S.String)
  }).annotations({
    identifier: "Chat"
  });
