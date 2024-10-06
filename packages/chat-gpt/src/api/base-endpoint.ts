import { Layer, pipe, Effect, Context, Redacted } from "effect";
import { FetchHttpClient, HttpClient, HttpClientError, HttpClientRequest } from "@effect/platform";
import { Schema as S, ParseResult } from "@effect/schema";
import { UtilError } from "@efkit/shared/utils";
import { ParsedJson, parseJson } from "@efkit/shared/utils";

import { TokenProvider } from "./token.js";

export type ValidJsonError =
  HttpClientError.HttpClientError | UtilError | ParseResult.ParseError

export type JsonError =
  HttpClientError.HttpClientError | UtilError

export type BaseEndpointInterface = {
  execute(_: HttpClientRequest.HttpClientRequest): {
    buffer: Effect.Effect<ArrayBuffer, HttpClientError.HttpClientError, TokenProvider>,
    json: Effect.Effect<ParsedJson, JsonError, TokenProvider>
    validJson: <I>(_: S.Schema<I>) => Effect.Effect<I, ValidJsonError, TokenProvider>
  }
}

export class BaseEndpoint
  extends Context.Tag("Openai.BaseEndpoint")<BaseEndpoint, BaseEndpointInterface>() {

  static live =
    Layer.scoped(
      BaseEndpoint, 
      pipe(
        Effect.Do,
        Effect.bind("httpClient", () => HttpClient.HttpClient),
        Effect.let("baseUrl", () => "https://api.openai.com"),
        Effect.let("restClient", ({ httpClient, baseUrl }) =>
          httpClient.pipe(
            HttpClient.mapRequest(
              HttpClientRequest.prependUrl(baseUrl)
            ),
            HttpClient.mapEffect(_ => _.arrayBuffer)
          )
        ),
        Effect.let("getBuffer", ({ restClient }) =>
          (request: HttpClientRequest.HttpClientRequest) => {
            return Effect.suspend(() =>
              pipe(
                TokenProvider,
                Effect.andThen(token =>
                  restClient.execute(
                    HttpClientRequest.setHeader("Authorization", `Bearer ${Redacted.value(token)}`)(request)
                  )
                ),
                Effect.andThen(Buffer.from),
                Effect.scoped,
              )
            )
          }
        ),
        Effect.let("getJson", ({ restClient }) =>
          (request: HttpClientRequest.HttpClientRequest) =>
            Effect.suspend(() =>
              pipe(
                TokenProvider,
                Effect.andThen(token =>
                  restClient.execute(
                    HttpClientRequest.setHeader("Authorization", `Bearer ${Redacted.value(token)}`)(request)
                  )
                ),
                Effect.andThen(Buffer.from),
                Effect.andThen(_ => parseJson(_.toString())),
                Effect.scoped
              ),
            )
        ),
        Effect.andThen(({ getBuffer, getJson }) =>
          BaseEndpoint.of({
            execute: request => ({
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
          })
        )
      )
    ).pipe(
      Layer.provide(FetchHttpClient.layer)
    )

};

