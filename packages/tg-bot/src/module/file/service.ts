import * as Config from "effect/Config";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as ConfigError from "effect/ConfigError";
import * as FileSystem from "@effect/platform/FileSystem";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import { PlatformError } from "@effect/platform/Error";

import { TgBotHttpClient } from "../../api/index.js";
import { FileExtension, FileInfo, GetFileInfoCommandInput, RemoteFilePath } from "./schema.js";
import { telegramApiUrl } from "../../internal/const.js";

export class TgFileServiceError
  extends Data.TaggedError("TgFileServiceError")<{
    cause: PlatformError | HttpClientError.HttpClientError | ConfigError.ConfigError
  }> { }

export class TgFileService
  extends Effect.Service<TgFileService>()("TgFileService", {
    effect:
      Effect.gen(function* () {

        const botClient = yield* TgBotHttpClient;
        const fs = yield* FileSystem.FileSystem;

        const tmpDir =
          yield* pipe(
            Config.nonEmptyString("TMP_DIR"),
            Config.withDefault("/tmp")
          )

        const botTokenConfig =
          Config.nonEmptyString("TG_BOT_TOKEN")

        const getFileInfo = (
          payload: typeof GetFileInfoCommandInput.Type
        ) =>
          botClient.executeMethod({
            path: "/getFile",
            responseSchema: FileInfo,
            payload,
          });

        const downloadFile = (
          remoteFilePath: RemoteFilePath,
          fileExtension?: FileExtension
        ) =>
          Effect.gen(function* () {

            const botToken = yield* botTokenConfig;
            const fileName = `${remoteFilePath.replaceAll("/", "-")}${fileExtension ?? ""}`;
            const downloadTo = `${tmpDir}/${fileName}`;

            const alreadyDownloaded =
              yield* fs.exists(downloadTo);

            if (alreadyDownloaded) {
              return (
                yield* pipe(
                  fs.readFile(downloadTo),
                  Effect.andThen(bytes =>
                    new File([bytes], fileName)
                  )
                )
              )
            }

            return (
              yield* botClient.httpClient.execute(
                HttpClientRequest.get(`${telegramApiUrl}/file/bot${botToken}/${remoteFilePath}`)
              ).pipe(
                Effect.andThen(_ => _.arrayBuffer),
                Effect.andThen(_ => new Uint8Array(_)),
                Effect.tap(_ => fs.writeFile(downloadTo, _)),
                Effect.andThen(bytes =>
                  new File([bytes], fileName)
                ),
                Effect.scoped
              )
            );

          }).pipe(
            Effect.mapError(errors =>
              new TgFileServiceError({ cause: errors })
            )
          )

        return {
          getFileInfo, downloadFile
        } as const;

      }),

      dependencies: [
        TgBotHttpClient.Default
      ]
  }) { }
