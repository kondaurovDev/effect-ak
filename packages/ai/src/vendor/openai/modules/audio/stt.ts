import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";

import { OpenaiHttpClient } from "../../api/index.js";
import { TranscribeRequest } from "./schema/request.js";
import { OneOfTranscriptionResponse } from "./schema/response.js";

export class OpenaiSpeechToText
  extends Effect.Service<OpenaiSpeechToText>()("OpenaiSpeechToText", {
    effect:
      Effect.gen(function* () {

        const httpClient = yield* OpenaiHttpClient;

        const transcribe =
          (request: TranscribeRequest) =>
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
          transcribe
        } as const;

      }),

    dependencies: [
      OpenaiHttpClient.Default
    ]

  }) { }
