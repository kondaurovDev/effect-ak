import { describe, expect, it } from "vitest";
import { Effect, Exit, Logger, LogLevel, pipe } from "effect"

import { TgBotSettingsService } from "../../src/module/settings/service"

import { testEnv } from "./live";

describe("TgBotSettings service", () => {

  it("get webhook info", async () => {

    const actual = 
      await pipe(
        TgBotSettingsService,
        Effect.andThen(_ => _.getWebhook()),
        Effect.provide([ testEnv, TgBotSettingsService.Default ]),
        Logger.withMinimumLogLevel(LogLevel.Debug),
        Effect.runPromiseExit
      )

    expect(actual).toEqual(Exit.succeed);
    
  })

})
