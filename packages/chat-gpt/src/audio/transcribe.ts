import { Effect, pipe } from "effect";
import { HttpBody, HttpClientRequest } from "@effect/platform"
import { Schema as S } from "@effect/schema";
import { File } from "buffer"


import { RestClient as GptRestClient } from "../client"

// supported: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm

export const transcribeAudio = (
  file: File,
  language?: string
) =>
  Effect.Do.pipe(
    Effect.let("formData", () => {
      const formData = new global.FormData();
      formData.append("model", "whisper-1");
      formData.append("response_format", "json");
      if (language) {
        formData.append("language", language)
      }
      formData.append("file", file, file.name);
      return HttpBody.formData(formData);
    }),
    Effect.bind("client", () => GptRestClient),
    Effect.andThen(({ client, formData }) =>
      pipe(
        client(
          HttpClientRequest.post(
            `/v1/audio/transcriptions`, {
              body: formData
            }
          )
        ).json,
        Effect.andThen(
          S.validate(S.Struct({ text: S.String }))
        )
      )
    )
  );
