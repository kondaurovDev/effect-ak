import { Schema as S } from "@effect/schema"

import { ChatId } from "../../chat/schema.js"

export const BotCommand =
  S.Struct({
    command: S.NonEmptyString,
    description: S.NonEmptyString
  })

export const CommandScope =
  S.Union(
    S.Struct({
      type:
        S.Literal(
          "all_private_chats", "default", "all_group_chats",
          "all_chat_administrators"
        ),
    }),
    S.Struct({
      type: S.Literal(
        "chat", "chat_administrators"
      ),
      chat_id: ChatId
    }),
    S.Struct({
      type: S.Literal(
        "chat_member"
      ),
      chat_id: ChatId,
      user_id: S.Number
    }),
  )
