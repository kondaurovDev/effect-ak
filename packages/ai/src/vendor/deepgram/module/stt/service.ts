import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as S from "effect/Schema";

import { DeepgramHttpClient } from "../../api/http-client.js";
import { TranscribeVoiceResponse } from "./schema/response.js";

export class SpeachToTextService
  extends Effect.Service<SpeachToTextService>()("SpeachToTextService", {
    effect:
      Effect.gen(function* () {

        const httpClient = yield* DeepgramHttpClient;

        const getTranscription = (
          audioBytes: Uint8Array,
          contentType: string
        ) =>
          pipe(
            httpClient.getJson(
              HttpClientRequest.post("/listen", {
                body: HttpBody.uint8Array(audioBytes),
                headers: {
                  "Content-type": contentType
                },
                urlParams: {
                  language: "ru",
                  model: "base",
                  filler_words: true,
                  punctuate: true,
                  intents: true
                }
              })
            ),
            Effect.tap(Effect.logInfo),
            Effect.andThen(
              S.decodeUnknown(TranscribeVoiceResponse, { onExcessProperty: "ignore" })
            )
          )

        return {
          getTranscription
        } as const;
      }),

      dependencies: [
        DeepgramHttpClient.Default
      ]
  }) { }