import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import * as Config from "effect/Config";
import { FileSystem } from "@effect/platform/FileSystem";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";

import { OpenaiHttpClient } from "../../api/index.js";
import { CreateSpeechRequest, TranscribeRequest } from "./schema/request.js";
import { OneOfTranscriptionResponse } from "./schema/response.js";

export class AudioService
  extends Effect.Service<AudioService>()("AudioService", {
    effect:
      Effect.gen(function* () {

        const httpClient = yield* OpenaiHttpClient;
        const fs = yield* FileSystem;
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
              httpClient.execute(
                HttpClientRequest.post(
                  `/v1/audio/speech`,
                  {
                    body: requestBody
                  }
                )
              )
            ),
            Effect.andThen(_ => _.arrayBuffer),
            Effect.andThen(_ =>
              fs.writeFile(tmpDir + '/' + `text.${request.response_format}`, new Uint8Array(_))
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
                  body: TranscribeRequest.getHttpBody(request)
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
      OpenaiHttpClient.Default
    ]

  }) { }
