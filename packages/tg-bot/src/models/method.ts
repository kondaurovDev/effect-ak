import { Schema as S } from "@effect/schema"

import { OriginalTgUpdateEvent } from "../update-events/index.js";
import { ChatId, CommandScope, InlineKeyboardButton } from "./domain.js";

const ReplyParameters = 
  S.Struct({
    message_id: S.Number,
    chat_id: ChatId
  })

const ReplyMarkup =
  S.Struct({
    inline_keyboard: 
      S.Array(
        S.Array(InlineKeyboardButton)
      )
  }).annotations({
    identifier: "ReplyMarkup"
  })

const ParseMode = 
  S.Literal("MarkdownV2", "HTML")

export type SendMessage = 
  typeof SendMessage.Type;
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

export type EditMessageText = 
  typeof EditMessageText.Type;
export const EditMessageText = 
  S.Struct({
    text: S.String,
    chat_id: ChatId,
    message_id: S.Number,
    reply_markup: S.optional(ReplyMarkup)
  })

export type SetMessageReplyMarkup = 
  typeof SetMessageReplyMarkup.Type;
export const SetMessageReplyMarkup = 
  S.Struct({
    chat_id: ChatId,
    message_id: S.Number,
    reply_markup: ReplyMarkup
  });

export type SendVoice = 
  typeof SendVoice.Type;

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

export type GetMe = typeof GetMe.Type;
export const GetMe = S.Undefined;

export type GetWebhook = typeof GetWebhook.Type;
export const GetWebhook = S.Undefined;

export type GetChat = typeof GetChat.Type
export const GetChat = 
  S.Struct({
    chat_id: S.NonEmptyString
  });

export type GetFile = typeof GetFile.Type
export const GetFile = 
  S.Struct({
    file_id: S.String
  });

export type SetBotName = typeof SetBotName.Type
export const SetBotName = 
  S.Struct({
    name: S.String,
    language_code: S.optional(S.String)
  });

export type SetChatAction = 
  typeof SetChatAction.Type
  
export const SetChatAction = 
  S.Struct({
    chat_id: S.String,
    action: S.Literal("typing", "record_voice"),
    message_thread_id: S.optional(S.Number)
  });

const AllowedUpdates =
  S.keyof(OriginalTgUpdateEvent.pipe(S.omit("update_id")))

export type SetWebhook = 
  typeof SetWebhook.Type
export const SetWebhook = 
  S.Struct({
    url: S.NonEmptyString.pipe(S.pattern(/^https:\/\/.*/)),
    allow_updates: S.Array(AllowedUpdates),
    drop_pending_updates: S.optional(S.Boolean),
    secret_token: S.NonEmptyString.pipe(S.minLength(3))
  });

//https://core.telegram.org/bots/api#determining-list-of-commands
export type SetBotCommands = 
  typeof SetBotCommands.Type
export const SetBotCommands = 
  S.Struct({
    commands: 
      S.Array(
        S.Struct({
        command: S.NonEmptyString,
        description: S.NonEmptyString
      })
    ),
    scope: CommandScope,
    language_code: S.optional(S.String)
  });
