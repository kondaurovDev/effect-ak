import { pipe } from "effect";
import * as S from "effect/Schema";

export const AuthorizerResultTtlInSeconds =
  pipe(
    S.Number,
    S.optional
  ).annotations({
    title: "AuthorizerResultTtlInSeconds",
    description:
      [
        "The time to live (TTL) for cached authorizer results, in seconds",
        "If it equals 0, authorization caching is disabled",
        "If it is greater than 0, API Gateway caches authorizer responses"
      ].join("\n")
  });

export const IdentitySource =
  pipe(
    S.String.pipe(S.NonEmptyArray),
    S.optional
  ).annotations({
    title: "IdentitySource"
  });
