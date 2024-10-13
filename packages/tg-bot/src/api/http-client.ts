import { FetchHttpClient, HttpClient, HttpClientRequest } from "@effect/platform";
import { Effect, pipe, Redacted } from "effect";
import { Schema as S } from "@effect/schema"

import { TgBotApiClientError, TgBotApiServerError } from "./error.js";
import { TgBotTokenProvider } from "./token.js";
import { getFormData } from "./utils.js";
import { TgResponse } from "./response.js";

export class TgBotHttpClient
  extends Effect.Service<TgBotHttpClient>()("TgBotHttpClient", {
    effect:
      Effect.gen(function* () {

        const originHttpClient = yield* HttpClient.HttpClient;
        const baseUrl = "https://api.telegram.org";

        const httpClient =
          pipe(
            originHttpClient,
            HttpClient.mapRequest(
              HttpClientRequest.prependUrl(baseUrl)
            ),
            HttpClient.tapRequest(request =>
              Effect.logDebug(`request to telegram bot api`, {
                lastUrlSegment: request.url.split("/").at(-1),
                body: request
              })
            ),
            HttpClient.filterStatusOk,
          )

        const executeMethod = <O, O2>(
          methodName: `/${string}`,
          body: Record<string, unknown>,
          resultSchema: S.Schema<O, O2>
        ) =>
          pipe(
            Effect.Do,
            Effect.bind("botToken", () => TgBotTokenProvider),
            Effect.tap(() =>
              Effect.logDebug("request body", body)
            ),
            Effect.let("formData", () =>
              Object.keys(body).length != 0 ?
                getFormData(methodName, body) : undefined
            ),
            Effect.let("request", ({ botToken, formData }) =>
              HttpClientRequest.post(
                `/bot${Redacted.value(botToken)}${methodName}`, {
                body: formData
              })
            ),
            Effect.andThen(({ request }) =>
              httpClient.execute(request),
            ),
            Effect.tap(response => 
              pipe(
                response.json,
                Effect.andThen(_ => Effect.logDebug("response", _))
              )
            ),
            Effect.andThen(_ => _.json),
            Effect.andThen(S.validate(TgResponse)),
            Effect.andThen(_ => S.decodeUnknown(resultSchema)(_.result)),
            Effect.catchTags({
              RequestError: cause => new TgBotApiClientError({ cause }),
              ResponseError: cause => 
                pipe(
                  cause.response.json,
                  Effect.andThen(response =>
                    Effect.logDebug("bad response", response)
                  ),
                  Effect.andThen(() =>
                    new TgBotApiServerError({ cause })
                  )
                ),
            }),
            Effect.scoped
          )

        return {
          executeMethod, originHttpClient, baseUrl
        } as const

      }),

    dependencies: [
      FetchHttpClient.layer
    ]

  }) { }
