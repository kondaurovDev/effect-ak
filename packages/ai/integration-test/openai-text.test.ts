import { describe, it, expect, assert } from "vitest";
import { Effect, Layer, Logger, Exit, LogLevel, Schema as S, ManagedRuntime } from "effect";

import {
  ReasoningRequest, TextService, UserMessage,
  makeFunctionCallRequest, makeStructuredRequest
} from "../src/internal/openai/modules/text/index";

const runtime =
  ManagedRuntime.make(
    Layer.mergeAll(
      TextService.Default,
      Logger.structured
    )
  )

const currencySchema =
  S.Struct({
    currFrom: S.String.annotations({ title: "from which currency (ISO currency code)" }),
    currTo: S.String.annotations({ title: "to which currency (ISO currency code)" }),
    amount: S.Number.annotations({ title: "amount of money to convert" })
  }).annotations({
    title: "convertCurrency",
    description: "convert currency from one to another"
  });

const program = <O>(
  inner: (_: TextService) => Effect.Effect<O, unknown>
) =>
  Effect.gen(function* () {

    const service = yield* TextService;

    return yield* inner(service)

  }).pipe(
    Logger.withMinimumLogLevel(LogLevel.Debug),
    Effect.provide(runtime)
  )

describe("chat completion test suite", () => {

  it("complete text request", async () => {

    const actual =
      await program(_ =>
        _.completeText({
          response_format: { type: "text" },
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "you are limited to use only one word for answer, only letters" },
            {
              role: "user", content: [
                { type: "text", text: "what's programming language stands for js?" }
              ]
            },
          ]
        })
      ).pipe(
        Effect.runPromiseExit
      )

    if (actual._tag == "Failure") {
      console.log(actual.cause)
    }

    assert(actual._tag == "Success");

    expect(actual.value.toLowerCase()).toEqual("javascript")

  });

  it("complete request with function tool", async () => {

    const actual =
      await Effect.gen(function* () {

        const request =
          yield* makeFunctionCallRequest(
            "currencySchema", currencySchema, "gpt-4o-mini", [], "translate 5000 american dollars to armenian currency"
          );

        const response =
          yield* program(_ =>
            _.completeFunctionCall(request, currencySchema)
          )

        return response;

      }).pipe(
        Effect.runPromiseExit
      )

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
      await Effect.gen(function* () {

        const request =
          yield* makeStructuredRequest(
            "currencySchema",
            currencySchema,
            "gpt-4o-mini",
            [
              "a user might mention countries, you need to understand the ISO currency code from it"
            ],
            "convert 3 american dollars to morocco"
          )

        const response =
          yield* program(_ =>
            _.completeStructured(request, currencySchema)
          )

        return response;

      }).pipe(
        Effect.runPromiseExit
      )

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
          UserMessage.make({
            content: "Hello! How are you? Answer short and choose a random color",
            role: "user"
          })
        ]
      })

    const actual =
      await Effect.gen(function* () {

        const response =
          yield* program(_ => _.completeText(request))

        console.log(response);

        return response;

      }).pipe(
        Effect.runPromiseExit
      )

    assert(actual._tag == "Success")

  });

})