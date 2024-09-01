import { Context, Effect, Layer, Data, ConfigError, pipe } from "effect";
import { HttpClient, HttpClientError, HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { Schema as S, ParseResult } from "@effect/schema";

import { GoogleUserAccessToken } from "./auth/common.js"

export class ClientError
  extends Data.TaggedError("Google.RestError")<{
    cause:
    HttpClientError.HttpClientError |
    ParseResult.ParseError |
    ConfigError.ConfigError
  }> { }

type RestClientService = {
  execute: (
    baseUrl: BaseUrlDomain,
    request: HttpClientRequest.HttpClientRequest
  ) => Effect.Effect<unknown, ClientError, GoogleUserAccessToken>
}

export type BaseUrlDomain = keyof typeof baseUrlMap;

const baseUrlMap = {
  apis: "www.googleapis.com",
  sheets: "sheets.googleapis.com",
  people: "people.googleapis.com"
} as const;

export class RestClient
  extends Context.Tag(`Google.RestClient`)<RestClient, RestClientService>() {

  static readonly live =
    Layer.effect(
      RestClient,
      Effect.Do.pipe(
        Effect.bind("httpClient", () => HttpClient.HttpClient),
        Effect.andThen(({ httpClient }) =>
          httpClient.pipe(
            HttpClient.tapRequest(request =>
              Effect.logDebug("google request", request)
            ),
            HttpClient.tap(response =>
              pipe(
                response.text,
                Effect.andThen(body =>
                  Effect.logDebug("google integration response", body)
                )
              )
            ),
            HttpClient.filterStatusOk,
            HttpClient.mapEffectScoped(
              HttpClientResponse.schemaBodyJson(S.Unknown)
            ),
            HttpClient.catchAll(error =>
              new ClientError({ cause: error })
            )
          )
        ),
        Effect.andThen(client =>
          RestClient.of({
            execute: (
              baseUrl: BaseUrlDomain,
              request: HttpClientRequest.HttpClientRequest
            ) =>
              pipe(
                GoogleUserAccessToken,
                Effect.andThen(token =>
                  client(
                    pipe(
                      HttpClientRequest.setHeader("Authorization", `Bearer: ${token}`)(request),
                      HttpClientRequest.prependUrl("https://" + baseUrlMap[baseUrl])
                    )
                  )
                )
              )
          })
        )
      )
    ).pipe(
      Layer.provide(HttpClient.layer)
    );

};
