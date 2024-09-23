import { Context, Effect, Layer, Data, ConfigError, pipe } from "effect";
import { HttpBody, HttpClient, HttpClientError, HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { Schema as S, ParseResult } from "@effect/schema";

import { GoogleUserAccessToken } from "./auth/common.js"

export class ClientError
  extends Data.TaggedError("Google.RestError")<{
    cause:
    HttpClientError.HttpClientError |
    ParseResult.ParseError |
    ConfigError.ConfigError
  }> { }

type GoogleApiRestClientService = {
  token: (
    body: HttpBody.HttpBody
  ) => Effect.Effect<object, ClientError>
  execute: (
    baseUrl: BaseUrlDomain,
    request: HttpClientRequest.HttpClientRequest
  ) => Effect.Effect<object, ClientError, GoogleUserAccessToken>
}

export type BaseUrlDomain = keyof typeof baseUrlMap;

const baseUrlMap = {
  apis: "www.googleapis.com",
  sheets: "sheets.googleapis.com",
  people: "people.googleapis.com",
  tasks: "tasks.googleapis.com"
} as const;

export class GoogleApiRestClient
  extends Context.Tag(`Google.RestClient`)<GoogleApiRestClient, GoogleApiRestClientService>() { };

export const GoogleApiRestClientLive =
  Layer.scoped(
    GoogleApiRestClient,
    pipe(
      Effect.Do,
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
          HttpClient.mapEffect(
            HttpClientResponse.schemaBodyJson(S.Object)
          ),
          HttpClient.catchAll(error =>
            new ClientError({ cause: error })
          )
        )
      ),
      Effect.andThen(client =>
        GoogleApiRestClient.of({
          token: (body) =>
            pipe(
              client.execute(
                HttpClientRequest.post(
                  "https://oauth2.googleapis.com/token", {
                    body
                  }
                )
              ),
              Effect.scoped
            ),
          execute: (
            baseUrl: BaseUrlDomain,
            request: HttpClientRequest.HttpClientRequest
          ) =>
            pipe(
              GoogleUserAccessToken,
              Effect.andThen(token =>
                client.execute(
                  pipe(
                    HttpClientRequest.setHeader("Authorization", `Bearer ${token}`)(request),
                    HttpClientRequest.prependUrl("https://" + baseUrlMap[baseUrl])
                  )
                )
              ),
              Effect.scoped
            )
        })
      )
    )
  )
