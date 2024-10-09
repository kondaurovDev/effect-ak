import { describe, expect, it } from "vitest";
import { Effect, Exit, Layer, Logger, LogLevel, pipe } from "effect"
import { NodeContext  } from "@effect/platform-node"
import { FileSystem  } from "@effect/platform/FileSystem"
import { Schema as S  } from "@effect/schema"

import { getWebhook } from "../../src/actions/bot"
import { TgBotTokenProvider } from "../../src/providers/bot-token";
import { TgBotHttpClient } from "../../src/api";

const tokenProvider = 
  Layer.effect(
    TgBotTokenProvider,
    pipe(
      FileSystem,
      Effect.andThen(fs => fs.readFileString(`${__dirname}/../../artifacts/integration-config.json`)),
      Effect.andThen(
        S.decode(S.parseJson(S.Struct({ botToken: S.NonEmptyString.pipe(S.Redacted) })))
      ),
      Effect.andThen(_ => TgBotTokenProvider.of(_.botToken))
    )
  ).pipe(
    Layer.provide(NodeContext.layer)
  )

const client =
  TgBotHttpClient.Default.pipe(
    Layer.provide(NodeContext.layer)
  )

describe("integration test", () => {

  it("get webhook info", async () => {

    const actual = 
      await pipe(
        getWebhook(),
        Effect.provide([ client, tokenProvider ]),
        Logger.withMinimumLogLevel(LogLevel.Debug),
        Effect.runPromiseExit
      )

    expect(actual).toEqual(Exit.succeed);
    
  })

})
