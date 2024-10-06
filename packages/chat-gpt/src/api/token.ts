import { Config, Context, Effect, Layer, pipe, Redacted } from "effect";

export class TokenProvider
  extends Context.Tag("OpenAi.Token")<TokenProvider, Redacted.Redacted<string>>() {

  static live =
    Layer.effect(
      TokenProvider,
      pipe(
        Config.string("OPENAI_TOKEN"),
        Effect.andThen(token =>
          TokenProvider.of(Redacted.make(token))
        )
      )
    )
};


