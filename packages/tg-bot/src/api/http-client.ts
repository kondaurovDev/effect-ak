import { FetchHttpClient, FileSystem, HttpClient, HttpClientRequest } from "@effect/platform";
import { Config, Effect, pipe, Redacted } from "effect";
import { Schema as S } from "@effect/schema"

import { TgBotApiClientError, TgBotApiDownloadFileError, TgBotApiServerError } from "./error.js";
import { TgBotTokenProvider } from "../providers/bot-token.js";
import { getFormData } from "./utils.js";
import { FileExtension, RemoteFilePath } from "../domain/file.js";
import { TgResponse } from "../domain/tg-response.js";

export class TgBotHttpClient
  extends Effect.Service<TgBotHttpClient>()("TgBotHttpClient", {
    effect:
      Effect.gen(function* () {

        const originHttpClient = yield* HttpClient.HttpClient;
        const fs = yield* FileSystem.FileSystem;
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
            HttpClient.filterStatusOk
          )

        const executeMethod = <O, O2>(
          methodName: `/${string}`,
          body: Record<string, unknown>,
          resultSchema: S.Schema<O, O2>
        ) =>
          pipe(
            Effect.Do,
            Effect.bind("botToken", () => TgBotTokenProvider),
            Effect.tap(() =>
              Effect.logDebug("request body", body)
            ),
            Effect.let("formData", () =>
              Object.keys(body).length != 0 ?
                getFormData(methodName, body) : undefined
            ),
            Effect.let("request", ({ botToken, formData }) =>
              HttpClientRequest.post(
                `/bot${Redacted.value(botToken)}${methodName}`, {
                body: formData
              })
            ),
            Effect.andThen(({ request }) =>
              httpClient.execute(request),
            ),
            Effect.tap(response => 
              pipe(
                response.json,
                Effect.andThen(_ => Effect.logDebug("response", _))
              )
            ),
            Effect.andThen(_ => _.json),
            Effect.andThen(S.validate(TgResponse)),
            Effect.andThen(_ => S.decodeUnknown(resultSchema)(_.result)),
            Effect.catchTags({
              RequestError: cause => new TgBotApiClientError({ cause }),
              ResponseError: cause => new TgBotApiServerError({ cause }),
            }),
            Effect.scoped
          )

        const downloadFile = (
          remoteFilePath: RemoteFilePath,
          fileExtension?: FileExtension
        ) =>
          pipe(
            Effect.Do,
            Effect.bind("botToken", () => TgBotTokenProvider),
            Effect.bind("tmpDir", () => 
              pipe(
                Config.string("TMP_DIR"),
                Config.withDefault("/tmp")
              )
            ),
            Effect.let("downloadTo", ({ tmpDir }) => 
              `${tmpDir}/${remoteFilePath.replaceAll("/", "-")}${fileExtension ?? ""}`
            ),
            Effect.bind("cachedFileExists", ({ downloadTo }) =>
              fs.exists(downloadTo)
            ),
            Effect.bind("fileBytes", ({ botToken, downloadTo }) =>
              httpClient.execute(
                HttpClientRequest.get(`${baseUrl}/file/bot${Redacted.value(botToken)}/${remoteFilePath}`)
              ).pipe(
                Effect.andThen(_ => _.arrayBuffer),
                Effect.andThen(_ => new Uint8Array(_)),
                Effect.tap(_ => fs.writeFile(downloadTo, _))
              ),
            ),
            Effect.andThen(({ fileBytes }) =>
              (fileName: string) =>
                new File([ fileBytes ], fileName)
            ),
            Effect.scoped
          ).pipe(
            Effect.mapError(errors =>
              new TgBotApiDownloadFileError({ cause: errors })
            )
          )

        return {
          executeMethod, downloadFile
        } as const

      }),

    dependencies: [
      FetchHttpClient.layer
    ]

  }) { }
