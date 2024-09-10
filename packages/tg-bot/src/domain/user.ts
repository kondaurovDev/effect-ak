import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

export const User =
  S.Struct({
    id: S.Number,
    first_name: S.NonEmptyString,
    username: S.optional(S.NonEmptyString),
    is_bot: S.Boolean
  }).annotations({
    identifier: "TgUser"
  });

export const getUserName = (
  from: typeof User.Type | undefined
) =>
  pipe(
    from?.username ?? from?.first_name ?? "anonym",
    name => name.toLocaleLowerCase()
  )