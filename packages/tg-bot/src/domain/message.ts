import { Schema as S } from "@effect/schema"
import { ChatId } from "./chat.js"

export const ParseMode =
  S.Literal("MarkdownV2", "HTML")

export const ReplyParameters = 
  S.Struct({
    message_id: S.Number,
    chat_id: ChatId
  })
