import { Layer, pipe, Effect, Context, Redacted } from "effect";
import { HttpClient, HttpClientError, HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { Schema as S, ParseResult } from "@effect/schema";
import * as Shared from "@efkit/shared";
import { GptToken } from "./token.js";

export type ValidJsonError =
  HttpClientError.HttpClientError | Shared.JsonError | ParseResult.ParseError

export type JsonError =
  HttpClientError.HttpClientError | Shared.JsonError

export type OpenaiRestClientService = (
  request: HttpClientRequest.HttpClientRequest
) => {
  buffer: Effect.Effect<ArrayBuffer, HttpClientError.HttpClientError, GptToken>,
  json: Effect.Effect<Shared.ParsedJson, JsonError, GptToken>
  validJson: <I>(_: S.Schema<I>) => Effect.Effect<I, ValidJsonError, GptToken>
}

export class OpenaiRestClient
  extends Context.Tag("Gpt.RestClient")<OpenaiRestClient, OpenaiRestClientService>() {};

  export const OpenaiRestClientLive =
    Layer.scoped(
      OpenaiRestClient,
      pipe(
        Effect.Do,
        Effect.bind("httpClient", () => HttpClient.HttpClient),
        Effect.let("baseUrl", () => "https://api.openai.com"),
        Effect.let("restClient", ({ httpClient, baseUrl }) =>
          httpClient.pipe(
            HttpClient.mapRequest(
              HttpClientRequest.prependUrl(baseUrl)
            ),
            HttpClient.transformResponse(
              HttpClientResponse.arrayBuffer
            )
          )
        ),
        Effect.let("getBuffer", ({ restClient }) =>
          (request: HttpClientRequest.HttpClientRequest) => {
            return Effect.suspend(() =>
              pipe(
                GptToken,
                Effect.andThen(token =>
                  restClient(
                    HttpClientRequest.setHeader("Authorization", `Bearer ${Redacted.value(token)}`)(request)
                  )
                ),
                Effect.scoped,
              )
            )
          }
        ),
        Effect.let("getJson", ({ restClient }) =>
          (request: HttpClientRequest.HttpClientRequest) =>
            Effect.suspend(() =>
              pipe(
                GptToken,
                Effect.andThen(token =>
                  restClient(
                    HttpClientRequest.setHeader("Authorization", `Bearer ${Redacted.value(token)}`)(request)
                  )
                ),
                Effect.andThen(_ =>
                  Buffer.from(_).toString()
                ),
                Effect.andThen(Shared.parseJson)
              ),
            )
        ),
        Effect.andThen(({ getBuffer, getJson }) =>
          OpenaiRestClient.of(
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