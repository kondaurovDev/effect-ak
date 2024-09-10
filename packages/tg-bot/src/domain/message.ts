import { Schema as S } from "@effect/schema"
import { ChatId } from "./chat.js"

export const ParseMode =
  S.Literal("MarkdownV2", "HTML")

export const ReplyParameters = 
  S.Struct({
    message_id: S.Number,
    chat_id: ChatId
  })

export const MessageEffectIdCodes = {
  "🔥": "5104841245755180586",
  "👍": "5107584321108051014",
  "👎": "5104858069142078462",
  "❤️": "5159385139981059251",
  "🎉": "5046509860389126442",
  "💩": "5046589136895476101"
}
