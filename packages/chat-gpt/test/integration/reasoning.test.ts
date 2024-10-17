import { assert, describe, expect, it } from "vitest";
import { Effect, Layer, Logger, Array, Exit } from "effect";
import { LogLevelConfigFromEnv } from "@efkit/shared/misc"

import {
  OutputColumn, ReasoningService,
  ReasoningStructuredRequest
} from "../../src/modules/reasoning";
import { GptTokenProvider } from "../../src/api";

const live =
  Layer.mergeAll(
    ReasoningService.Default,
    GptTokenProvider.fromEnv,
    Logger.structured,
    LogLevelConfigFromEnv
  )

const outputCurrencyColumns =
  Array.make(
    OutputColumn.make({
      columnName: "currFrom",
      description: "from which currency (ISO currency code)"
    }),
    OutputColumn.make({
      columnName: "currTo",
      description: "to which currency (ISO currency code)"
    }),
    OutputColumn.make({
      columnName: "amount",
      description: "amount of money to convert"
    }),
  );

describe("chat completion test suite", () => {

  it("complete text request", async () => {

    const actual =
      await Effect.gen(function* () {

        const service = yield* ReasoningService;

        const result =
          yield* service.getStructured(
            ReasoningStructuredRequest.make({
              inputRequests: [
                {
                  userPhrase: "translate 5000 american dollars to armenian currency"
                },
                {
                  userPhrase: "how much armenia drams I get from 100 euro?"
                }
              ],
              mainInstruction: 
                `
                  given list of request for currency exchange
                `,
              outputColumns: outputCurrencyColumns
            })
          )

        yield* Effect.logInfo(result)

        return result;

      }).pipe(
        Effect.tapErrorCause(Effect.logError),
        Effect.provide(live),
        Effect.runPromiseExit
      );

    assert(Exit.isSuccess(actual));

    const result = actual.value;

    expect(result).toHaveLength(2);

    expect(result.at(0))
      .toEqual({
        currFrom: "USD",
        currTo: "AMD",
        amount: "5000"
      });

    expect(result.at(1))
      .toEqual({
        currFrom: "EUR",
        currTo: "AMD",
        amount: "100"
      });

  })
})