import { DateTime, Effect } from "effect";
import * as S from "effect/Schema";

import { TgBotHttpClient } from "../../api/http-client.js";
import { User } from "../chat/schema.js";
import { GetBotCommandsCommand, SetBotCommandsCommand, SetBotNameCommand, SetWebhookCommand } from "./schema/commands.js";
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
        
        const getWebhook = () =>
          httpClient.executeMethod(
            "/getWebhookInfo",
            {},
            S.Struct({
              url: S.String,
              pending_update_count: S.Number,
              last_error_date:
                S.transform(
                  S.Number,
                  S.DateTimeUtcFromSelf,
                  {
                    strict: true,
                    decode: seconds => DateTime.unsafeMake(seconds * 1000),
                    encode: dt => dt.epochMillis / 1000
                  }
                ).pipe(S.optional)
            })
          )
        
        const setWebhook = (
          input: typeof SetWebhookCommand.Type
        ) =>
          httpClient.executeMethod(
            "/setWebhook",
            input,
            S.Boolean
          )

      return {
        getMe, setBotName, setBotCommands, 
        getWebhook, setWebhook, getBotCommands
      } as const;

    }),

    dependencies: [
      TgBotHttpClient.Default
    ]
    
}) {}