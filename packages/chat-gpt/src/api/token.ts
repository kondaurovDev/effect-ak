import { Brand, Config, Context, Effect, Layer, pipe, Redacted } from "effect";

export type GptToken = Brand.Branded<Redacted.Redacted<string>, "GptToken">;
export const GptToken = Brand.nominal<GptToken>();

export class GptTokenProvider
  extends Context.Tag("GptTokenProvider")<GptTokenProvider, GptToken>() {

  static fromEnv =
    Layer.effect(
      GptTokenProvider,
      pipe(
        Config.string("GPT_TOKEN"),
        Effect.andThen(_ => GptToken(Redacted.make(_)))
      )
    )

} { };
