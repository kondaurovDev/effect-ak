import { pipe, Effect, Config, String } from "effect";
import { HttpClient, HttpClientRequest, FetchHttpClient } from "@effect/platform";
import * as S from "effect/Schema";
import { AiModuleName, availableVendors } from "../const.js";

export class MakeHttpClientInput
  extends S.Class<MakeHttpClientInput>("MakeHttpClientInput")({
    baseUrl: S.NonEmptyString,
    vendorName: S.Literal(...availableVendors),
    defaultHeaders: S.Record({ key: S.String, value: S.String }).pipe(S.optional),
    auth:
      S.Struct({
        headerName: S.NonEmptyString,
        tokenPrefix: S.String
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
        HttpClient.tapRequest(request =>
          Effect.logDebug("http request", Object.keys(request.headers))
        ),
        HttpClient.filterStatusOk
      );

    const tokenHeaderValueEffect =
      pipe(
        Config.nonEmptyString(`${input.vendorName}-token`).pipe(Config.nested(AiModuleName)),
        Effect.andThen(token => 
          String.isEmpty(input.auth.tokenPrefix) ? token : `${input.auth.tokenPrefix.trim()} ${token}`
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
        Effect.tap(() => Effect.logDebug("Successful response")),
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
