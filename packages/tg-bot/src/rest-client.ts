import { HttpBody, HttpClient, HttpClientError, HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { Layer, pipe, Effect, Context, Match, Redacted, Data } from "effect";
import { ParseResult, Schema as S } from "@effect/schema"

import { TgBotToken, TgResponse } from "./domain/index.js";

export class TgBotApiClientError
  extends Data.TaggedError("TgBotApiClientError")<{
    cause: ParseResult.ParseError | HttpClientError.RequestError
  }> {}

export class TgBotApiServerError
  extends Data.TaggedError("TgBotApiServerError")<{
    cause: ParseResult.ParseError | TgResponse | HttpClientError.ResponseError
  }> {

    get message() {
      return pipe(
        Match.value(this.cause),
        Match.when(({ _tag: "ParseError" }), error => error.message),
        Match.when(({ _tag: "ResponseError" }), error => error.message),
        Match.orElse(tgResponse => JSON.stringify(tgResponse))
      )
    }

  }
export type MethodResult<A> =
  Effect.Effect<A, TgBotApiClientError | TgBotApiServerError, TgBotToken>

export type TgRestClientService = {
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

export class TgRestClient
  extends Context.Tag("TgBot.RestClient")<TgRestClient, TgRestClientService>() { };

export const TgRestClientLive =
  Layer.scoped(
    TgRestClient,
    pipe(
      Effect.Do,
      Effect.tap(Effect.logDebug("Creating Layer with TgRestClient")),
      Effect.bind("httpClient", () => HttpClient.HttpClient),
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
        <O>(
          request: HttpClientRequest.HttpClientRequest,
          resultSchema: S.Schema<O>
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
        <O>(
          methodName: `/${string}`,
          body: Record<string, unknown>,
          resultSchema: S.Schema<O>
        ) =>
          pipe(
            Effect.Do,
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
    Effect.mapError((parseError) => new TgBotApiServerError({ cause: parseError }))
  )
