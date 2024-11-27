import * as S from "effect/Schema";
import * as Effect from "effect/Effect";

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
          botClient.executeMethod({
            path: "/getMe",
            responseSchema: User,
            payload: empty
          });

        const setBotName =
          (payload: typeof SetBotNameCommand.Type) =>
            botClient.executeMethod({
              path: "/sendMyName",
              responseSchema: S.Boolean,
              payload,
            });

        const setBotCommands =
          (payload: typeof SetBotCommandsCommand.Type) =>
            botClient.executeMethod({
              path: "/setMyCommands",
              responseSchema: S.Boolean,
              payload
            });

        const getBotCommands =
          (payload: typeof GetBotCommandsCommand.Type) =>
            botClient.executeMethod({
              path: "/getMyCommands",
              responseSchema: S.Array(BotCommand),
              payload
            });

        return {
          getMe, setBotName, setBotCommands, getBotCommands
        } as const;

      }),

    dependencies: [
      TgBotHttpClient.Default
    ]
  }) { }
