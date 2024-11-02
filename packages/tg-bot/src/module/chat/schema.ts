import * as S from "effect/Schema";

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
  S.Literal(
    "typing", "upload_photo", "record_video", "record_voice", 
    "upload_voice", "upload_document", "find_location", 
    "upload_video_note", "record_video_note"
  );

export const User =
  S.Struct({
    id: S.Number,
    first_name: S.NonEmptyString,
    username: S.optional(S.NonEmptyString),
    is_bot: S.Boolean
  }).annotations({
    identifier: "TgUser"
  });

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
