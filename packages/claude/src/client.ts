import { Layer, pipe, Effect, Context, Redacted } from "effect";
import { HttpClient, HttpClientError, HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { Schema as S, ParseResult } from "@effect/schema";
import * as Shared from "@efkit/shared";

import { ClaudeToken } from "./token.js"

export type ValidJsonError =
  HttpClientError.HttpClientError | Shared.JsonError | ParseResult.ParseError

export type JsonError =
  HttpClientError.HttpClientError | Shared.JsonError

export type RestClientService = (
  request: HttpClientRequest.HttpClientRequest
) => {
  buffer: Effect.Effect<ArrayBuffer, HttpClientError.HttpClientError, ClaudeToken>,
  json: Effect.Effect<Shared.ParsedJson, JsonError, ClaudeToken>
  validJson: <I>(_: S.Schema<I>) => Effect.Effect<I, ValidJsonError, ClaudeToken>
}

export class RestClient extends
  Context.Tag("Claude.RestClient")<RestClient, RestClientService>() { };

export const RestClientLive =
  Layer.effect(
    RestClient,
    Effect.Do.pipe(
      Effect.bind("httpClient", () =>
        HttpClient.HttpClient
      ),
      Effect.let("baseUrl", () => "https://api.anthropic.com/"),
      Effect.let("client", ({ httpClient, baseUrl }) =>
        httpClient.pipe(
          HttpClient.mapRequest(
            HttpClientRequest.setHeaders({
              "anthropic-version": "2023-06-01"
            })
          ),
          HttpClient.mapRequest(
            HttpClientRequest.prependUrl(baseUrl)
          ),
          HttpClient.transformResponse(
            HttpClientResponse.arrayBuffer
          ),
        ),
      ),
      Effect.let("getBuffer", ({ client }) =>
        (request: HttpClientRequest.HttpClientRequest) =>
          Effect.suspend(() =>
            pipe(
              ClaudeToken,
              Effect.andThen(token =>
                client(HttpClientRequest.setHeader("x-api-key", Redacted.value(token))(request))
              ),
              Effect.scoped,
            )
          )
      ),
      Effect.let("getJson", ({ client }) =>
        (request: HttpClientRequest.HttpClientRequest) =>
          Effect.suspend(() =>
            pipe(
              ClaudeToken,
              Effect.andThen(token =>
                client(HttpClientRequest.setHeader("x-api-key", Redacted.value(token))(request))
              ),
              Effect.andThen(_ =>
                Buffer.from(_).toString()
              ),
              Effect.andThen(
                Shared.parseJson
              ),
              Effect.scoped,
            ),
          )
      ),
      Effect.andThen(({ getBuffer, getJson }) =>
        RestClient.of(
          request => ({
            buffer: getBuffer(request),
            json: getJson(request),
            validJson: schema =>
              pipe(
                getJson(request),
                Effect.andThen(json =>
                  S.validate(schema)(json)
                )
              )
          })
        )
      )
    )
  ).pipe(
    Layer.provide(HttpClient.layer)
  )


