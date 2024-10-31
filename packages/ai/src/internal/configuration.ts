import { Config, pipe, Redacted, Option } from "effect";
import * as S from "effect/Schema";

import { ProviderName } from "../domain/chat-completion.js";

export class AIConfig
  extends S.Class<AIConfig>("AIConfig")({
    tokens: 
      S.Struct({
        anthropic: S.NonEmptyString.pipe(S.Redacted, S.UndefinedOr),
        openai: S.NonEmptyString.pipe(S.Redacted, S.UndefinedOr),
      })
  }) {

  static getConfig() {

    const tokenConfig = (
      provider: ProviderName
    ) =>
      pipe(
        Config.nonEmptyString(provider),
        Config.map(Redacted.make),
        Config.withDefault(undefined)
      );

    return pipe(
      Config.all({
        anthropic: tokenConfig(ProviderName.make("anthropic")),
        openai: tokenConfig(ProviderName.make("openai")),
      }),
      Config.map(all =>
        AIConfig.make({
          tokens: all
        })
      )
    );

  }

}