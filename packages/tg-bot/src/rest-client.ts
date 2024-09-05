import { HttpBody, HttpClient, HttpClientError, HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { Layer, pipe, Effect, Context, Match, Redacted, Console } from "effect";
import { Schema as S } from "@effect/schema"

import { TgBotToken, ContractError, TgApiError } from "./domain/index.js";

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
  Effect.Effect<A, RestClientError, TgBotToken>

export type RestClientService = {
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

export const baseUrl = "https://api.telegram.org";

export class RestClient
  extends Context.Tag("TgBot.RestClient")<RestClient, RestClientService>() { };

export const RestClientLive =
  Layer.effect(
    RestClient,
    pipe(
      Effect.Do,
      Effect.tap(Effect.logDebug("Creating Layer with TgRestClient")),
      Effect.bind("httpClient", () =>
        HttpClient.HttpClient
      ),
      Effect.let("client", ({ httpClient }) =>
        httpClient.pipe(
          HttpClient.tapRequest(request =>
            Effect.logDebug(`request to telegram bot api`, {
              botAction: request.url.split("/").at(-1),
              body: request.body.toJSON()
            })
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
                    HttpClientRequest.prependUrl(`${baseUrl}/bot${Redacted.value(token)}`)
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
          pipe(
            Effect.Do,
            Effect.tap(Console.log(`executing method '${methodName}'`)),
            Effect.bind("botToken", () => TgBotToken),
            Effect.let("body", () =>
              Object.keys(body).length != 0
                ? HttpBody.formData(getFormData(methodName, body))
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
