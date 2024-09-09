import { describe, expect, it } from "vitest";
import { Effect, Layer, pipe, Redacted } from "effect"

import { ChatMethods, Method, TgRestClientLive, TgBotToken } from "../src/index"
import { LogLevelConfigFromEnvLive } from "@efkit/shared";
import { HttpClient } from "@effect/platform";

describe("execute bot command", () => {

  const live = 
    Layer.mergeAll(
      TgRestClientLive,
      LogLevelConfigFromEnvLive,
      Layer.succeed(TgBotToken, TgBotToken.of(Redacted.make(process.env["TG_TOKEN"]!!)))
    ).pipe(
      Layer.provide(HttpClient.layer)
    )

  it("get webhook info", async () => {

    const actual = 
      await pipe(
        ChatMethods.getBotCommands(
          Method.GetBotCommands.make({})
        ),
        Effect.provide(live),
        Effect.runPromise
      )

    expect(actual).toBeDefined()
    
  })

})
