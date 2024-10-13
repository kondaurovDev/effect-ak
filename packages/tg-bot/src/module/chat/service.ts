import { Effect } from "effect";
import { Schema as S } from "@effect/schema"

import { TgBotHttpClient } from "../../api/index.js";
import { EditMessageTextCommand, GetChatCommand, SendChatMessageCommand, SendVoiceCommand, SetChatActionCommand, UpdateMessageReplyMarkupCommand } from "./schema/commands.js";
import { MessageUpdate } from "./schema/message-update.js";
import { ChatInfo } from "./schema.js";

export class TgChatService
  extends Effect.Service<TgChatService>()("TgChatService", {

    effect:
      Effect.gen(function* () {

        const httpClient = yield* TgBotHttpClient;

        const sendMessage = (
          input: typeof SendChatMessageCommand.Type
        ) =>
          httpClient.executeMethod(
            "/sendMessage",
            input,
            MessageUpdate
          )

        const editMessageText = (
          input: typeof EditMessageTextCommand.Type
        ) =>
          httpClient.executeMethod(
            "/editMessageText",
            input,
            MessageUpdate
          )

        const updateMessageReplyMarkup = (
          input: typeof UpdateMessageReplyMarkupCommand.Type
        ) =>
          httpClient.executeMethod(
            "/editMessageReplyMarkup",
            input,
            S.Union(
              S.Boolean,
              MessageUpdate
            )
          )

        const getChat = (
          input: typeof GetChatCommand.Type
        ) =>
          httpClient.executeMethod(
            "/getChat",
            input,
            ChatInfo
          )

        const setChatAction = (
          input: typeof SetChatActionCommand.Type
        ) =>
          httpClient.executeMethod(
            "/sendChatAction",
            input,
            S.Boolean
          )

        const sendVoice = (
          input: typeof SendVoiceCommand.Type
        ) =>
          httpClient.executeMethod(
            "/sendVoice",
            input,
            MessageUpdate
          )

        return {
          sendMessage, editMessageText, updateMessageReplyMarkup,
          getChat, setChatAction, sendVoice
        } as const;
      }),

      dependencies: [
        TgBotHttpClient.Default
      ]

  }) { }
