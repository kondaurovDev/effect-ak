import { Effect, Schema as S } from "effect";

import { TgBotHttpClient } from "../../api/http-client.js";
import { User } from "../chat/schema.js";
import { GetBotCommandsCommand, SetBotCommandsCommand, SetBotNameCommand } from "./schema/commands.js";
import { BotCommand } from "./schema/bot-command.js";

export class TgBotSettingsService
  extends Effect.Service<TgBotSettingsService>()("TgBotSettingsService", {
    effect:
      Effect.gen(function* () {

        const botClient = yield* TgBotHttpClient;
        const empty = {};

        const getMe =
          botClient.executeMethod(
            "/getMe",
            empty,
            User
          )

        const setBotName =
          (input: typeof SetBotNameCommand.Type) =>
            botClient.executeMethod(
              "/sendMyName",
              input,
              S.Boolean
            )

        const setBotCommands =
          (input: typeof SetBotCommandsCommand.Type) =>
            botClient.executeMethod(
              "/setMyCommands",
              input,
              S.Boolean
            )

        const getBotCommands =
          (input: typeof GetBotCommandsCommand.Type) =>
            botClient.executeMethod(
              "/getMyCommands",
              input,
              S.Array(BotCommand)
            )

        return {
          getMe, setBotName, setBotCommands, getBotCommands
        } as const;

      }),

      dependencies: [
        TgBotHttpClient.Default
      ]
  }) { }
