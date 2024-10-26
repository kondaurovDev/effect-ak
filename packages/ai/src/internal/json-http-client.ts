import { pipe, Effect, Config } from "effect";
import { HttpClient, HttpClientRequest, FetchHttpClient } from "@effect/platform";
import * as S from "effect/Schema";

export class MakeHttpClientInput
  extends S.Class<MakeHttpClientInput>("MakeHttpClientInput")({
    baseUrl: S.NonEmptyString,
    defaultHeaders: S.Record({ key: S.String, value: S.String }).pipe(S.optional),
    auth:
      S.Struct({
        headerName: S.NonEmptyString,
        tokenContainerName: S.NonEmptyString,
        isBearer: S.Boolean
      })
  }) { }

export const makeJsonHttpClient = (
  input: MakeHttpClientInput
) =>
  Effect.gen(function* () {

    const httpClient =
      (yield* HttpClient.HttpClient).pipe(
        HttpClient.mapRequest(request =>
          pipe(
            request,
            HttpClientRequest.prependUrl(input.baseUrl),
            HttpClientRequest.setHeaders(input.defaultHeaders ?? {})
          )
        ),
        HttpClient.filterStatusOk
      );

    const tokenHeaderValueEffect =
      pipe(
        Config.nonEmptyString("token").pipe(Config.nested(input.auth.tokenContainerName)),
        Effect.andThen(token =>
          input.auth.isBearer ? `Bearer ${token}` : token
        )
      )

    const getBuffer = (
      originRequest: HttpClientRequest.HttpClientRequest
    ) =>
      pipe(
        tokenHeaderValueEffect,
        Effect.andThen(tokenHeaderValue =>
          originRequest.pipe(
            HttpClientRequest.setHeader(input.auth.headerName, tokenHeaderValue)
          )
        ),
        Effect.andThen(httpClient.execute),
        Effect.andThen(_ => _.arrayBuffer),
        Effect.andThen(Buffer.from),
        Effect.scoped
      )

    const getJson = (
      request: HttpClientRequest.HttpClientRequest
    ) =>
      pipe(
        Effect.logDebug(`request to ${input.baseUrl}`, request),
        Effect.andThen(tokenHeaderValueEffect),
        Effect.andThen(tokenHeaderValue =>
          request.pipe(
            HttpClientRequest.setHeader(input.auth.headerName, tokenHeaderValue)
          )
        ),
        Effect.andThen(httpClient.execute),
        Effect.tapErrorTag("ResponseError", error =>
          pipe(
            error.response.text,
            Effect.andThen(_ => Effect.logError("HTTP client, bad response =>", _))
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

  }).pipe(
    Effect.provide(FetchHttpClient.layer)
  )
