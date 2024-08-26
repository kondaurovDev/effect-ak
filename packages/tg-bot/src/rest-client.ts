import { HttpBody, HttpClient, HttpClientError, HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { Layer, pipe, Effect, Context, Match } from "effect";
import { Schema as S } from "@effect/schema"

import { ContractError, TgApiError } from "./error.js";
import { TgBotTokenValue, TgBotToken } from "./token.js";

export type TgResponse =
  typeof TgResponse.Type;

export const TgResponse =
  S.Struct({
    ok: S.Boolean,
    error_code: S.optional(S.Number),
    description: S.optional(S.String),
    result: S.optional(S.Unknown)
  });

export type RestClientError =
  HttpClientError.HttpClientError |
  ContractError |
  TgApiError

export type MethodResult<A> =
  Effect.Effect<A, RestClientError, TgBotTokenValue>

export type RestClient = {
  sendApiRequest: <O>(
    request: HttpClientRequest.HttpClientRequest,
    resultSchema: S.Schema<O>
  ) => MethodResult<O>
  sendApiPostRequest: <O>(
    methodName: `/${string}`,
    body: Record<string, unknown>,
    resultSchema: S.Schema<O>
  ) => MethodResult<O>
}

export const RestClient =
  Context.GenericTag<RestClient>("TgBot.RestClient");

export const baseUrl = "https://api.telegram.org";

export const RestClientLive =
  Layer.effect(
    RestClient,
    Effect.Do.pipe(
      Effect.bind("httpClient", () =>
        HttpClient.HttpClient
      ),
      Effect.let("client", ({ httpClient }) =>
        httpClient.pipe(
          HttpClient.tapRequest(request =>
            Effect.logDebug(`request to telegram bot api`, request.toJSON())
          ),
          HttpClient.tap(response => 
            pipe(
              response.json,
              Effect.andThen(body =>
                Effect.logDebug("telegram body response", body)
              )
            )
          ),
          HttpClient.mapEffectScoped(
            HttpClientResponse.schemaBodyJson(TgResponse)
          ),
          HttpClient.catchTag("ParseError", parseError =>
            Effect.fail(new ContractError({ parseError, type: "api" }))
          ),
          HttpClient.filterOrFail(
            response => response.ok,
            response => new TgApiError({ response })
          ),
          HttpClient.map(_ => _.result)
        )
      ),
      Effect.let("sendApiRequest", ({ client }) =>
        <O>(
          request: HttpClientRequest.HttpClientRequest,
          resultSchema: S.Schema<O>
        ) =>
          pipe(
            TgBotToken,
            Effect.andThen(token =>
              client(
                request
                  .pipe(
                    HttpClientRequest.prependUrl(`${baseUrl}/bot${token}`)
                  )
              )
            ),
            Effect.andThen(_ => validateResponse(resultSchema, _))
          )
      ),
      Effect.let("sendApiPostRequest", ({ client }) =>
        <O>(
          methodName: `/${string}`,
          body: Record<string, unknown>,
          resultSchema: S.Schema<O>
        ) =>
          Effect.Do.pipe(
            Effect.bind("botToken", () => TgBotToken),
            Effect.let("request", ({ botToken }) =>
              HttpClientRequest.post(
                `${baseUrl}/bot${botToken}${methodName}`, {
                  body: 
                    Object.keys(body).length != 0
                      ? HttpBody.formData(
                        getFormData(methodName, body)
                      )
                      : undefined
                }
              )
            ),
            Effect.andThen(({ request }) =>
              client(request),
            ),
            Effect.andThen(_ => validateResponse(resultSchema, _))
          )
      ),
      Effect.andThen(({ sendApiRequest, sendApiPostRequest }) =>
        RestClient.of({
          sendApiPostRequest, sendApiRequest
        })
      )
    )
  ).pipe(
    Layer.provide(HttpClient.layer)
  )

const getFormData = (
  methodName: `/${string}`,
  body: Record<string, unknown>
) => {
  const result = new FormData();
  for (const [key, value] of Object.entries(body)) {
    Match.value(typeof value).pipe(
      Match.when("object",
        () => {
          if (value instanceof Uint8Array && methodName == "/sendVoice") {
            result.append(key, new Blob([value]), "file.ogg")
          } else {
            result.append(key, JSON.stringify(value))
          }
        }
      ),
      Match.orElse(() => result.append(key, value))
    )
  }
  return result;
}

const validateResponse = <O>(
  outputSchema: S.Schema<O>,
  response: unknown
) =>
  pipe(
    S.validate(outputSchema)(response),
    Effect.mapError((parseError) => new ContractError({ type: "response", parseError }))
  )
