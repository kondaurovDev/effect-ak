import { Effect, pipe } from "effect"
import { Schema as S } from "@effect/schema"

import { TgRestClient } from "../client/tag.js"
import { MessageUpdate } from "../domain/message-update.js";
import { ChatId } from "../domain/chat.js";
import { ReplyMarkup } from "../domain/reply-markup.js";
import { ParseMode, ReplyParameters } from "../domain/message.js";

export const SendMessageInput =
  S.Struct({
    text: S.String,
    chat_id: ChatId,
    disable_notification: S.optional(S.Boolean),
    message_thread_id: S.optional(S.Number),
    parse_mode: S.optional(ParseMode),
    reply_parameters: S.optional(ReplyParameters),
    reply_markup: S.optional(ReplyMarkup)
  })

export const sendMessage = (
  input: typeof SendMessageInput.Type
) =>
  pipe(
    TgRestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/sendMessage",
        input,
        MessageUpdate
      )
    )
  )

export const EditMessageTextInput = 
  S.Struct({
    text: S.String,
    chat_id: ChatId,
    message_id: S.Number,
    reply_markup: S.optional(ReplyMarkup)
  })

export const editMessageText = (
  input: typeof EditMessageTextInput.Type
) =>
  pipe(
    TgRestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/editMessageText",
        input,
        MessageUpdate
      )
    )
  )

export const UpdateMessageReplyMarkupInput = 
  S.Struct({
    chat_id: ChatId,
    message_id: S.Number,
    reply_markup: ReplyMarkup
  });

export const updateMessageReplyMarkup = (
  input: typeof UpdateMessageReplyMarkupInput.Type
) =>
  pipe(
    TgRestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/editMessageReplyMarkup",
        input,
        S.Union(
          S.Boolean,
          MessageUpdate
        )
      )
    )
  )
