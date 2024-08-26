import { Layer, pipe, Effect, Context } from "effect";
import { HttpClient, HttpClientError, HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { Schema as S, ParseResult } from "@effect/schema";
import * as Shared from "@efkit/shared";
import { GptToken, GptTokenValue } from "./token.js";

export type ValidJsonError =
  HttpClientError.HttpClientError | Shared.JsonError | ParseResult.ParseError

export type JsonError =
  HttpClientError.HttpClientError | Shared.JsonError

export type RestClient = (
  request: HttpClientRequest.HttpClientRequest
) => {
  buffer: Effect.Effect<ArrayBuffer, HttpClientError.HttpClientError, GptTokenValue>,
  json: Effect.Effect<Shared.ParsedJson, JsonError, GptTokenValue>
  validJson: <I>(_: S.Schema<I>) => Effect.Effect<I, ValidJsonError, GptTokenValue>
}

export const RestClient =
  Context.GenericTag<RestClient>("Gpt.RestClient");

export const RestClientLayer =
  Layer.effect(
    RestClient,
    Effect.Do.pipe(
      Effect.bind("httpClient", () => HttpClient.HttpClient),
      Effect.let("baseUrl", () => "https://api.openai.com"),
      Effect.let("restClient", ({ httpClient, baseUrl }) =>
        httpClient.pipe(
          HttpClient.mapRequest(
            HttpClientRequest.prependUrl(baseUrl)
          ),
          HttpClient.tapRequest(
            Effect.logDebug
          ),
          HttpClient.transformResponse(
            HttpClientResponse.arrayBuffer
          ),
        ),
      ),
      Effect.let("getBuffer", ({ restClient }) =>
        (request: HttpClientRequest.HttpClientRequest) => {
          return Effect.suspend(() =>
            pipe(
              GptToken,
              Effect.andThen(token =>
                restClient(
                  HttpClientRequest.setHeader("Authorization", `Bearer ${token}`)(request)
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
                  HttpClientRequest.setHeader("Authorization", `Bearer ${token}`)(request)
                )
              ),
              Effect.andThen(_ =>
                Buffer.from(_).toString()
              ),
              Effect.tap(Effect.logDebug),
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
