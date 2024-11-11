import { pipe } from "effect/Function";
import * as String from "effect/String";
import * as Effect from "effect/Effect";
import * as Config from "effect/Config";
import * as S from "effect/Schema";
import * as FetchHttpClient from "@effect/platform/FetchHttpClient";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClient from "@effect/platform/HttpClient";

import { availableVendors, aiModuleName } from "./const.js";

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

export const makeHttpClient = (
  input: MakeHttpClientInput
) =>
  Effect.gen(function* () {

    const httpClient =
      pipe(
        yield* HttpClient.HttpClient,
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
        Config.nonEmptyString(`${input.vendorName}-token`).pipe(Config.nested(aiModuleName)),
        Effect.andThen(token =>
          String.isEmpty(input.auth.tokenPrefix) ? token : `${input.auth.tokenPrefix.trim()} ${token}`
        )
      )

    const execute = (
      request: HttpClientRequest.HttpClientRequest
    ) =>
      pipe(
        tokenHeaderValueEffect,
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
        Effect.scoped
      )

    const getJson = (
      request: HttpClientRequest.HttpClientRequest
    ) =>
      pipe(
        execute(request),
        Effect.andThen(_ => _.json),
        Effect.tap(_ => Effect.logDebug("Successful response", _)),
      );

    const getTyped = <I, I2>(
      request: HttpClientRequest.HttpClientRequest,
      schema: S.Schema<I, I2>
    ) =>
      pipe(
        getJson(request),
        Effect.andThen(S.decodeUnknown(schema)),
      );

    return {
      execute, getJson, getTyped
    } as const;

  }).pipe(
    Effect.provide(FetchHttpClient.layer)
  )
