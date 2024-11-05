import { Config, Effect, Layer, pipe, Redacted } from "effect";

import { tgBotModuleName } from "../const.js";

export class TgBotTokenProvider
  extends Effect.Tag("TgBotTokenProvider")<TgBotTokenProvider, {
    tokenEffect: Effect.Effect<Redacted.Redacted<string>, unknown>
  }>() { 

    static readonly fromConfig =
      Layer.effect(
        TgBotTokenProvider,
        pipe(
          Config.nonEmptyString("token"),
          Config.nested(tgBotModuleName),
          Config.map(Redacted.make),
          Effect.andThen(token =>
            TgBotTokenProvider.of({
              tokenEffect: Effect.succeed(token)
            })
          ),
          Effect.tap(
            Effect.logInfo("telegram bot token was resolved")
          )
        )
      );

  }
