import { Effect, pipe } from "effect"
import { Schema as S } from "@effect/schema";

import { TgBotHttpClient } from "../api/index.js";
import { MessageUpdate, AnswerPreCheckoutQuery, SendStarsInvoice } from "../domain/index.js"

// https://core.telegram.org/bots/api#sendinvoice
export const sendStarsInvoice = (
  input: typeof SendStarsInvoice.Type
) =>
  pipe(
    TgBotHttpClient,
    Effect.andThen(client =>
      client.executeMethod(
        "/sendInvoice",
        input,
        MessageUpdate
      )
    )
  )

// https://core.telegram.org/bots/api#answerprecheckoutquery
export const answerPreCheckoutQuery = (
  input: typeof AnswerPreCheckoutQuery.Type
) =>
  pipe(
    TgBotHttpClient,
    Effect.andThen(client =>
      client.executeMethod(
        "/answerPreCheckoutQuery",
        input,
        S.Boolean
      )
    )
  )
