import { Layer, pipe, Effect, Context, Config, Brand } from "effect";

export type ClaudeTokenValue = string & Brand.Brand<"ClaudeTokenValue">
export const ClaudeTokenValue = Brand.nominal<ClaudeTokenValue>()

export const ClaudeToken = 
  Context.GenericTag<ClaudeTokenValue>("Claude.Token");

export const ClaudeTokenLayerFromEnv =
  Layer.effect(
    ClaudeToken,
    pipe(
      Config.string("CLAUDE_TOKEN"),
      Effect.andThen(token =>
        ClaudeToken.of(ClaudeTokenValue(token))
      )
    )
  )
