import { Config, Data, Effect, pipe, Redacted } from "effect";
import { FileSystem, HttpClientError, HttpClientRequest } from "@effect/platform";

import { TgBotHttpClient, TgBotTokenProvider } from "../../api/index.js";
import { FileExtension, FileInfo, GetFileInfoCommandInput, RemoteFilePath } from "./schema.js";
import { PlatformError } from "@effect/platform/Error";

export class TgFileServiceError
  extends Data.TaggedError("TgFileServiceError")<{
    cause: PlatformError | HttpClientError.HttpClientError
  }> {}

export class TgFileService 
  extends Effect.Service<TgFileService>()("TgFileService", {
    effect:
      Effect.gen(function* () {

        const httpClient = yield* TgBotHttpClient;
        const fs = yield* FileSystem.FileSystem;

        const getFileInfo = (
          input: typeof GetFileInfoCommandInput.Type
        ) =>
          httpClient.executeMethod(
            "/getFile",
            input,
            FileInfo
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
                  Config.nonEmptyString("TMP_DIR"),
                  Effect.catchAll(() => 
                    Effect.succeed("/tmp")
                  )
                )
              ),
              Effect.let("downloadTo", ({ tmpDir }) => 
                `${tmpDir}/${remoteFilePath.replaceAll("/", "-")}${fileExtension ?? ""}`
              ),
              Effect.bind("cachedFileExists", ({ downloadTo }) =>
                fs.exists(downloadTo)
              ),
              Effect.bind("fileBytes", ({ botToken, downloadTo }) =>
                httpClient.originHttpClient.execute(
                  HttpClientRequest.get(`${httpClient.baseUrl}/file/bot${Redacted.value(botToken)}/${remoteFilePath}`)
                ).pipe(
                  Effect.andThen(_ => _.arrayBuffer),
                  Effect.andThen(_ => new Uint8Array(_)),
                  Effect.tap(_ => fs.writeFile(downloadTo, _)),
                  Effect.scoped
                ),
              ),
              Effect.andThen(({ fileBytes }) =>
                (fileName: string) =>
                  new File([ fileBytes ], fileName)
              ),
            ).pipe(
              Effect.mapError(errors =>
                new TgFileServiceError({ cause: errors })
              )
            )

        return {
          getFileInfo, downloadFile
        } as const;

      })
  }) {}