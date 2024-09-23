import { Effect, pipe } from "effect"
import { Schema as S } from "@effect/schema"

import { TgRestClient } from "../client/tag.js"
import { ChatInfo, ChatAction } from "../domain/chat.js";

export const GetChatInput = 
  S.Struct({
    chat_id: S.NonEmptyString
  });

export const getChat = (
  input: typeof GetChatInput.Type
) =>
  pipe(
    TgRestClient,
    Effect.andThen(client =>
      client.execute(
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
    TgRestClient,
    Effect.andThen(client =>
      client.execute(
        "/sendChatAction",
        input,
        S.Boolean
      )
    )
  )
