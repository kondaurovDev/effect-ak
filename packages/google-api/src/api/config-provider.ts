import { Config, Effect, Either, pipe, Redacted, Array, Layer } from "effect";
import { InvalidData } from "effect/ConfigError";

import { authScopePrefix, moduleName } from "../const.js";

import { OAuth2ClientCredentials } from "./schema.js";

export class GoogleUserAccessTokenProvider
  extends Effect.Tag("GoogleUserAccessTokenProvider")<GoogleUserAccessTokenProvider, {
    getAccessToken: (userId: string | undefined) => Effect.Effect<Redacted.Redacted<string>, unknown>
  }>() { }

export class GoogleOAuth2ClientCredentialsProvider
  extends Effect.Tag("GoogleOAuth2ClientCredentialsProvider")<GoogleOAuth2ClientCredentialsProvider, {
    readonly credentials: OAuth2ClientCredentials
  }>() {

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
                Either.right(
                  _.split(",").map(_ => `${authScopePrefix}/${_}`)
                ),
                Either.filterOrLeft(
                  _ => Array.isNonEmptyArray(_),
                  () => InvalidData(["scopes"], "scopes must not be empty")
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
        ),
        Config.nested(moduleName)
      )

    return Layer.effect(
      GoogleOAuth2ClientCredentialsProvider,
      pipe(
        config,
        Effect.andThen(_ =>
          GoogleOAuth2ClientCredentialsProvider.of({
            credentials: _
          })
        )
      )
    )

  }

}
