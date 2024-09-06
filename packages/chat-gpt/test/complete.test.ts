import { describe, it, expect } from "vitest";
import { pipe, Effect, Logger, Layer } from "effect"
import { LogLevelConfigFromEnvLive} from "@efkit/shared"
import { Schema as S } from "@effect/schema"

import { ChatCompletionRequest, CompletionLive } from "../src/completion";
import { completeChat, completeFunctionCall, completeStructuredRequest } from "../src/completion/complete";
import { GptToken } from "../src/token";

const live = 
  Layer.mergeAll(
    LogLevelConfigFromEnvLive,
    CompletionLive,
    GptToken.createLayerFromConfig()
  )

const currencySchema = 
  S.Struct({
    currFrom: S.String.annotations({ title: "from which currency"}),
    currTo: S.String.annotations({ title: "to which currency"}),
    amount: S.Number.annotations({ title: "amount of money to convert from"})
  }).annotations({
    title: "convertCurrency",
    description: "convert currency from one to another",
    // examples: [
    //   {
    //     amount: 5000,
    //     currFrom: "EUR",
    //     currTo: "AMD"
    //   }
    // ]
  })


describe("chat completion test suite", () => {

  it("complete text request", async () => {

    const actual = 
      await pipe(
        completeChat(new ChatCompletionRequest({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "you are limited to use only one word for answer" },
            { role: "user", content: "what's programming language stands for js?" }
          ]
        })),
        Effect.provide(live),
        Effect.runPromiseExit
      );

    if (actual._tag == "Failure") {
      console.log(actual.cause)
    }

    expect(actual._tag == "Success").toBeTruthy();

    if (actual._tag == "Success") {
      expect(actual.value.toLowerCase()).toEqual("javascript")
    }

  });

  it("complete request with function tool", async () => {
  
    const actual = 
      await pipe(
        ChatCompletionRequest.createFunctionCall(
          "currencySchema", currencySchema, "gpt-4o-mini", [], "translate 5000 american dollars to marocco currency"
        ),
        Effect.tap(request =>
          Effect.logDebug(request.tools?.at(0)?.function.parameters)
        ),
        Effect.andThen(request =>
          completeFunctionCall(request, currencySchema)
        ),
        Effect.provide(live),
        Effect.runPromiseExit
      );

    if (actual._tag == "Success") {
      expect(actual.value).toEqual({
        currFrom: "USD",
        currTo: "MAD",
        amount: 5000
      })
    }

  })

  it("complete structured request", async () => {
  
    const actual = 
      await pipe(
        ChatCompletionRequest.createStructuredRequest(
          "currencySchema", currencySchema, "gpt-4o-mini", [], "translate 5000 american dollars to marocco currency"
        ),
        Effect.tap(request =>
          Effect.logDebug(request.tools?.at(0)?.function.parameters)
        ),
        Effect.andThen(request =>
          completeStructuredRequest(request, currencySchema)
        ),
        Effect.tap(result => Effect.logInfo(result)),
        Effect.provide(live),
        Effect.runPromise
      );

    expect(actual).toEqual({
      currFrom: "USD",
      currTo: "MAD",
      amount: 5000
    })

  })

})