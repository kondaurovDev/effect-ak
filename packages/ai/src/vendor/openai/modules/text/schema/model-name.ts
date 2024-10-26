import * as S from "effect/Schema";

export type GptModelName = typeof GptModelName.Type
export const GptModelName = S.Literal("gpt-4o", "gpt-4o-mini")

export type ReasoningModelName = typeof ReasoningModelName.Type
export const ReasoningModelName = S.Literal("o1-mini", "o1-preview")

export type OneOfModelName = typeof OneOfModelName.Type;
export const OneOfModelName =
  S.Union(GptModelName, ReasoningModelName)
