import { Schema as S, ParseResult } from "@effect/schema";
import { Config, Context, Effect, Layer, pipe } from "effect";

export const GptTokenValue =
  S.NonEmptyString.pipe(S.brand("GPT.TokenValue"))

export class GptToken extends
  Context.Tag("GPT.GptToken")<
    GptToken, {
      value: typeof GptTokenValue.Type
    }
  >() {};

export const GptTokenFromEnvLive =
  Layer.effect(
    GptToken,
    pipe(
      Config.string("OPENAI_TOKEN"),
      Effect.andThen(token =>
        GptToken.of({
          value: GptTokenValue.make(token)
        })
      )
    )
  )
