import { describe, expect, it } from "vitest";
import { Effect, pipe, Logger } from "effect";
import { LogLevelConfigFromEnvLive } from "@efkit/shared";
import { Schema as S } from "@effect/schema"

import { completeFunctionCall } from "../src/completion/complete";
import { ChatCompletionRequest, CompletionServiceLive } from "../src/completion";
import { GptTokenLayerFromEnv } from "../src";

describe("function call", () => {

  it("case number 1", async () => {

    const currencySchema = 
      S.Struct({
        currFrom: S.NonEmptyString.annotations({ title: "from which currency"}),
        currTo: S.NonEmptyString.annotations({ title: "to which currency"}),
        amount: S.Positive.annotations({ title: "amount of money to convert from"})
      }).annotations({
        title: "convertCurrency",
        description: "convert currency from one to another",
        examples: [
          {
            amount: 5000,
            currFrom: "EUR",
            currTo: "AMD"
          }
        ]
      })
  
    const actual = 
      await pipe(
        ChatCompletionRequest.createFunctionCall(
          currencySchema, "gpt-4o-mini", [], "translate 5000 american dollars to marocco currency"
        ),
        Effect.tap(request =>
          Effect.logDebug(request.tools?.at(0)?.function.parameters)
        ),
        Effect.andThen(request =>
          completeFunctionCall(request, currencySchema)
        ),
        Effect.provide(LogLevelConfigFromEnvLive),
        Effect.provide(Logger.pretty),
        Effect.provide(CompletionServiceLive),
        Effect.provide(GptTokenLayerFromEnv),
        Effect.runPromise
      );

    expect(actual).toEqual({
      currFrom: "USD",
      currTo: "MAD",
      amount: 5000
    })

  })

})