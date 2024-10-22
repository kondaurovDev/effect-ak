import * as S from "effect/Schema";

export type TgResponse =
  typeof TgResponse.Type;

export const TgResponse =
  S.Struct({
    ok: S.Boolean,
    error_code: S.optional(S.Number),
    description: S.optional(S.String),
    result: S.optional(S.Unknown)
  });
