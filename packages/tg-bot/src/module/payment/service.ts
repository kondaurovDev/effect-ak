import { Effect } from "effect";
import { Schema as S } from "@effect/schema";

import { TgBotHttpClient } from "../../api/http-client.js";
import { AnswerPreCheckoutQuery, SendStarsInvoice } from "./schema.js";
import { MessageUpdate } from "../chat/schema/message-update.js";

export class TgPaymentService 
  extends Effect.Service<TgPaymentService>()("TgPaymentService", {

  effect:
    Effect.gen(function* () {

      const httpClient = yield* TgBotHttpClient;

      // https://core.telegram.org/bots/api#sendinvoice
      const sendStarsInvoice = (
        input: typeof SendStarsInvoice.Type
      ) =>
        httpClient.executeMethod(
          "/sendInvoice",
          input,
          MessageUpdate
        )

      // https://core.telegram.org/bots/api#answerprecheckoutquery
      const answerPreCheckoutQuery = (
        input: typeof AnswerPreCheckoutQuery.Type
      ) =>
      httpClient.executeMethod(
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
    
}) {}