import { Layer, pipe, Effect, Context, Config } from "effect";
import { Schema as S } from "@effect/schema";

export type ClaudeTokenSchema =
  typeof ClaudeTokenSchema.Type

export const ClaudeTokenSchema =
  S.NonEmptyString.pipe(S.brand("ClaudeToken"))

export const ClaudeToken =
  Context.GenericTag<ClaudeTokenSchema>("Claude.Token");

export const ClaudeTokenLayerFromEnv = 
  Layer.effect(
    ClaudeToken,
    pipe(
      Config.string("CLAUDE_TOKEN"),
      Effect.andThen(value =>
        ClaudeToken.of(
          ClaudeTokenSchema.make(value)
        )
      )
    )
  )
