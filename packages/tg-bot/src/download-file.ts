import { Brand, Config, Effect, pipe, Data } from "effect";
import { HttpClient, FileSystem, HttpClientRequest } from "@effect/platform";
import { MiscError, hashText } from "@efkit/shared";

import { baseUrl } from "./rest-client.js";
import { BotToken } from "./token.js"

export class DownloadFileError 
  extends Data.TaggedError("Tg.DownloadFileError")<{
    error: MiscError
  }> {}

export type RemoteFilePath = 
  string & Brand.Brand<"RemoteFilePath">

export const RemoteFilePath =
  Brand.nominal<RemoteFilePath>();

export type FileExtension = 
  string & Brand.Brand<"FileExtension">

export const FileExtension =
  Brand.nominal<FileExtension>();

const tmpDir = 
  pipe(
    Config.string("TMP_DIR"),
    Config.withDefault("/tmp"),
    Effect.mapError(error =>
      new MiscError({
        message: `Can't get tmp_dir: ${error._op}`
      })
    )
  )

export const downloadFile = (
  remoteFilePath: RemoteFilePath,
  fileExtension?: FileExtension
) =>
  Effect.Do.pipe(
    Effect.bind("botToken", () =>
      BotToken
    ),
    Effect.bind("tmpDir", () => tmpDir),
    Effect.bind("hashedToken", ({ botToken }) => 
      hashText(botToken.token)
    ),
    Effect.let("downloadTo", ({ tmpDir, hashedToken }) => 
      `${tmpDir}/${hashedToken}:${remoteFilePath.replaceAll("/", "-")}${fileExtension ?? ""}`
    ),
    Effect.bind("fs", () => FileSystem.FileSystem),
    Effect.bind("cachedFileExists", ({ fs, downloadTo }) =>
      pipe(
        fs.exists(downloadTo),
        Effect.mapError((error) => 
          new MiscError({
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
                HttpClientRequest.get(`${baseUrl}/file/bot${botToken}/${remoteFilePath}`)
              ).pipe(
                Effect.mapError(error =>
                  new MiscError({
                    message: `Can't download file from telegram: ${error.message}`
                  })
                )
              )
            ),
            Effect.andThen(_ => 
              pipe(
                _.arrayBuffer,
                Effect.mapError(error => 
                  new MiscError({
                    message: `Can't read http body: ${error.message}`
                  })
                )
              )
            ),
            Effect.andThen(_ =>
              pipe(
                fs.writeFile(downloadTo, new Uint8Array(_)),
                Effect.mapError((error) => 
                  new MiscError({
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
          new MiscError({
            message: `Can't read downloaded file: ${error.message}`
          })
        )
      )
    ),
    Effect.let("file", ({ bytes }) =>
      (fileName: string) =>
        new File([ bytes ], fileName)
    ),
    Effect.mapError(error =>
      new DownloadFileError({ error })
    ),
    Effect.provide(HttpClient.layer)
  )
