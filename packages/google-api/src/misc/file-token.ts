import { Config, DateTime, Effect, Match, pipe, Redacted } from "effect";
import * as S from "effect/Schema";
import { FileSystem } from "@effect/platform";

import { OAuth2Service, AuthResponse } from "../api/index.js"
import { configPathConfigKey, moduleName } from "../const.js";

type TokenFile = typeof TokenFile.Type
const TokenFile =
  S.Struct({
    refreshToken: S.NonEmptyString.pipe(S.Redacted),
    lastRefresh: S.DateTimeUtc.pipe(S.NullishOr),
    authResponse: AuthResponse.pipe(S.NullishOr)
  })

export class AccessTokenFromFile
  extends Effect.Service<AccessTokenFromFile>()("AccessTokenFromFile", {
    effect:
      Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        const oauth2 = yield* OAuth2Service;
        
        const tokenFilePath =
          pipe(
            Config.nonEmptyString(configPathConfigKey),
            Config.nested(moduleName)
          );

        const fileEffect =
          pipe(
            tokenFilePath,
            Effect.andThen(fs.readFileString),
            Effect.andThen(S.decode(S.parseJson(TokenFile), { onExcessProperty: "preserve" }))
          )

        const saveResponse = (
          authResponse: AuthResponse
        ) =>
          pipe(
            Effect.all({
              filePath: tokenFilePath,
              current: fileEffect,
            }),
            Effect.andThen(({ current, filePath }) =>
              fs.writeFileString(
                filePath,
                JSON.stringify({
                  ...current,
                  refreshToken: Redacted.value(current.refreshToken) as any,
                  lastRefresh: DateTime.unsafeNow(),
                  authResponse: {
                    ...authResponse,
                    access_token: Redacted.value(authResponse.access_token) as any,
                  }
                } as TokenFile, undefined, 2)
              )
            ),
            Effect.andThen(() => authResponse)
          )

        const refreshAccessTokenAndSave =
          pipe(
            fileEffect,
            Effect.andThen(currentFile =>
              oauth2.refreshAccessToken(currentFile.refreshToken),
            ),
            Effect.andThen(saveResponse),
            Effect.andThen(_ => _.access_token)
          )

        const accessToken =
          pipe(
            fileEffect,
            Effect.andThen(tokenFile =>
              pipe(
                Match.value(tokenFile),
                Match.when(({
                  lastRefresh: Match.defined,
                  authResponse: Match.defined
                }), ({ lastRefresh, authResponse }) =>
                  DateTime.lessThanOrEqualTo(
                    DateTime.unsafeNow(),
                    DateTime.addDuration(`${authResponse.expires_in} seconds`)(lastRefresh)
                  ) ?
                    Effect.succeed(authResponse.access_token) :
                    refreshAccessTokenAndSave
                ),
                Match.orElse(() => refreshAccessTokenAndSave)
              )
            )
          )

        return {
          refreshAccessTokenAndSave, accessToken, saveResponse
        }

      }),

    dependencies: [
      OAuth2Service.Default
    ]

  }) { }
