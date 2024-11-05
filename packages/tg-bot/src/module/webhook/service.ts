import { Context, Schema as S, Effect } from "effect";

import { SetWebhookCommand, WebhookInfo } from "./schema.js";
import { TgBotHttpClient } from "../../api/http-client.js";

export const TgWebhookServiceTag = Context.GenericTag<TgWebhookService>("TgWebhookService");

export class TgWebhookService
  extends Effect.Service<TgWebhookService>()("TgWebhookService", {
    effect:
      Effect.gen(function* () {

        const botClient = yield* TgBotHttpClient;
        const empty = {};

        const webhookInfo =
          botClient.executeMethod(
            "/getWebhookInfo",
            empty,
            WebhookInfo
          )

        const setWebhook = (
          input: typeof SetWebhookCommand.Type
        ) =>
          botClient.executeMethod(
            "/setWebhook",
            input,
            S.Boolean
          )

        return {
          webhookInfo, setWebhook
        } as const;

      })
  }) { }
