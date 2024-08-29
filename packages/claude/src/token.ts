import { Layer, pipe, Effect, Context, Config, Brand, Redacted } from "effect";

export type ClaudeTokenValue = Redacted.Redacted<string> & Brand.Brand<"ClaudeTokenValue">
export const ClaudeTokenValue = Brand.nominal<ClaudeTokenValue>()

export const ClaudeToken = 
  Context.GenericTag<ClaudeTokenValue>("Claude.Token");

export const ClaudeTokenLayerFromEnv =
  Layer.effect(
    ClaudeToken,
    pipe(
      Config.string("CLAUDE_TOKEN"),
      Effect.andThen(token =>
        ClaudeToken.of(ClaudeTokenValue(Redacted.make(token)))
      )
    )
  )
