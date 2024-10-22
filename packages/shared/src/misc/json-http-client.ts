import { pipe, Effect, Redacted, Config } from "effect";
import { HttpClient, HttpClientRequest, Headers } from "@effect/platform";
import * as S from "effect/Schema";

export const makeJsonHttpClient = (
  input: {
    baseUrl: string,
    defaultHeaders: Headers.Input,
    auth: {
      headerName: string,
      tokenConfigName: string,
      isBearer: boolean
    }
  }
) =>
  Effect.gen(function* () {

    const httpClient =
      (yield* HttpClient.HttpClient).pipe(
        HttpClient.mapRequest(request =>
          pipe(
            request,
            HttpClientRequest.prependUrl(input.baseUrl),
            HttpClientRequest.setHeaders(input.defaultHeaders)
          )
        ),
        HttpClient.filterStatusOk
      );

    const tokenHeaderValueEffect =
      pipe(
        Config.redacted(input.auth.tokenConfigName),
        Effect.andThen(token =>
          input.auth.isBearer ? `Bearer ${Redacted.value(token)}` : Redacted.value(token)
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
        Effect.tapErrorTag("ResponseError", error =>
          pipe(
            error.response.text,
            Effect.andThen(_ => Effect.logError("basic http-client, bad response", _))
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

  })
