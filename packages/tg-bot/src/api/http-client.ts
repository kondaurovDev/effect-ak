import { FetchHttpClient, HttpClient, HttpClientRequest } from "@effect/platform";
import { Config, Effect, pipe } from "effect";
import * as S from "effect/Schema";

import { TgBotApiClientError, TgBotApiServerError } from "./error.js";
import { getFormData } from "./utils.js";
import { TgResponse } from "./response.js";
import { tgBotTokenConfigKey } from "./const.js";

export class TgBotHttpClient
  extends Effect.Service<TgBotHttpClient>()("TgBotHttpClient", {
    effect:
      Effect.gen(function* () {

        const originHttpClient = yield* HttpClient.HttpClient;
        const baseUrl = "https://api.telegram.org";

        const httpClient =
          pipe(
            originHttpClient,
            HttpClient.mapRequest(
              HttpClientRequest.prependUrl(baseUrl)
            ),
            HttpClient.tapRequest(request =>
              Effect.logDebug(`request to telegram bot api`, {
                lastUrlSegment: request.url.split("/").at(-1),
                body: request
              })
            ),
            HttpClient.filterStatusOk,
          )

        const executeMethod = <O, O2>(
          methodName: `/${string}`,
          body: Record<string, unknown>,
          resultSchema: S.Schema<O, O2>
        ) =>
          Effect.gen(function* () {

            const botToken =
              yield* Config.nonEmptyString(tgBotTokenConfigKey);

            yield* Effect.logDebug("request body", body);

            const formData =
              Object.keys(body).length != 0 ? getFormData(methodName, body) : undefined

            const result =
              yield* pipe(
                HttpClientRequest.post(
                  `/bot${botToken}${methodName}`, {
                  body: formData
                }),
                httpClient.execute,
                Effect.andThen(_ => _.json),
                Effect.tap(_ => 
                  Effect.logDebug("response", _)
                ),
                Effect.andThen(S.validate(TgResponse)),
                Effect.andThen(_ => S.decodeUnknown(resultSchema)(_.result))
              );

            return result;
          }).pipe(
            Effect.catchTags({
              RequestError: cause => new TgBotApiClientError({ cause }),
              ResponseError: cause =>
                pipe(
                  cause.response.json,
                  Effect.andThen(response =>
                    Effect.logDebug("bad response", response)
                  ),
                  Effect.andThen(() =>
                    new TgBotApiServerError({ cause })
                  )
                ),
            }),
            Effect.scoped
          )

        return {
          executeMethod, originHttpClient, baseUrl
        } as const

      }),

    dependencies: [
      FetchHttpClient.layer
    ]

  }) { }
