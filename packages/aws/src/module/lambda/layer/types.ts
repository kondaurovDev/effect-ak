import * as S from "effect/Schema";

export type FunctionLayer = typeof FunctionLayer.Type
export const FunctionLayer =
  S.Struct({
    name: S.String,
    dependencies:
      S.NonEmptyArray(
        S.NonEmptyString
      )
  });
