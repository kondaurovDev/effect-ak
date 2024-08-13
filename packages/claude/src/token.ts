import { Layer, pipe, Effect, Context, Config } from "effect";
import { Schema as S } from "@effect/schema";

export const ClaudeTokenValue =
  S.NonEmptyString.pipe(S.brand("Claude.TokenValue"))

export class ClaudeToken extends
  Context.Tag("Claude.Token")<
    ClaudeToken, {
      value: typeof ClaudeTokenValue.Type
    }
  >() { }

export const ClaudeTokenLayerFromEnv =
  Layer.effect(
    ClaudeToken,
    pipe(
      Config.string("CLAUDE_TOKEN"),
      Effect.andThen(value =>
        ClaudeToken.of({
          value: ClaudeTokenValue.make(value)
        })
      )
    )
  )
