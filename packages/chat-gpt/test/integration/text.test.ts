import { describe, it, expect } from "vitest";
import { pipe, Effect, Layer, Logger, Exit } from "effect";
import { LogLevelConfigFromEnv } from "@efkit/shared/misc";
import { Schema as S } from "@effect/schema";

import { 
  ChatCompletionRequest, ReasoningRequest, TextService,
  UserOrSystemMessage,
  makeFunctionCallRequest, makeStructuredRequest 
} from "../../src/text";
import { TokenProvider } from "../../src/api";
import { ChatGptLive } from "../../src/live";

const live =
  Layer.mergeAll(
    ChatGptLive,
    LogLevelConfigFromEnv,
    TokenProvider.live
  )

const currencySchema =
  S.Struct({
    currFrom: S.String.annotations({ title: "from which currency (ISO currency code)" }),
    currTo: S.String.annotations({ title: "to which currency (ISO currency code)" }),
    amount: S.Number.annotations({ title: "amount of money to convert" })
  }).annotations({
    title: "convertCurrency",
    description: "convert currency from one to another"
  })


describe("chat completion test suite", () => {

  it("complete text request", async () => {

    const actual =
      await pipe(
        Effect.Do,
        Effect.bind("textService", () => TextService),
        Effect.bind("request", () =>
          S.decode(ChatCompletionRequest)({
            response_format: { type: "text" },
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: "you are limited to use only one word for answer" },
              {
                role: "user", content: [
                  { type: "text", text: "what's programming language stands for js?" }
                ]
              },
            ]
          })
        ),
        Effect.andThen(({ textService, request }) =>
          textService.complete(request),
        ),
        Effect.provide(live),
        Effect.provide(Logger.pretty),
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
        makeFunctionCallRequest(
          "currencySchema", currencySchema, "gpt-4o-mini", [], "translate 5000 american dollars to armenian currency"
        ),
        Effect.tap(request =>
          Effect.logDebug(request.tools?.at(0)?.function.parameters)
        ),
        Effect.andThen(request =>
          pipe(
            TextService,
            Effect.andThen(_ =>
              _.completeFunctionCall(request, currencySchema)
            )
          )
        ),
        Effect.provide(live),
        Effect.runPromiseExit
      );

    expect(actual).toEqual(
      Exit.succeed({
        currFrom: "USD",
        currTo: "AMD",
        amount: 5000
      })
    )

  })

  it("complete structured request", async () => {

    const actual =
      await pipe(
        makeStructuredRequest(
          "currencySchema", currencySchema, "gpt-4o-mini", [
          "a user might mention countries, you need to understand the ISO currency code from it"
        ], "convert 3 american dollars to morocco"
        ),
        Effect.andThen(request =>
          pipe(
            TextService,
            Effect.andThen(_ =>
              _.completeStructured(request, currencySchema)
            )
          )
        ),
        Effect.provide(live),
        Effect.runPromiseExit
      );

    expect(actual).toEqual(
      Exit.succeed({
        currFrom: "USD",
        currTo: "MAD",
        amount: 3
      })
    )

  })

  it("complete reasoning request", async () => {

    const request = 
      ReasoningRequest.make({
        model: "o1-mini",
        messages: [
          UserOrSystemMessage.make({
            content: "Hello! How are you? Answer short",
            role: "user"
          })
        ]
      })

    const actual =
      await pipe(
        TextService,
        Effect.andThen(_ =>
          _.complete(request)
        ),
        Effect.provide(live),
        Effect.runPromiseExit
      );

    expect(actual).toEqual(Exit.succeed)

  })

})