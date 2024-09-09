import { Config, Effect, pipe, Data, Redacted } from "effect";
import { HttpClient, FileSystem, HttpClientRequest } from "@effect/platform";

import { baseUrl } from "../client/live.js";
import { TgBotToken } from "../domain/token.js"
import { FileExtension, RemoteFilePath } from "../domain/file.js";

export class DownloadFileError 
  extends Data.TaggedError("Tg.DownloadFileError")<{
    message: string
  }> {}

const tmpDir = 
  pipe(
    Config.string("TMP_DIR"),
    Config.withDefault("/tmp"),
    Effect.andThen( v => v),
    Effect.mapError(error =>
      new DownloadFileError({
        message: `Can't get tmp_dir: ${error}`
      })
    )
  )

export const downloadFile = (
  remoteFilePath: RemoteFilePath,
  fileExtension?: FileExtension
) =>
  pipe(
    Effect.Do,
    Effect.bind("botToken", () => TgBotToken),
    Effect.bind("tmpDir", () => tmpDir),
    Effect.let("downloadTo", ({ tmpDir }) => 
      `${tmpDir}/${remoteFilePath.replaceAll("/", "-")}${fileExtension ?? ""}`
    ),
    Effect.bind("fs", () => FileSystem.FileSystem),
    Effect.bind("cachedFileExists", ({ fs, downloadTo }) =>
      pipe(
        fs.exists(downloadTo),
        Effect.mapError((error) => 
          new DownloadFileError({
            message: `Can't download file to filesystem: ${error.message}`
          })
        )
      )
    ),
    Effect.tap(({ cachedFileExists, downloadTo, fs, botToken }) =>
      Effect.if(cachedFileExists, {
        onFalse: () =>
          pipe(
            HttpClient.HttpClient,
            Effect.andThen(client =>
              client(
                HttpClientRequest.get(`${baseUrl}/file/bot${Redacted.value(botToken)}/${remoteFilePath}`)
              ).pipe(
                Effect.mapError(error =>
                  new DownloadFileError({
                    message: `Can't download file from telegram: ${error.message}`
                  })
                )
              )
            ),
            Effect.andThen(_ => 
              pipe(
                _.arrayBuffer,
                Effect.mapError(error => 
                  new DownloadFileError({
                    message: `Can't read http body: ${error.message}`
                  })
                )
              )
            ),
            Effect.andThen(_ =>
              pipe(
                fs.writeFile(downloadTo, new Uint8Array(_)),
                Effect.mapError((error) => 
                  new DownloadFileError({
                    message: `Can't check cached file: ${error.message}`
                  })
                )
              )
            ),
            Effect.scoped,
          ),
        onTrue: () => Effect.logDebug("Already downloaded")
      })
    ),
    Effect.bind("bytes", ({ fs, downloadTo }) =>
      pipe(
        fs.readFile(downloadTo),
        Effect.mapError((error) => 
          new DownloadFileError({
            message: `Can't read downloaded file: ${error.message}`
          })
        )
      )
    ),
    Effect.let("file", ({ bytes }) =>
      (fileName: string) =>
        new File([ bytes ], fileName)
    )
  )
