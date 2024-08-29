// https://developers.google.com/identity/protocols/oauth2/service-account

import { Effect, pipe, Context, Redacted } from "effect";
import { JWT } from "google-auth-library";
import { Schema as S } from "@effect/schema"

export const CredentialsSchema =
  S.Struct({
    client_email: S.NonEmptyString,
    private_key: S.Redacted(S.NonEmptyString)
  })

export class AccountCredentials
  extends Context.Tag("ServiceAccountCredentials")<
    AccountCredentials, typeof CredentialsSchema.Type
  >() { };

export const getServiceAccountAccessToken =
  pipe(
    AccountCredentials,
    Effect.andThen((cred) => {
      const token = new JWT({
        email: cred.client_email,
        key: Redacted.value(cred.private_key),
        scopes: [
          "https://www.googleapis.com/auth/calendar.events",
          "https://www.googleapis.com/auth/calendar",
          "https://www.googleapis.com/auth/drive"
        ]
      })
      return pipe(
        Effect.tryPromise(() => token.authorize()),
        Effect.tap(response =>
          Effect.logDebug("service account auth response", response)
        ),
        Effect.cachedWithTTL("3000 seconds"),
        Effect.flatten,
        Effect.andThen(result =>
          Effect.fromNullable(result.access_token)
        )
      )
    })
  )
