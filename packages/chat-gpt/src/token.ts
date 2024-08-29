import { Brand, Config, Context, Effect, Layer, pipe, Redacted } from "effect";

export type GptTokenValue = Redacted.Redacted<string> & Brand.Brand<"GptTokenValue">
export const GptTokenValue = Brand.nominal<GptTokenValue>()

export const GptToken = Context.GenericTag<GptTokenValue>("OpenAi.Token");

export const GptTokenFromEnvLive =
  Layer.effect(
    GptToken,
    pipe(
      Config.string("OPENAI_TOKEN"),
      Effect.andThen(token =>
        GptToken.of(GptTokenValue(Redacted.make(token)))
      )
    )
  )
