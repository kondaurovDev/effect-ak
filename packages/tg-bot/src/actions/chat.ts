import { Effect, pipe } from "effect"
import { Schema as S } from "@effect/schema"

import { TgBotHttpClient } from "../api/index.js"
import { ChatInfo, ChatAction } from "../domain/chat.js";

export const GetChatInput = 
  S.Struct({
    chat_id: S.NonEmptyString
  });

export const getChat = (
  input: typeof GetChatInput.Type
) =>
  pipe(
    TgBotHttpClient,
    Effect.andThen(client =>
      client.executeMethod(
        "/getChat",
        input,
        ChatInfo
      )
    )
  )

export const SetChatAction =
  S.Struct({
    chat_id: S.String,
    action: ChatAction,
    message_thread_id: S.optional(S.Number)
  });

export const setChatAction = (
  input: typeof SetChatAction.Type
) =>
  pipe(
    TgBotHttpClient,
    Effect.andThen(client =>
      client.executeMethod(
        "/sendChatAction",
        input,
        S.Boolean
      )
    )
  )
