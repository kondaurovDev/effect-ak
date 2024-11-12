import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import { FileSystem } from "@effect/platform/FileSystem";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";

import { OpenaiHttpClient } from "../../api/index.js";
import { CreateSpeechRequest } from "./schema/request.js";
import { AiSettingsProvider } from "../../../../internal/settings.js";

export class OpenaiTextToSpeech
  extends Effect.Service<OpenaiTextToSpeech>()("OpenaiTextToSpeech", {
    effect:
      Effect.gen(function* () {

        const httpClient = yield* OpenaiHttpClient;
        const fs = yield* FileSystem;
        const tmpDir =
          yield* AiSettingsProvider

        const createSpeech =
          (request: CreateSpeechRequest) =>
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

        return {
          createSpeech
        } as const;

      }),

    dependencies: [
      OpenaiHttpClient.Default,
      AiSettingsProvider.Default
    ]

  }) { }
