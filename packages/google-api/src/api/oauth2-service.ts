import { HttpBody, HttpClientRequest } from "@effect/platform";
import { Effect, pipe, Redacted } from "effect";
import * as S from "effect/Schema";

import { AuthResponse } from "./schema.js";
import { GoogleApiHttpClient } from "./http-client.js";
import { GoogleOAuth2ClientCredentialsProvider } from "./config-provider.js";

export class OAuth2Service
  extends Effect.Service<OAuth2Service>()("Google.OAuthService", {
    effect:
      Effect.gen(function* () {

        const httpClient = yield* GoogleApiHttpClient;
        const { credentials } = yield* GoogleOAuth2ClientCredentialsProvider;

        const authUrl =
          pipe(
            new URLSearchParams({
              client_id: credentials.clientId,
              redirect_uri: credentials.redirectUri,
              response_type: "code",
              access_type: "offline",
              scope: credentials.scopes.join(" ")
            }).toString(),
            params =>
              `https://accounts.google.com/o/oauth2/v2/auth?${params}`
          )

        const refreshAccessToken = (
          token: Redacted.Redacted<string>
        ) =>
          pipe(
            Effect.Do,
            Effect.let("httpBody", () => {
              const result = new FormData();
              result.append("client_id", credentials.clientId);
              result.append("client_secret", Redacted.value(credentials.clientSecret));
              result.append("refresh_token", Redacted.value(token));
              result.append("grant_type", "refresh_token");
              return HttpBody.formData(result)
            }),
            Effect.andThen(({ httpBody }) =>
              httpClient.execute(
                HttpClientRequest.post(
                  "https://oauth2.googleapis.com/token",
                  { body: httpBody }
                )
              )
            ),
            Effect.andThen(S.decodeUnknown(AuthResponse))
          )

        const exchangeCode = (
          code: string
        ) =>
          pipe(
            Effect.Do,
            Effect.let("httpBody", () => {
              const result = new FormData();
              result.append("client_id", credentials.clientId);
              result.append("client_secret", Redacted.value(credentials.clientSecret));
              result.append("code", code);
              result.append("grant_type", "authorization_code");
              result.append("redirect_uri", credentials.redirectUri);
              return HttpBody.formData(result)
            }),
            Effect.andThen(({ httpBody }) =>
              httpClient.execute(
                HttpClientRequest.post(
                  "https://oauth2.googleapis.com/token",
                  { body: httpBody }
                )
              )
            ),
            Effect.andThen(S.decodeUnknown(AuthResponse))
          )

        return {
          exchangeCode, refreshAccessToken, authUrl
        } as const;
      }),

      dependencies: [
        GoogleApiHttpClient.Default
      ]
  }) { };
