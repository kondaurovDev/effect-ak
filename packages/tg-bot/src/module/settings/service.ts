import { Effect } from "effect";
import * as S from "effect/Schema";

import { TgBotHttpClient } from "../../api/http-client.js";
import { User } from "../chat/schema.js";
import { GetBotCommandsCommand, SetBotCommandsCommand, SetBotNameCommand } from "./schema/commands.js";
import { BotCommand } from "./schema/bot-command.js";

export class TgBotSettingsService 
  extends Effect.Service<TgBotSettingsService>()("TgBotSettingsService", {

  effect:
    Effect.gen(function* () {

      const httpClient = yield* TgBotHttpClient;

      const getMe = () =>
        httpClient.executeMethod(
          "/getMe",
          {},
          User
        )

      const setBotName = (
        input: typeof SetBotNameCommand.Type
      ) =>
        httpClient.executeMethod(
          "/sendMyName",
          input,
          S.Boolean
        )

        const setBotCommands = (
          input: typeof SetBotCommandsCommand.Type
        ) =>
          httpClient.executeMethod(
            "/setMyCommands",
            input,
            S.Boolean
          )
        
        const getBotCommands = (
          input: typeof GetBotCommandsCommand.Type
        ) =>
          httpClient.executeMethod(
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
    
}) {}