import { Schema as S } from "@effect/schema"

export type GoogleUserAccessToken = typeof GoogleUserAccessToken.Type
export const GoogleUserAccessToken = S.NonEmptyString.pipe(S.Redacted, S.brand("GoogleUserAccessToken"))

export type GoogleUserRefreshToken = typeof GoogleUserRefreshToken.Type
export const GoogleUserRefreshToken = S.NonEmptyString.pipe(S.Redacted, S.brand("GoogleUserRefreshToken"))

export class AuthResponse
  extends S.Class<AuthResponse>("AuthResponse")({
    access_token: GoogleUserAccessToken,
    refresh_token: GoogleUserRefreshToken.pipe(S.optional),
    expires_in: S.Number,
    scope: S.String,
    token_type: S.Literal("Bearer"),
    id_token: S.String.pipe(S.optional)
  }) { }

export class OAuth2ClientCredentials
  extends S.Class<OAuth2ClientCredentials>("Google.ClientCredentials")({
    clientId: S.NonEmptyString,
    clientSecret: S.NonEmptyString.pipe(S.Redacted),
    scopes: S.NonEmptyArray(S.NonEmptyString),
    redirectUri: S.NonEmptyString
  }) { }

export class UserInfo
  extends S.Class<UserInfo>("UserInfo")({
    id: S.NonEmptyString,
    email: S.NonEmptyString,
    name: S.NonEmptyString
  }) { }