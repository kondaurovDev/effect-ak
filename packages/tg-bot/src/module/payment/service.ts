import { Effect, Schema as S } from "effect";

import { TgBotHttpClient } from "../../api/http-client.js";
import { AnswerPreCheckoutQuery, SendStarsInvoice } from "./schema.js";
import { MessageUpdate } from "../chat/schema/message-update.js";

export class TgPaymentService extends Effect.Service<TgPaymentService>()("TgPaymentService", {
  effect:
    Effect.gen(function* () {

      const botClient = yield* TgBotHttpClient;

      // https://core.telegram.org/bots/api#sendinvoice
      const sendStarsInvoice = (
        input: typeof SendStarsInvoice.Type
      ) =>
        botClient.executeMethod(
          "/sendInvoice",
          input,
          MessageUpdate
        )

      // https://core.telegram.org/bots/api#answerprecheckoutquery
      const answerPreCheckoutQuery = (
        input: typeof AnswerPreCheckoutQuery.Type
      ) =>
        botClient.executeMethod(
          "/answerPreCheckoutQuery",
          input,
          S.Boolean
        )

      return {
        sendStarsInvoice, answerPreCheckoutQuery
      } as const;

    }),

    dependencies: [
      TgBotHttpClient.Default
    ]
}) { }
