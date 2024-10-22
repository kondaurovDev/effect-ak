import { Config, pipe, Either, Array } from "effect";
import { InvalidData } from "effect/ConfigError";
import * as S from "effect/Schema";

export class AuthResponse
  extends S.Class<AuthResponse>("AuthResponse")({
    access_token: S.NonEmptyString.pipe(S.Redacted),
    refresh_token: S.NonEmptyString.pipe(S.Redacted, S.optional),
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
  }) {

  static fromConfig() {
    const config =
      pipe(
        Config.all([
          Config.nonEmptyString("clientId"),
          Config.redacted("clientSecret"),
          Config.nonEmptyString("redirectUri"),
          pipe(
            Config.nonEmptyString("scopes"),
            Config.mapOrFail(_ =>
              pipe(
                Either.right(_.split(",")),
                Either.filterOrLeft(
                  _ => Array.isNonEmptyArray(_),
                  () => InvalidData([ "scopes" ], "scopes must not be empty")
                )
              )
            )
          )
        ]),
        Config.map(([ clientId, clientSecret, redirectUri, scopes ]) =>
          OAuth2ClientCredentials.make({
            clientId, clientSecret, redirectUri,
            scopes
          })
        )
      )

    return Config.nested(config, "efkitGoogle");
  
  }


}

export class UserInfo
  extends S.Class<UserInfo>("UserInfo")({
    id: S.NonEmptyString,
    email: S.NonEmptyString,
    name: S.NonEmptyString
  }) { }