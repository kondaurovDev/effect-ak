import { Config, Context, Effect, Layer, pipe } from "effect";

export class GptToken extends
  Context.Tag("GPT.GptToken")<
    GptToken, {
      value: string
    }
  >() {};

export const GptTokenFromEnvLive =
  Layer.effect(
    GptToken,
    pipe(
      Config.string("OPENAI_TOKEN"),
      Effect.andThen(token =>
        GptToken.of({
          value: token
        })
      )
    )
  )
