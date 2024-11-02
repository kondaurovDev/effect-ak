import { DateTime, Effect } from "effect";
import * as S from "effect/Schema";

import { TgBotHttpClient } from "../../api/http-client.js";
import { SetWebhookCommand } from "./schema.js";

export class TgBotWebhookService
  extends Effect.Service<TgBotWebhookService>()("TgBotWebhookService", {

    effect:
      Effect.gen(function* () {

        const httpClient = yield* TgBotHttpClient;

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
          getWebhook, setWebhook
        } as const;

      }),

    dependencies: [
      TgBotHttpClient.Default
    ]

  }) { }