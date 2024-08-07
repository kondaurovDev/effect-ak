import { Context, Effect, Layer, Data, ConfigError, pipe } from "effect";
import { HttpClient, HttpClientError, HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { Schema as S, ParseResult } from "@effect/schema";

export class ClientError extends Data.TaggedError("Google.RestError")<{
  error:
    HttpClientError.HttpClientError |
    ParseResult.ParseError |
    ConfigError.ConfigError
}> {}

export type RestClient =
  HttpClient.HttpClient<unknown, ClientError>

export const RestClient = (
  name: string
) =>
  Context.GenericTag<RestClient>(`${name}.RestClient`);

type BaseUrl = 
  "www.googleapis.com" |
  "sheets.googleapis.com"

export const RestClientLayer = (
  service: Context.Tag<RestClient, RestClient>,
  baseUrl: BaseUrl,
  urlPrefix: `/${string}`
) =>
  Layer.effect(
    service,
    Effect.Do.pipe(
      Effect.bind("httpClient", () => HttpClient.HttpClient),
      Effect.andThen(({ httpClient }) =>
        httpClient.pipe(
          HttpClient.mapRequest(request => 
            HttpClientRequest.prependUrl(request, `https://${baseUrl}${urlPrefix}`)
          ),
          HttpClient.tapRequest(request =>
            Effect.logDebug("google request", request)
          ),
          HttpClient.tap(response =>
            pipe(
              response.text,
              Effect.andThen(body =>
                Effect.logDebug("google integration", baseUrl, body)
              )
            )
          ),
          HttpClient.filterStatusOk,
          HttpClient.mapEffectScoped(
            HttpClientResponse.schemaBodyJson(S.Unknown)
          ),
          HttpClient.catchAll(error => 
            new ClientError({ error })
          )
        )
      ),
      Effect.mapError(error =>
        new ClientError({ error })
      ),
      Effect.andThen(client =>
        service.of(
          client
        )
      )
    )
  );