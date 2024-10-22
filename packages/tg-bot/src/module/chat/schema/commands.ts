import * as S from "effect/Schema";

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

export const CommonOptionalFieldsWhenSending = 
  S.Struct({
    disable_notification: S.Boolean,
    message_thread_id: S.Number,
    parse_mode: ParseMode,
    reply_parameters: ReplyParameters,
    reply_markup: ReplyMarkup,
    message_effect_id: S.String,
    protect_content: S.Boolean
  }).pipe(
    // S.partial
    S.partialWith({ exact: true })
  );

export const MessageFile = 
  S.Struct({
    content: S.Uint8Array,
    fileName: S.NonEmptyString
  })

export const SendChatMessageCommand =
  S.Struct({
    text: S.String,
    chat_id: ChatId,
  }).pipe(
    S.extend(CommonOptionalFieldsWhenSending)
  )

export const SendVoiceCommand =
  S.Struct({
    chat_id: ChatId,
    caption: S.UndefinedOr(S.String),
    voice: S.Union(MessageFile, S.String)
  }).pipe(
    S.extend(CommonOptionalFieldsWhenSending)
  )

export const SendDocument =
  S.Struct({
    chat_id: ChatId,
    caption: S.UndefinedOr(S.String),
    document: S.Union(MessageFile, S.String)
  }).pipe(
    S.extend(CommonOptionalFieldsWhenSending)
  );
