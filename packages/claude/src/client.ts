import { Layer, pipe, Effect, Context, Redacted } from "effect";
import { HttpClient, HttpClientError, HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { Schema as S, ParseResult } from "@effect/schema";
import * as Shared from "@efkit/shared";

import { ClaudeToken, ClaudeTokenValue } from "./token.js"

export type ValidJsonError =
  HttpClientError.HttpClientError | Shared.JsonError | ParseResult.ParseError

export type JsonError =
  HttpClientError.HttpClientError | Shared.JsonError

export type RestClient = (
  request: HttpClientRequest.HttpClientRequest
) => {
  buffer: Effect.Effect<ArrayBuffer, HttpClientError.HttpClientError, ClaudeTokenValue>,
  json: Effect.Effect<Shared.ParsedJson, JsonError, ClaudeTokenValue>
  validJson: <I>(_: S.Schema<I>) => Effect.Effect<I, ValidJsonError, ClaudeTokenValue>
}

export const RestClient =
  Context.GenericTag<RestClient>("Claude.RestClient");

export const RestClientLayer =
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
  )

export const RestClientLive = 
  pipe(
    RestClientLayer,
    Layer.provide(HttpClient.layer)
  );
