import { Effect } from "effect";
import { FileSystem, HttpBody, HttpClientRequest } from "@effect/platform"

import { RestClient as GptRestClient } from "../client"

type Voice = 
  "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer"

type ResponseFormat =
  "mp3" | "opus" | "aac" | "flac" | "wav" | "pcm"

export const createSpeech = (
  textInput: string,
  model: "tts-1" | "tts-1-hd",
  voice: Voice,
  responseFormat: ResponseFormat,
  fileName: string,
  speed = 1
) =>
  Effect.Do.pipe(
    Effect.bind("client", () => GptRestClient),
    Effect.bind("body", () =>
      HttpBody.json({
        model,
        input: textInput,
        voice,
        response_format: responseFormat,
        speed
      })
    ),
    Effect.bind("fileBytes", ({ client, body }) =>
      client(
        HttpClientRequest.post(
          `/v1/audio/speech`, {
            body
          }
        )
      ).buffer
    ),
    Effect.bind("fs", () => FileSystem.FileSystem),
    Effect.andThen(({ fs, fileBytes }) =>
      fs.writeFile(fileName, new Uint8Array(fileBytes))
    )
  )


