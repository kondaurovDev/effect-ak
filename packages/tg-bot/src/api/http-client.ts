import { FetchHttpClient, HttpBody, HttpClient, HttpClientRequest } from "@effect/platform";
import { Cause, Effect, pipe, Redacted } from "effect";
import * as S from "effect/Schema";

import { TgBotApiClientError, TgBotApiServerError } from "./error.js";
import { TgResponse } from "./response.js";
import { FileWithContent } from "../module/chat/schema/commands.js";
import { TgBotTokenProvider } from "./config-provider.js";
import { telegramApiUrl } from "../const.js";

export type ExecuteTgBotMethod<I, O> = (input: I) => Effect.Effect<O, unknown>

export type TgBotApiMethodExecutor =
  <O, O2>(
    methodName: `/${string}`,
    body: Record<string, unknown>,
    resultSchema: S.Schema<O, O2>
  ) => Effect.Effect<O, unknown, never>

export class TgBotHttpClient
  extends Effect.Service<TgBotHttpClient>()("TgBotHttpClient", {
    effect:
      Effect.gen(function* () {

        const { tokenEffect } = yield* TgBotTokenProvider;

        const httpClient =
          pipe(
            yield* HttpClient.HttpClient,
            HttpClient.mapRequest(
              HttpClientRequest.prependUrl(telegramApiUrl)
            ),
            HttpClient.tapRequest(request =>
              Effect.logDebug(`request to telegram bot api`, {
                lastUrlSegment: request.url.split("/").at(-1),
                body: request
              })
            ),
            HttpClient.filterStatusOk,
          );

        const transformToFormData = (
          body: Record<string, unknown>
        ) => {
          const result = new FormData();
          for (const [key, value] of Object.entries(body)) {
            if (typeof value == "object") {
              if (S.is(FileWithContent)(value)) {
                result.append(key, new Blob([value.content]), value.fileName);
                continue;
              }
              result.append(key, JSON.stringify(value));
            } else {
              result.append(key, value)
            }
          }
          return HttpBody.formData(result);
        }

        const executeMethod: TgBotApiMethodExecutor = (
          methodName,
          body,
          resultSchema
        ) =>
          Effect.gen(function* () {

            const botToken =
              yield* pipe(
                tokenEffect,
                Effect.andThen(Redacted.value),
                Effect.mapError(errors => new Cause.UnknownException(errors))
              )

            yield* Effect.logDebug("request body", body);

            const formData =
              Object.keys(body).length != 0 ? transformToFormData(body) : undefined

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
          executeMethod, httpClient
        } as const

      }),

    dependencies: [
      FetchHttpClient.layer
    ]

  }) { }
