import { Effect } from "effect";
import * as S from "effect/Schema"

export const availableProviders = ["openai", "anthropic"] as const;

export type ProviderName = typeof ProviderName.Type;
export const ProviderName = 
  S.Literal(...availableProviders).pipe(S.brand("ProviderName"));

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
