import { Config, Context, Effect, Layer, pipe, Redacted } from "effect";

export class GptTokenProvider
  extends Context.Tag("GptTokenProvider")<GptTokenProvider, Redacted.Redacted<string>>() {

  static fromEnv =
    Layer.effect(
      GptTokenProvider,
      pipe(
        Config.string("GPT_TOKEN"),
        Effect.andThen(Redacted.make)
      )
    )

} { };
