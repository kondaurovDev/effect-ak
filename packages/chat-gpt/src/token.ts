import { Config, Context, Effect, Layer, pipe, Redacted } from "effect";

export class GptToken
  extends Context.Tag("OpenAi.Token")<GptToken, Redacted.Redacted<string>>() {

  static createLayerFromConfig() {
    return (
      Layer.effect(
        GptToken,
        pipe(
          Config.string("OPENAI_TOKEN"),
          Effect.andThen(token =>
            GptToken.of(Redacted.make(token))
          )
        )
      )
    )
  }

};


