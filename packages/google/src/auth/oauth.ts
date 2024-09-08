import { HttpBody } from "@effect/platform";
import { Effect, Data, Context, pipe, Redacted } from "effect";
import { Schema as S } from "@effect/schema"

import { GoogleApiRestClient } from "../client.js";

export type AuthResponse =
  typeof AuthResponse.Type

export const AuthResponse =
  S.Struct({
    access_token: S.String,
    expires_in: S.Number,
    scope: S.String,
    refresh_token: S.optional(S.Redacted(S.NonEmptyString)),
    token_type: S.Literal("Bearer")
  });

export class GoogleOAuthClientCredentialsContainer
  extends S.Class<GoogleOAuthClientCredentialsContainer>("Google.ClientCredentials")({
    clientId: S.NonEmptyString,
    clientSecret: S.Redacted(S.NonEmptyString),
    scopes: S.NonEmptyArray(S.NonEmptyString),
    redirectUri: S.NonEmptyString
  }) { }

export class GoogleOAuthClientCredentials 
  extends Context.Tag("Google.OAuthCredentials")<GoogleOAuthClientCredentials, GoogleOAuthClientCredentialsContainer>() {};

export class AuthUrlError extends Data.TaggedError("Google.AuthUrlError")<{
  message: string
}> { }

// https://developers.google.com/identity/protocols/oauth2/web-server#creatingclient
// scopes https://developers.google.com/identity/protocols/oauth2/scopes
export const getAuthUrl =
  Effect.Do.pipe(
    Effect.bind("credentials", () => GoogleOAuthClientCredentials),
    Effect.let("params", ({ credentials }) => (
      new URLSearchParams({
        client_id: credentials.clientId.toString(),
        redirect_uri: credentials.redirectUri,
        response_type: "code",
        access_type: "offline",
        scope: credentials.scopes.join(" ")
      }).toString()
    )),
    Effect.andThen(({ params }) =>
      `https://accounts.google.com/o/oauth2/v2/auth?${params}`
    )
  )

// https://developers.google.com/identity/protocols/oauth2/web-server#offline
export const refreshAccessToken = (
  refreshToken: string
) =>
  pipe(
    Effect.Do,
    Effect.bind("clientCredentials", () => GoogleOAuthClientCredentials),
    Effect.bind("restClient", () => GoogleApiRestClient),
    Effect.let("formData", ({ clientCredentials }) => {
      const result = new FormData();
      result.append("client_id", clientCredentials.clientId);
      result.append("client_secret", Redacted.value(clientCredentials.clientSecret));
      result.append("refresh_token", refreshToken);
      result.append("grant_type", "refresh_token");
      return HttpBody.formData(result)
    }),
    Effect.andThen(({ restClient, formData }) =>
      pipe(
        restClient.token(formData),
        Effect.andThen(S.decodeUnknown(AuthResponse))
      )
    )
  )

// exchange
// https://developers.google.com/identity/protocols/oauth2/web-server#exchange-authorization-code

export const exchangeCode = (
  code: string
) =>
  pipe(
    Effect.Do,
    Effect.bind("credentials", () => GoogleOAuthClientCredentials),
    Effect.bind("restClient", () => GoogleApiRestClient),
    Effect.let("formData", ({ credentials }) => {
      const result = new FormData();
      result.append("client_id", credentials.clientId);
      result.append("client_secret", Redacted.value(credentials.clientSecret));
      result.append("code", code);
      result.append("grant_type", "authorization_code");
      result.append("redirect_uri", credentials.redirectUri);
      return HttpBody.formData(result)
    }),
    Effect.andThen(({ restClient, formData }) =>
      pipe(
        restClient.token(formData),
        Effect.andThen(result => S.decodeUnknown(AuthResponse)(result)),
        Effect.tap(result =>
          Effect.logDebug("Code has been exchanged", result.token_type)
        )
      )
    )
  )
