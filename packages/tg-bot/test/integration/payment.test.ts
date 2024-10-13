import { describe, expect, it } from "vitest";
import { Effect, Exit, Logger, LogLevel, pipe } from "effect"

import { ChatId } from "../../src/module/chat";
import { TgPaymentService } from "../../src/module/payment";

import { testEnv } from "./live";

describe("payment service integration test", () => {

  it("send stars invoice", async () => {

    const actual =
      await pipe(
        Effect.sleep("3 seconds"),
        Effect.andThen(() =>
          Effect.andThen(
            TgPaymentService, _ =>
            _.sendStarsInvoice({
              chat_id: ChatId.make(270501423),
              currency: "XTR",
              title: "from integration test",
              prices: [ { label: "a1", amount: 100 }],
              payload: "test payload",
              provider_token: "",
              description: "access to sheldon",
              start_parameter: "non"
            })
          )
        ),
        Effect.provide([testEnv, TgPaymentService.Default]),
        Logger.withMinimumLogLevel(LogLevel.Debug),
        Effect.runPromiseExit
      )

    expect(actual).toEqual(Exit.succeed);

  })

})
