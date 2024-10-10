import { pipe, Effect, Redacted } from "effect";
import { FetchHttpClient, HttpClient, HttpClientRequest } from "@effect/platform";
import { Schema as S } from "@effect/schema";

import { ClaudeTokenProvider } from "./token.js"

export class ClaudeHttpClient extends
  Effect.Service<ClaudeHttpClient>()("Claude.RestClient", {
    effect:
      Effect.gen(function* () {

        const httpClient =
          (yield* HttpClient.HttpClient).pipe(
            HttpClient.mapRequest(request =>
              pipe(
                request,
                HttpClientRequest.setHeader("anthropic-version", "2023-06-01"),
                HttpClientRequest.prependUrl("https://api.anthropic.com/"),
              )
            ),
            HttpClient.filterStatusOk
          );

        const getBuffer = (
          originRequest: HttpClientRequest.HttpClientRequest
        ) =>
          pipe(
            ClaudeTokenProvider,
            Effect.andThen(token =>
              originRequest.pipe(
                HttpClientRequest.setHeader("x-api-key", Redacted.value(token))
              )
            ),
            Effect.andThen(httpClient.execute),
            Effect.andThen(_ => _.arrayBuffer),
            Effect.andThen(Buffer.from),
            Effect.scoped,
          )

        const getJson = (
          originRequest: HttpClientRequest.HttpClientRequest
        ) =>
          pipe(
            ClaudeTokenProvider,
            Effect.andThen(token =>
              originRequest.pipe(
                HttpClientRequest.setHeader("x-api-key", Redacted.value(token))
              )
            ),
            Effect.andThen(httpClient.execute),
            Effect.tapErrorTag("ResponseError", error =>
              pipe(
                error.response.text,
                Effect.andThen(_ => Effect.logError("http api bad response", _))
              )
            ),
            Effect.andThen(_ => _.json),
            Effect.scoped,
          );

        const getTyped = <I, I2>(
          request: HttpClientRequest.HttpClientRequest,
          schema: S.Schema<I, I2>
        ) =>
          pipe(
            getJson(request),
            Effect.andThen(S.decodeUnknown(schema)),
            Effect.scoped
          )

        return {
          getBuffer, getJson, getTyped
        } as const;

      }),

    dependencies: [
      FetchHttpClient.layer
    ]

  }) { };
