import { Context, Effect, Layer, pipe } from "effect";

import * as M from "./models/method.js";
import * as D from "./models/domain.js";
import { MessageUpdate } from "./update-events/message.js"
import { MethodResult, RestClient } from "./rest-client.js";
import { TgBotError } from "./error.js";

export type TgBotApiClientService = {
  getMe(): MethodResult<D.User>
  sendMessage(_: M.SendMessage): MethodResult<MessageUpdate>
  editMessage(_: M.EditMessageText): MethodResult<MessageUpdate>
  sendVoice(_: M.SendVoice): MethodResult<MessageUpdate>
  getWebhookInfo(): MethodResult<D.WebhookInfo>
  setWebhook(_: M.SetWebhook): MethodResult<D.SetWebhookResult>
  getChat(_: M.GetChat): MethodResult<D.Chat>
  getFile(_: M.GetFile): MethodResult<D.FileInfo>
  setBotName(_: M.SetBotName): MethodResult<D.SetBotNameResult>
  setChatAction(_: M.SetChatAction): MethodResult<D.SetChatActionResult>
  setBotCommands(_: M.SetBotCommands): MethodResult<D.SetBotCommandsResult>
  updateMessageReplyMarkup(_: M.SetMessageReplyMarkup): MethodResult<D.UpdateMessageReplyMarkupResult>
}

export class TgBotApiClient extends
  Context.Tag("TgBotApiClient")<TgBotApiClient, TgBotApiClientService>() {

  static live =
    Layer.effect(
      TgBotApiClient,
      Effect.Do.pipe(
        Effect.bind("restClient", () => RestClient),
        Effect.andThen(({ restClient }) =>
          TgBotApiClient.of({
            getMe: () =>
              restClient.sendApiPostRequest(
                "/getMe",
                {},
                D.User
              ),
            sendMessage: (input) =>
              restClient.sendApiPostRequest(
                "/sendMessage",
                input,
                MessageUpdate
              ),
            editMessage: (input) =>
              restClient.sendApiPostRequest(
                "/editMessageText",
                input,
                MessageUpdate
              ),
            sendVoice: input =>
              restClient.sendApiPostRequest(
                "/sendVoice",
                input,
                MessageUpdate
              ),
            getWebhookInfo: () =>
              restClient.sendApiPostRequest(
                "/getWebhookInfo",
                {},
                D.WebhookInfo
              ),
            setWebhook: (input) =>
              restClient.sendApiPostRequest(
                "/setWebhook",
                input,
                D.SetWebhookResult
              ),
            getChat: (input) =>
              restClient.sendApiPostRequest(
                "/getChat",
                input,
                D.Chat
              ),
            setBotName: (input) =>
              restClient.sendApiPostRequest(
                "/sendMyName",
                input,
                D.SetBotNameResult
              ),
            getFile: (input) =>
              restClient.sendApiPostRequest(
                "/getFile",
                input,
                D.FileInfo
              ),
            setBotCommands: (input) =>
              restClient.sendApiPostRequest(
                "/setMyCommands",
                input,
                D.SetBotCommandsResult
              ),
            setChatAction: (input) =>
              restClient.sendApiPostRequest(
                "/sendChatAction",
                input,
                D.SetChatActionResult
              ),
            updateMessageReplyMarkup: (input) =>
              restClient.sendApiPostRequest(
                "/editMessageReplyMarkup",
                input,
                D.UpdateMessageReplyMarkupResult
              ),
          })
        )
      )
    ).pipe(
      Layer.provide(RestClient.live),
    )

    static botName =
      pipe(
        TgBotApiClient,
        Effect.andThen(client =>
          client.getMe()
        ),
        Effect.filterOrFail(
          _ => _.is_bot == true,
          () => new TgBotError({ message: "Not a bot" })
        ),
        Effect.andThen(_ =>
          pipe(
            Effect.fromNullable(_.username),
            Effect.mapError(() => new TgBotError({ message: "Username not defined for bot" }))
          )
        ),
        Effect.catchAll(errors =>
          new TgBotError({ message: `get bot name error(${errors._tag}): ${errors.message}` })
        ),
        Effect.cached,
        Effect.runSync,
        Effect.provide(TgBotApiClient.live)
      );

}


