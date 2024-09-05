import { Effect, pipe } from "effect"

import { RestClient, RestClientLive } from "../rest-client.js"
import * as M from "../models/method.js";
import * as D from "../models/domain.js";
import { MessageUpdate } from "../domain/index.js";

export const getMe = () =>
  pipe(
    RestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/getMe",
        {},
        D.User
      )
    )
  )

export const sendMessage = (
  input: M.SendMessage
) =>
  pipe(
    RestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/sendMessage",
        input,
        MessageUpdate
      )
    )
  )

export const editMessageText = (
  input: M.EditMessageText
) =>
  pipe(
    RestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/editMessageText",
        input,
        MessageUpdate
      )
    )
  )

export const sendVoice = (
  input: M.SendVoice
) =>
  pipe(
    RestClient,
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
    RestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/getWebhookInfo",
        {},
        D.WebhookInfo
      )
    )
  )

export const setWebhook = (
  input: M.SetWebhook
) =>
  pipe(
    RestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/setWebhook",
        input,
        D.SetWebhookResult
      )
    )
  )

export const getChat = (
  input: M.GetChat
) =>
  pipe(
    RestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/getChat",
        input,
        D.Chat
      )
    )
  )

export const getFile = (
  input: M.GetFile
) =>
  pipe(
    RestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/getFile",
        input,
        D.FileInfo
      )
    )
  )

export const setBotName = (
  input: M.SetBotName
) =>
  pipe(
    RestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/sendMyName",
        input,
        D.SetBotNameResult
      )
    )
  )

export const setBotCommands = (
  input: M.SetBotCommands
) =>
  pipe(
    RestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/setMyCommands",
        input,
        D.SetBotCommandsResult
      )
    )
  )

  export const getBotCommands = (
    input: M.GetBotCommands
  ) =>
    pipe(
      RestClient,
      Effect.andThen(client =>
        client.sendApiPostRequest(
          "/getMyCommands",
          input,
          D.GetBotCommandsResult
        )
      )
    )

export const setChatAction = (
  input: M.SetChatAction
) =>
  pipe(
    RestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/sendChatAction",
        input,
        D.SetChatActionResult
      )
    )
  )

export const updateMessageReplyMarkup = (
  input: M.SetMessageReplyMarkup
) =>
  pipe(
    RestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/editMessageReplyMarkup",
        input,
        D.UpdateMessageReplyMarkupResult
      )
    )
  )
