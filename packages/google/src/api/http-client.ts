import { Effect, Data, ConfigError, pipe } from "effect";
import { FetchHttpClient, HttpClient, HttpClientError, HttpClientResponse } from "@effect/platform";
import { Schema as S, ParseResult } from "@effect/schema";

export class GoogleClientRestError
  extends Data.TaggedError("Google.RestError")<{
    cause:
    HttpClientError.HttpClientError |
    ParseResult.ParseError |
    ConfigError.ConfigError
  }> { }

export class GoogleApiHttpClient
  extends Effect.Service<GoogleApiHttpClient>()(`Google.ApiHttpClient`, {
    scoped:
      Effect.gen(function* () {
        const originHttpClient = yield* HttpClient.HttpClient;
        const tunnedClient = 
          originHttpClient.pipe(
            HttpClient.tapRequest(request =>
              Effect.logDebug("google request", request)
            ),
            HttpClient.tap(response =>
              pipe(
                response.text,
                Effect.andThen(body =>
                  Effect.logDebug("google rest client response", body)
                )
              )
            ),
            HttpClient.filterStatusOk,
            HttpClient.mapEffect(
              HttpClientResponse.schemaBodyJson(S.Object)
            ),
            HttpClient.scoped,
            HttpClient.catchAll(error =>
              new GoogleClientRestError({ cause: error })
            )
          )

        return tunnedClient;
      }),

      dependencies: [ FetchHttpClient.layer ]
  }) {};


