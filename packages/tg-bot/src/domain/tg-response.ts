import { Schema as S } from "@effect/schema";

export type TgResponse =
  typeof TgResponse.Type;

export const TgResponse =
  S.Struct({
    ok: S.Boolean,
    error_code: S.optional(S.Number),
    description: S.optional(S.String),
    result: S.optional(S.Unknown)
  });
