import { Schema as S } from "@effect/schema"

import { TgUpdateEvent } from "../domain/index.js";
import { ChatId, CommandScope, BotCommand } from "./domain.js";
import { ReplyMarkup } from "../domain/reply-markup.js";

const ReplyParameters = 
  S.Struct({
    message_id: S.Number,
    chat_id: ChatId
  })

const ParseMode = 
  S.Literal("MarkdownV2", "HTML")

export const SendMessage = 
  S.Struct({
    text: S.String,
    chat_id: ChatId,
    disable_notification: S.optional(S.Boolean),
    message_thread_id: S.optional(S.Number),
    parse_mode: S.optional(ParseMode),
    reply_parameters: S.optional(ReplyParameters),
    reply_markup: S.optional(ReplyMarkup)
  })

export const EditMessageText = 
  S.Struct({
    text: S.String,
    chat_id: ChatId,
    message_id: S.Number,
    reply_markup: S.optional(ReplyMarkup)
  })

export const SetMessageReplyMarkup = 
  S.Struct({
    chat_id: ChatId,
    message_id: S.Number,
    reply_markup: ReplyMarkup
  });

export const SendVoice = 
  S.Struct({
    chat_id: ChatId,
    parse_mode: S.optional(ParseMode),
    reply_parameters: ReplyParameters,
    caption: S.optional(S.String),
    voice: 
      S.Union(
        S.Uint8Array,
        S.String
      )
  });

export const GetMe = S.Undefined;
export const GetWebhook = S.Undefined;
export const GetChat = 
  S.Struct({
    chat_id: S.NonEmptyString
  });

export const GetFile = 
  S.Struct({
    file_id: S.String
  });

export const SetBotName = 
  S.Struct({
    name: S.String,
    language_code: S.optional(S.String)
  });
  
export const SetChatAction = 
  S.Struct({
    chat_id: S.String,
    action: S.Literal("typing", "record_voice"),
    message_thread_id: S.optional(S.Number)
  });

const AllowedUpdates =
  S.keyof(S.Struct(TgUpdateEvent.fields).pipe(S.omit("update_id")))

export const SetWebhook = 
  S.Struct({
    url: S.NonEmptyString.pipe(S.pattern(/^https:\/\/.*/)),
    allow_updates: S.Array(AllowedUpdates),
    drop_pending_updates: S.optional(S.Boolean),
    secret_token: S.NonEmptyString.pipe(S.minLength(3))
  });

//https://core.telegram.org/bots/api#determining-list-of-commands
export const SetBotCommands = 
  S.Struct({
    commands: S.Array(BotCommand),
    scope: CommandScope,
    language_code: S.optional(S.String)
  });

export const GetBotCommands = 
  S.Struct({
    scope: S.optional(CommandScope),
    language_code: S.optional(S.NonEmptyString)
  });
