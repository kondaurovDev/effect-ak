import * as S from "effect/Schema";
import * as Effect from "effect/Effect";

import { chatCompletionProviders } from "./const.js";

export type ProviderName = typeof ProviderName.Type;
export const ProviderName = 
  S.Literal(...chatCompletionProviders);

export const GenerativeModelName =
  S.Struct({
    provider: ProviderName,
    modelName: S.NonEmptyString.pipe(S.optional)
  });

export type ChatCompletionInterface = {
  readonly provider: typeof ProviderName.Type,
  complete(
    _: {
      model: typeof GenerativeModelName.Type.modelName,
      systemMessage: string,
      userMessage: string
    }
  ): Effect.Effect<string, unknown>
}
