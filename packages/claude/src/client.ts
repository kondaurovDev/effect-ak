import { Layer, pipe, Effect, Context, Redacted } from "effect";
import { HttpClient, HttpClientError, HttpClientRequest } from "@effect/platform";
import { Schema as S, ParseResult } from "@effect/schema";
import { UtilError } from "@efkit/shared/utils";
import { ParsedJson, parseJson } from "@efkit/shared/utils";

import { ClaudeToken } from "./token.js"

export type ValidJsonError =
  HttpClientError.HttpClientError | UtilError | ParseResult.ParseError

export type JsonError =
  HttpClientError.HttpClientError | UtilError

export type ClaudeRestClientService = (
  request: HttpClientRequest.HttpClientRequest
) => {
  buffer: Effect.Effect<ArrayBuffer, HttpClientError.HttpClientError, ClaudeToken>,
  json: Effect.Effect<ParsedJson, JsonError, ClaudeToken>
  validJson: <I>(_: S.Schema<I>) => Effect.Effect<I, ValidJsonError, ClaudeToken>
}

export class ClaudeRestClient extends
  Context.Tag("Claude.RestClient")<ClaudeRestClient, ClaudeRestClientService>() { };

export const RestClientLive =
  Layer.scoped(
    ClaudeRestClient,
    pipe(
      Effect.Do,
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
          HttpClient.mapEffect(_ => _.arrayBuffer)
        ),
      ),
      Effect.let("getBuffer", ({ client }) =>
        (request: HttpClientRequest.HttpClientRequest) =>
          pipe(
            ClaudeToken,
            Effect.andThen(token =>
              client.execute(HttpClientRequest.setHeader("x-api-key", Redacted.value(token))(request))
            ),
            Effect.andThen(Buffer.from),
            Effect.scoped,
          )
      ),
      Effect.let("getJson", ({ client }) =>
        (request: HttpClientRequest.HttpClientRequest) =>
          pipe(
            ClaudeToken,
            Effect.andThen(token =>
              client.execute(HttpClientRequest.setHeader("x-api-key", Redacted.value(token))(request))
            ),
            Effect.andThen(Buffer.from),
            Effect.andThen(_ => _.toString()),
            Effect.andThen(parseJson),
            Effect.scoped,
          ),
      ),
      Effect.andThen(({ getBuffer, getJson }) =>
        ClaudeRestClient.of(
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


