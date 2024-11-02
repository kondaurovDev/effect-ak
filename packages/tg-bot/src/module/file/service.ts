import { Config, ConfigError, Data, Effect, pipe } from "effect";
import { FileSystem, HttpClientError, HttpClientRequest } from "@effect/platform";

import { TgBotHttpClient } from "../../api/index.js";
import { FileExtension, FileInfo, GetFileInfoCommandInput, RemoteFilePath } from "./schema.js";
import { PlatformError } from "@effect/platform/Error";

export class TgFileServiceError
  extends Data.TaggedError("TgFileServiceError")<{
    cause: PlatformError | HttpClientError.HttpClientError | ConfigError.ConfigError
  }> { }

export class TgFileService
  extends Effect.Service<TgFileService>()("TgFileService", {
    effect:
      Effect.gen(function* () {

        const httpClient = yield* TgBotHttpClient;
        const fs = yield* FileSystem.FileSystem;

        const tmpDir =
          yield* pipe(
            Config.nonEmptyString("TMP_DIR"),
            Config.withDefault("/tmp")
          )

        const botTokenConfig =
          Config.nonEmptyString("TG_BOT_TOKEN")

        const getFileInfo = (
          input: typeof GetFileInfoCommandInput.Type
        ) =>
          httpClient.executeMethod(
            "/getFile",
            input,
            FileInfo
          );

        const downloadFile = (
          remoteFilePath: RemoteFilePath,
          fileExtension?: FileExtension
        ) =>
          Effect.gen(function* () {

            const botToken = yield* botTokenConfig;
            const fileName = `${remoteFilePath.replaceAll("/", "-")}${fileExtension ?? ""}`;
            const downloadTo =
              `${tmpDir}/${fileName}`;

            const alreadyDownloaded =
              yield* fs.exists(downloadTo);

            if (alreadyDownloaded) {
              return (
                yield* pipe(
                  fs.readFile(downloadTo),
                  Effect.andThen(bytes =>
                    new File([ bytes ], fileName)
                  )
                )
              )
            }

            return (
              yield* httpClient.originHttpClient.execute(
                HttpClientRequest.get(`${httpClient.baseUrl}/file/bot${botToken}/${remoteFilePath}`)
              ).pipe(
                Effect.andThen(_ => _.arrayBuffer),
                Effect.andThen(_ => new Uint8Array(_)),
                Effect.tap(_ => fs.writeFile(downloadTo, _)),
                Effect.andThen(bytes =>
                  new File([ bytes ], fileName)
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