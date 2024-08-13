import { Layer, pipe, Effect, Context } from "effect";
import { HttpClient, HttpClientError, HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { Schema as S, ParseResult } from "@effect/schema";
import * as Shared from "@efkit/shared";
import { GptToken } from "./token.js";

export type ValidJsonError =
  HttpClientError.HttpClientError | Shared.JsonError | ParseResult.ParseError

export type JsonError =
  HttpClientError.HttpClientError | Shared.JsonError

export type RestClient = (
  request: HttpClientRequest.HttpClientRequest
) => {
  buffer: Effect.Effect<ArrayBuffer, HttpClientError.HttpClientError>,
  json: Effect.Effect<Shared.ParsedJson, JsonError>
  validJson: <I>(_: S.Schema<I>) => Effect.Effect<I, ValidJsonError>
}

export const RestClient =
  Context.GenericTag<RestClient>("Gpt.RestClient");

export const RestClientLayer =
  Layer.effect(
    RestClient,
    Effect.Do.pipe(
      Effect.bind("httpClient", () => HttpClient.HttpClient),
      Effect.bind("gptToken", () => GptToken),
      Effect.let("baseUrl", () => "https://api.openai.com"),
      Effect.let("gptClient", ({ httpClient, baseUrl, gptToken }) =>
        httpClient.pipe(
          HttpClient.mapRequest(
            HttpClientRequest.setHeader(
              "Authorization", `Bearer ${gptToken.value}`
            )
          ),
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
      Effect.let("getBuffer", ({ gptClient }) =>
        (request: HttpClientRequest.HttpClientRequest) =>
          Effect.suspend(() =>
            pipe(
              gptClient(request),
              Effect.scoped,
            )
          )
      ),
      Effect.let("getJson", ({ gptClient }) =>
        (request: HttpClientRequest.HttpClientRequest) =>
          Effect.suspend(() =>
            pipe(
              gptClient(request),
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
