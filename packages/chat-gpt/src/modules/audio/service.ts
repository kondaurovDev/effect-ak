import { Config, Context, Effect, Layer, pipe } from "effect";
import { FileSystem, HttpBody, HttpClientRequest } from "@effect/platform";
import { Schema as S } from "@effect/schema";

import { TokenProvider, BaseEndpoint } from "../../api/index.js";
import { CreateSpeechRequest, TranscribeRequest } from "./schema/request.js";
import { OneOfTranscriptionResponse } from "./schema/response.js";

export type AudioServiceInterface = {
  createSpeech(_: CreateSpeechRequest): Effect.Effect<void, unknown, TokenProvider>,
  transcribe(_: TranscribeRequest): Effect.Effect<string, unknown, TokenProvider>,
}

export class AudioService
  extends Context.Tag("AudioService")<AudioService, AudioServiceInterface>() {

  static live =
    Layer.effect(
      AudioService,
      pipe(
        Effect.Do,
        Effect.bind("baseEndpoint", () => BaseEndpoint),
        Effect.bind("fs", () => FileSystem.FileSystem),
        Effect.bind("tmpDir", () => 
          Config.nonEmptyString("temporary_dir")
        ),
        Effect.andThen(({ baseEndpoint, fs, tmpDir }) =>
          AudioService.of({
            createSpeech: request =>
              pipe(
                Effect.Do,
                Effect.bind("requestBody", () =>
                  HttpBody.json(request),
                ),
                Effect.bind("fileBytes", ({ requestBody }) =>
                  baseEndpoint.execute(
                    HttpClientRequest.post(
                      `/v1/audio/speech`, {
                        body: requestBody
                      }
                    )
                  ).buffer
                ),
                Effect.andThen(({ fileBytes }) =>
                  fs.writeFile(tmpDir + '/' + `text.${request.response_format}`, new Uint8Array(fileBytes))
                )
              ),
            transcribe: request =>
                pipe(
                  Effect.Do,
                  Effect.let("formData", () => {
                    const formData = new global.FormData();
                    formData.append("model", request.model);
                    formData.append("response_format", request.response_format);
                    if (request.language) {
                      formData.append("language", request.language)
                    }
                    formData.append("file", request.fileContent, request.fileName);
                    return HttpBody.formData(formData);
                  }), 
                  Effect.andThen(({ formData }) =>
                    pipe(
                      baseEndpoint.execute(
                        HttpClientRequest.post(
                          `/v1/audio/transcriptions`, {
                            body: formData
                          }
                        )
                      ).json,
                      Effect.andThen(
                        S.decodeUnknown(OneOfTranscriptionResponse)
                      ),
                      Effect.andThen(_ => _.text)
                    )
                  )
                )
          })
        )
      )
    ).pipe(
      Layer.provide(BaseEndpoint.live)
    )

}