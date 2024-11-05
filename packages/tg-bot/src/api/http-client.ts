import { FetchHttpClient, HttpClient, HttpClientRequest } from "@effect/platform";
import { Cause, Data, Effect, pipe, Redacted } from "effect";
import * as S from "effect/Schema";

import { TgBotApiClientError, TgBotApiServerError } from "./error.js";
import { TgResponse } from "./response.js";
import { TgBotTokenProvider } from "./config-provider.js";
import { telegramApiUrl } from "../internal/const.js";
import { makePayload } from "../internal/payload-mapper.js";

export type ExecuteTgBotMethod<I, O> = (input: I) => Effect.Effect<O, unknown>

export type MethodInput<O, O2> = {
  path: `/${string}`,
  payload: Record<string, unknown>,
  responseSchema: S.Schema<O, O2>
}

export class MethodEffectOrPromiseResponse<O>
  extends Data.Class<{
    effect: Effect.Effect<O, unknown, never>,
    promise: Promise<O>
  }> { }

export class TgBotHttpClient
  extends Effect.Service<TgBotHttpClient>()("TgBotHttpClient", {
    effect:
      Effect.gen(function* () {

        const { tokenEffect } = yield* TgBotTokenProvider;

        const httpClient =
          pipe(
            yield* HttpClient.HttpClient,
            HttpClient.mapRequest(
              HttpClientRequest.prependUrl(telegramApiUrl)
            ),
            HttpClient.tapRequest(request =>
              Effect.logDebug(`request to telegram bot api`, {
                lastUrlSegment: request.url.split("/").at(-1)
              })
            ),
            HttpClient.filterStatusOk,
          );

        const executeMethod =
          <O, O2>(input: MethodInput<O, O2>) => {

            const effect =
              Effect.gen(function* () {

                const botToken =
                  yield* pipe(
                    tokenEffect,
                    Effect.andThen(Redacted.value),
                    Effect.mapError(errors => new Cause.UnknownException(errors))
                  )

                yield* Effect.logDebug("request payload", input.payload);

                const formData =
                  Object.keys(input.payload).length != 0 ? makePayload(input.payload) : undefined

                const result =
                  yield* pipe(
                    HttpClientRequest.post(
                      `/bot${botToken}${input.path}`, {
                      body: formData
                    }),
                    httpClient.execute,
                    Effect.andThen(_ => _.json),
                    Effect.tap(_ =>
                      Effect.logDebug("response", _)
                    ),
                    Effect.andThen(S.validate(TgResponse)),
                    Effect.andThen(_ => S.decodeUnknown(input.responseSchema)(_.result))
                  );

                return result;
              }).pipe(
                Effect.catchTags({
                  RequestError: cause => new TgBotApiClientError({ cause }),
                  ResponseError: cause =>
                    pipe(
                      cause.response.json,
                      Effect.andThen(response =>
                        Effect.logWarning("bad response", response)
                      ),
                      Effect.andThen(() =>
                        new TgBotApiServerError({ cause })
                      )
                    ),
                }),
                Effect.scoped
              );

            const promise =
              pipe(
                effect,
                Effect.runPromise
              );

            return (
              new MethodEffectOrPromiseResponse({
                effect, promise
              })
            );

          }

        return {
          executeMethod, httpClient
        } as const

      }),

    dependencies: [
      FetchHttpClient.layer
    ]

  }) { }

