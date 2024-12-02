import * as S from "effect/Schema";

export type LambdaFunctionSourceCode =
  typeof LambdaFunctionSourceCode.Type

export const LambdaFunctionSourceCode =
  S.Union(
    S.Struct({
      type: S.Literal("inline"),
      code: S.NonEmptyString
    }),
    S.Struct({
      type: S.Literal("file"),
      path: S.NonEmptyString.pipe(S.NonEmptyArray),
      external: S.NonEmptyString.pipe(S.Array, S.optional),
      minify: S.Boolean.pipe(S.optional)
    })
  );
