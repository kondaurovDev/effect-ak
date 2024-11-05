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
          botClient.executeMethod({
            path: "/getWebhookInfo",
            responseSchema: WebhookInfo,
            payload: empty,
          })

        const setWebhook = (
          payload: typeof SetWebhookCommand.Type
        ) =>
          botClient.executeMethod({
            path: "/setWebhook",
            responseSchema: S.Literal(true),
            payload
          })

        return {
          webhookInfo, setWebhook
        } as const;

      })
  }) { }
