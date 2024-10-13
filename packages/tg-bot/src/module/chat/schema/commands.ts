import { Schema as S } from "@effect/schema"

import { ChatAction, ChatId, ParseMode, ReplyParameters } from "../schema.js"
import { ReplyMarkup } from "./reply-markup.js";

export const GetChatCommand = 
  S.Struct({
    chat_id: S.NonEmptyString
  });

export const SetChatActionCommand =
S.Struct({
  chat_id: S.String,
  action: ChatAction,
  message_thread_id: S.optional(S.Number)
});


export const SendChatMessageCommand =
  S.Struct({
    text: S.String,
    chat_id: ChatId,
    disable_notification: S.optional(S.Boolean),
    message_thread_id: S.optional(S.Number),
    parse_mode: S.optional(ParseMode),
    reply_parameters: S.optional(ReplyParameters),
    reply_markup: S.optional(ReplyMarkup),
    message_effect_id: S.optional(S.String),
    protect_content: S.optional(S.Boolean)
  })

export const EditMessageTextCommand = 
  S.Struct({
    text: S.String,
    chat_id: ChatId,
    message_id: S.Number,
    reply_markup: S.optional(ReplyMarkup)
  })

export const UpdateMessageReplyMarkupCommand = 
  S.Struct({
    chat_id: ChatId,
    message_id: S.Number,
    reply_markup: ReplyMarkup
  });

export const SendVoiceCommand = 
  S.Struct({
    chat_id: ChatId,
    parse_mode: S.UndefinedOr(ParseMode),
    reply_parameters: ReplyParameters,
    caption: S.UndefinedOr(S.String),
    voice: 
      S.Union(
        S.Uint8Array,
        S.String
      )
  });