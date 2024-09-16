import { HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { Effect, Layer, pipe, Redacted } from "effect";
import { Schema as S } from "@effect/schema"

import { TgRestClient } from "./tag.js";
import { TgResponse } from "../domain/tg-response.js";
import { TgBotApiClientError, TgBotApiServerError } from "./error.js";
import { TgBotToken } from "../domain/token.js";
import { getFormData, validateResponse } from "./utils.js";

export const baseUrl = "https://api.telegram.org";

export const TgRestClientLive =
  Layer.scoped(
    TgRestClient,
    pipe(
      Effect.Do,
      Effect.bind("httpClient", () => HttpClient.HttpClient),
      Effect.let("client", ({ httpClient }) =>
        httpClient.pipe(
          HttpClient.tapRequest(request =>
            Effect.logDebug(`request to telegram bot api`, {
              botAction: request.url.split("/").at(-1),
              body: request.body.toJSON()
            })
          ),
          HttpClient.mapEffectScoped(
            HttpClientResponse.schemaBodyJson(TgResponse)
          ),
          HttpClient.catchTag("ParseError", parseError =>
            Effect.fail(new TgBotApiServerError({ cause: parseError }))
          ),
          HttpClient.filterOrFail(
            response => response.ok,
            response => new TgBotApiServerError({ cause: response })
          ),
          HttpClient.map(_ => _.result)
        )
      ),
      Effect.let("sendApiRequest", ({ client }) =>
        <O, O2>(
          request: HttpClientRequest.HttpClientRequest,
          resultSchema: S.Schema<O, O2>
        ) =>
          pipe(
            TgBotToken,
            Effect.andThen(token =>
              client(
                pipe(
                  request,
                  HttpClientRequest.prependUrl(`${baseUrl}/bot${Redacted.value(token)}`)
                )
              )
            ),
            Effect.andThen(_ => validateResponse(resultSchema, _)),
            Effect.catchTags({
              RequestError: cause => new TgBotApiClientError({ cause }),
              ResponseError: cause => new TgBotApiServerError({ cause }),
            })
          )
      ),
      Effect.let("sendApiPostRequest", ({ client }) =>
        <O, O2>(
          methodName: `/${string}`,
          body: Record<string, unknown>,
          resultSchema: S.Schema<O, O2>
        ) =>
          pipe(
            Effect.Do,
            Effect.bind("botToken", () => TgBotToken),
            Effect.let("body", () =>
              Object.keys(body).length != 0
                ? getFormData(methodName, body)
                : undefined
            ),
            Effect.let("request", ({ botToken, body }) =>
              HttpClientRequest.post(
                `${baseUrl}/bot${Redacted.value(botToken)}${methodName}`, {
                body
              })
            ),
            Effect.andThen(({ request }) =>
              client(request),
            ),
            Effect.andThen(_ => validateResponse(resultSchema, _)),
            Effect.catchTags({
              RequestError: cause => new TgBotApiClientError({ cause }),
              ResponseError: cause => new TgBotApiServerError({ cause }),
            })
          )
      ),
      Effect.andThen(({ sendApiPostRequest, sendApiRequest }) =>
        TgRestClient.of({
          sendApiPostRequest, sendApiRequest
        })
      )
    )
  )