import * as S from "effect/Schema"
import { Effect } from "effect";

import {
  EditMessageTextCommand, GetChatCommand, SendChatMessageCommand, SendDocumentCommand,
  SendVoiceCommand, SetChatActionCommand, UpdateMessageReplyMarkupCommand, SendDiceCommand
} from "./schema/commands.js";
import { MessageUpdate } from "./schema/message-update.js";
import { ChatInfo, SetMenuButtonCommand } from "./schema.js";
import { TgBotHttpClient } from "../../api/http-client.js";

export class TgChatService
  extends Effect.Service<TgChatService>()("TgChatService", {
    effect:
      Effect.gen(function* () {

        const botClient = yield* TgBotHttpClient;

        const sendMessage =
          (payload: typeof SendChatMessageCommand.Type) =>
            botClient.executeMethod({
              path: "/sendMessage",
              responseSchema: MessageUpdate,
              payload
            })

        const editMessageText =
          (payload: typeof EditMessageTextCommand.Type) =>
            botClient.executeMethod({
              path: "/editMessageText",
              responseSchema: MessageUpdate,
              payload,
            })

        const updateMessageReplyMarkup =
          (payload: typeof UpdateMessageReplyMarkupCommand.Type) =>
            botClient.executeMethod({
              path: "/editMessageReplyMarkup",
              responseSchema:
                S.Union(
                  S.Boolean,
                  MessageUpdate
                ),
              payload
            })

        const getChat =
          (payload: typeof GetChatCommand.Type) =>
            botClient.executeMethod({
              path: "/getChat",
              responseSchema: ChatInfo,
              payload
            })

        const setChatAction =
          (payload: typeof SetChatActionCommand.Type) =>
            botClient.executeMethod({
              path: "/sendChatAction",
              responseSchema: S.Boolean,
              payload
            })

        const sendVoice =
          (payload: typeof SendVoiceCommand.Type) =>
            botClient.executeMethod({
              path: "/sendVoice",
              responseSchema: MessageUpdate,
              payload
            })

        const sendDocument =
          (payload: typeof SendDocumentCommand.Type) =>
            botClient.executeMethod({
              path: "/sendDocument",
              responseSchema: MessageUpdate,
              payload
            })

        const sendDice =
          (payload: typeof SendDiceCommand.Type) =>
            botClient.executeMethod({
              path: "/sendDice",
              responseSchema: MessageUpdate,
              payload
            });

        const setChatMenuButton =
          (payload: typeof SetMenuButtonCommand.Type) =>
            botClient.executeMethod({
              path: "/setChatMenuButton",
              responseSchema: S.Literal(true),
              payload
            });

        return {
          sendMessage, editMessageText, updateMessageReplyMarkup,
          getChat, setChatAction, sendVoice, sendDocument, sendDice,
          setChatMenuButton
        } as const;

      }),

    dependencies: [
      TgBotHttpClient.Default
    ]
  }) { }
