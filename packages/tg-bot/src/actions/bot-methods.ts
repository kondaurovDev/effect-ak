import { Effect, pipe } from "effect"

import { TgRestClient } from "../rest-client.js"
import * as M from "../models/method.js";
import * as D from "../models/domain.js";
import { MessageUpdate, User } from "../domain/index.js";

export const getMe = () =>
  pipe(
    TgRestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/getMe",
        {},
        User
      )
    )
  )

export const sendMessage = (
  input: typeof M.SendMessage.Type
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

export const editMessageText = (
  input: typeof M.EditMessageText.Type
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

export const sendVoice = (
  input: typeof M.SendVoice.Type
) =>
  pipe(
    TgRestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/sendVoice",
        input,
        MessageUpdate
      )
    )
  )

export const getWebhook = () =>
  pipe(
    TgRestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/getWebhookInfo",
        {},
        D.WebhookInfo
      )
    )
  )

export const setWebhook = (
  input: typeof M.SetWebhook.Type
) =>
  pipe(
    TgRestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/setWebhook",
        input,
        D.SetWebhookResult
      )
    )
  )

export const getChat = (
  input: typeof M.GetChat.Type
) =>
  pipe(
    TgRestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/getChat",
        input,
        D.Chat
      )
    )
  )

export const getFile = (
  input: typeof M.GetFile.Type
) =>
  pipe(
    TgRestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/getFile",
        input,
        D.FileInfo
      )
    )
  )

export const setBotName = (
  input: typeof M.SetBotName.Type
) =>
  pipe(
    TgRestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/sendMyName",
        input,
        D.SetBotNameResult
      )
    )
  )

export const setBotCommands = (
  input: typeof M.SetBotCommands.Type
) =>
  pipe(
    TgRestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/setMyCommands",
        input,
        D.SetBotCommandsResult
      )
    )
  )

  export const getBotCommands = (
    input: typeof M.GetBotCommands.Type
  ) =>
    pipe(
      TgRestClient,
      Effect.andThen(client =>
        client.sendApiPostRequest(
          "/getMyCommands",
          input,
          D.GetBotCommandsResult
        )
      )
    )

export const setChatAction = (
  input: typeof M.SetChatAction.Type
) =>
  pipe(
    TgRestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/sendChatAction",
        input,
        D.SetChatActionResult
      )
    )
  )

export const updateMessageReplyMarkup = (
  input: typeof M.SetMessageReplyMarkup.Type
) =>
  pipe(
    TgRestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/editMessageReplyMarkup",
        input,
        D.UpdateMessageReplyMarkupResult
      )
    )
  )
