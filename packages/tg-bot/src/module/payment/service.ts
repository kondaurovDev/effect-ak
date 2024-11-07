import * as S from "effect/Schema";
import * as Effect from "effect/Effect";

import { TgBotHttpClient } from "../../api/http-client.js";
import { AnswerPreCheckoutQuery, SendStarsInvoice } from "./schema.js";
import { MessageUpdate } from "../chat/schema/message-update.js";

export class TgPaymentService extends Effect.Service<TgPaymentService>()("TgPaymentService", {
  effect:
    Effect.gen(function* () {

      const botClient = yield* TgBotHttpClient;

      // https://core.telegram.org/bots/api#sendinvoice
      const sendStarsInvoice = (
        payload: typeof SendStarsInvoice.Type
      ) =>
        botClient.executeMethod({
          path: "/sendInvoice",
          responseSchema: MessageUpdate,
          payload
        })

      // https://core.telegram.org/bots/api#answerprecheckoutquery
      const answerPreCheckoutQuery = (
        payload: typeof AnswerPreCheckoutQuery.Type
      ) =>
        botClient.executeMethod({
          path: "/answerPreCheckoutQuery",
          responseSchema: S.Boolean,
          payload
        });

      return {
        sendStarsInvoice, answerPreCheckoutQuery
      } as const;

    }),

    dependencies: [
      TgBotHttpClient.Default
    ]
}) { }
