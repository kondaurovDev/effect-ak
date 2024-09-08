import { Effect, pipe } from "effect"
import { Schema as S } from "@effect/schema";

import { TgRestClient } from "../rest-client.js";
import { MessageUpdate, AnswerPreCheckoutQuery, SendStarsInvoice } from "../domain/index.js"

// https://core.telegram.org/bots/api#sendinvoice
export const sendStarsInvoice = (
  input: typeof SendStarsInvoice.Type
) =>
  pipe(
    TgRestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
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
    TgRestClient,
    Effect.andThen(client =>
      client.sendApiPostRequest(
        "/answerPreCheckoutQuery",
        input,
        S.Boolean
      )
    )
  )
