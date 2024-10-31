import { Effect } from "effect";
import * as S from "effect/Schema";

import { chatCompletionProviders } from "../const.js";

export type ProviderName = typeof ProviderName.Type;
export const ProviderName = 
  S.Literal(...chatCompletionProviders).pipe(S.brand("ChatCompletionProviderName"));

export const GenerativeModelName =
  S.Struct({
    provider: ProviderName,
    modelName: S.NonEmptyString.pipe(S.optional)
  });

export type ChatCompletionInterface = {
  readonly provider: typeof ProviderName.Type,
  complete(
    _: {
      model: typeof GenerativeModelName.Type,
      systemMessage: string,
      userMessage: string
    }
  ): Effect.Effect<string, unknown>
}
