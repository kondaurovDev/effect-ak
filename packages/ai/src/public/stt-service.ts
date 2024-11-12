import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";

import { Openai, Deepgram } from "../vendor/index.js";

type VoiceFileInput = {
  fileContent: Uint8Array,
  fileName: string
}

export class AiSpeechToTextService
  extends Effect.Service<AiSpeechToTextService>()("AiSpeechToTextService", {
    effect:
      Effect.gen(function* () {

        const dependencies = {
          whisper: yield* Openai.Audio.OpenaiSpeechToText,
          deepgramStt: yield* Deepgram.SpeachToTextService,
          gpt4o: yield* Openai.Text.TextService
        }

        const makeTrascriber =
          (input: VoiceFileInput) => ({
            whisper:
              dependencies.whisper.transcribe({
                fileContent: input.fileContent,
                fileName: input.fileName,
                model: "whisper-1",
                response_format: "json"
              }),
            nova2:
              pipe(
                dependencies.deepgramStt.getTranscription(input.fileContent, "audio/webm"),
                Effect.andThen(_ => _.results.channels[0].alternatives[0].transcript),
                Effect.merge
              ),
            gpt4o:
              dependencies.gpt4o.completeText({
                model: "gpt-4o-audio-preview",
                messages: [
                  {
                    role: "system",
                    content: "your task is to transcribe user's speech, don't try to fix errors, let them be. Multiple languages might be used"
                  },
                  {
                    role: "user",
                    content: [
                      {
                        type: "input_audio",
                        input_audio: {
                          data: Buffer.from(input.fileContent).toString("base64"),
                          format: "wav"
                        }
                      }
                    ]
                  }
                ],
              })
          })

        const trascribeDemo =
          (input: VoiceFileInput) => {
            const trascriber = makeTrascriber(input);

            return Effect.all(
              {
                whisper: trascriber.whisper,
                nova2: trascriber.nova2,
                gpt4o: trascriber.gpt4o,
              },
              { concurrency: "unbounded" }
            )
          }

        return {
          trascribeDemo, makeTrascriber
        } as const;

      }),

      dependencies: [
        Openai.Audio.OpenaiSpeechToText.Default,
        Deepgram.SpeachToTextService.Default,
        Openai.Text.TextService.Default
      ]
  }) { }
