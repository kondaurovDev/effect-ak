import { HttpClient, HttpBody, HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { Effect, Data, Context, pipe } from "effect";
import { Schema as S } from "@effect/schema"

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

export class ClientCredentialsValue
  extends S.Class<ClientCredentialsValue>("ClientCredentials")({
    clientId: S.NonEmptyString,
    clientSecret: S.NonEmptyString,
    scopes: S.NonEmptyArray(S.NonEmptyString),
    redirectUri: S.NonEmptyString
  }) { }

export const ClientCredentials =
  Context.GenericTag<ClientCredentialsValue>("Google.OAuthCredentials");

export class AuthUrlError extends Data.TaggedError("Google.AuthUrlError")<{
  message: string
}> { }

// https://developers.google.com/identity/protocols/oauth2/web-server#creatingclient
// scopes https://developers.google.com/identity/protocols/oauth2/scopes
export const getAuthUrl =
  Effect.Do.pipe(
    Effect.bind("credentials", () => ClientCredentials),
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

//https://oauth2.googleapis.com/token
export const refreshAccessToken = (
  refreshToken: string
) =>
  Effect.Do.pipe(
    Effect.bind("clientCredentials", () => ClientCredentials),
    Effect.bind("httpClient", () => HttpClient.HttpClient),
    Effect.let("formData", ({ clientCredentials }) => {
      const result = new FormData();
      result.append("client_id", clientCredentials.clientId);
      result.append("client_secret", clientCredentials.clientSecret);
      result.append("refresh_token", refreshToken);
      result.append("grant_type", "refresh_token");
      return HttpBody.formData(result)
    }),
    Effect.andThen(({ httpClient, formData }) =>
      pipe(
        httpClient(
          HttpClientRequest.post(
            "https://oauth2.googleapis.com/token", {
            body: formData
          }
          )
        ),
        Effect.andThen(response =>
          pipe(
            response.json,
            Effect.tap(resp => Effect.logDebug("auth response", resp, response.status)),
            Effect.andThen(
              S.validate(AuthResponse)
            )
          )
        )
      )
    ),
    Effect.scoped
  )

// exchange
// https://developers.google.com/identity/protocols/oauth2/web-server#exchange-authorization-code

export const exchangeCode = (
  code: string
) =>
  Effect.Do.pipe(
    Effect.bind("credentials", () => ClientCredentials),
    Effect.bind("httpClient", () => HttpClient.HttpClient),
    Effect.let("formData", ({ credentials }) => {
      const result = new FormData();
      result.append("client_id", credentials.clientId);
      result.append("client_secret", credentials.clientSecret);
      result.append("code", code);
      result.append("grant_type", "authorization_code");
      result.append("redirect_uri", credentials.redirectUri);
      return HttpBody.formData(result)
    }),
    Effect.andThen(({ httpClient, formData }) =>
      httpClient(
        HttpClientRequest.post(
          "https://oauth2.googleapis.com/token", {
          body: formData
        }
        )
      ).pipe(
        Effect.tap(resp => Effect.andThen(resp.json, Effect.logDebug)),
        Effect.andThen(HttpClientResponse.schemaBodyJson(AuthResponse))
      )
    ),
    Effect.scoped
  )

