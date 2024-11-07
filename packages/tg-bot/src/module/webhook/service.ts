import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import * as Context from "effect/Context";

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

      }),

      dependencies: [
        TgBotHttpClient.Default
      ]
  }) { }
