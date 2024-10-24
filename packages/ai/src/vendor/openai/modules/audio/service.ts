import { Config, Effect, pipe } from "effect";
import { FileSystem, HttpBody, HttpClientRequest } from "@effect/platform";

import { ChatGptHttpClient } from "../../api/index.js";
import { CreateSpeechRequest, TranscribeRequest } from "./schema/request.js";
import { OneOfTranscriptionResponse } from "./schema/response.js";

export class AudioService
  extends Effect.Service<AudioService>()("AudioService", {
    effect:
      Effect.gen(function* () {

        const httpClient = yield* ChatGptHttpClient;
        const fs = yield* FileSystem.FileSystem;
        const tmpDir =
          yield* pipe(
            Config.nonEmptyString("temporary_dir"),
            Effect.catchAll(() => Effect.succeed("/tmp"))
          )

        const createSpeech = (
          request: CreateSpeechRequest
        ) =>
          pipe(
            HttpBody.json(request),
            Effect.andThen(requestBody =>
              httpClient.getBuffer(
                HttpClientRequest.post(
                  `/v1/audio/speech`,
                  {
                    body: requestBody
                  }
                )
              )
            ),
            Effect.andThen(fileBuffer =>
              fs.writeFile(tmpDir + '/' + `text.${request.response_format}`, new Uint8Array(fileBuffer))
            )
          );

        const transcribe = (
          request: TranscribeRequest
        ) =>
          pipe(
            httpClient.getTyped(
              HttpClientRequest.post(
                `/v1/audio/transcriptions`,
                {
                  body: request.getHttpBody()
                },
              ),
              OneOfTranscriptionResponse
            ),
            Effect.andThen(_ => _.text)
          )

        return {
          createSpeech, transcribe
        } as const;

      }),

    dependencies: [
      ChatGptHttpClient.Default
    ]

  }) { }
