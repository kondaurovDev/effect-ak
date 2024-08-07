// https://developers.google.com/identity/protocols/oauth2/service-account

import { Effect, pipe, Context } from "effect";
import { Schema as S } from "@effect/schema"
import { JWT } from "google-auth-library";

const ServiceAccountCredentialsSchema = 
  S.Struct({
    client_email: S.NonEmptyString,
    private_key: S.NonEmptyString
  }).pipe(
    S.brand("ServiceAccountCredentials")
  )

const ServiceAccountCredentials =
  Context.GenericTag<typeof ServiceAccountCredentialsSchema.Type>("ServiceAccountCredentials");

export const getServiceAccountAccessToken =
  pipe(
    ServiceAccountCredentials,
    Effect.andThen((cred) => {
      const token = new JWT({
        email: cred.client_email,
        key: cred.private_key,
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
