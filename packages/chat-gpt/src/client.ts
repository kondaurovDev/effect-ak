import { Layer, pipe, Effect, Context, Redacted, Stream, Option, Chunk } from "effect";
import { HttpClient, HttpClientError, HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { Schema as S, ParseResult } from "@effect/schema";
import { UtilError } from "@efkit/shared/utils";
import { ParsedJson, parseJson } from "@efkit/shared/utils";

import { GptToken } from "./token.js";

export type ValidJsonError =
  HttpClientError.HttpClientError | UtilError | ParseResult.ParseError

export type JsonError =
  HttpClientError.HttpClientError | UtilError

export type OpenaiRestClientService = (
  request: HttpClientRequest.HttpClientRequest
) => {
  buffer: Effect.Effect<ArrayBuffer, HttpClientError.HttpClientError, GptToken>,
  json: Effect.Effect<ParsedJson, JsonError, GptToken>
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
            HttpClient.mapEffect(response =>
              HttpClientResponse.stream(Effect.succeed(response)).pipe(
                stream => Stream.runCollect(stream)
              )
            )
          )
        ),
        Effect.let("getBuffer", ({ restClient }) =>
          (request: HttpClientRequest.HttpClientRequest) => {
            return Effect.suspend(() =>
              pipe(
                GptToken,
                Effect.andThen(token =>
                  restClient.execute(
                    HttpClientRequest.setHeader("Authorization", `Bearer ${Redacted.value(token)}`)(request)
                  )
                ),
                Effect.andThen(_ =>
                  pipe(
                    Option.getOrElse(() => [])(Chunk.get(0)(_)),
                    data => Buffer.from(data)
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
                  restClient.execute(
                    HttpClientRequest.setHeader("Authorization", `Bearer ${Redacted.value(token)}`)(request)
                  )
                ),
                Effect.andThen(_ =>
                  pipe(
                    Option.getOrElse(() => [])(Chunk.get(0)(_)),
                    data => Buffer.from(data).toString()
                  )
                ),
                Effect.andThen(parseJson),
                Effect.scoped
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