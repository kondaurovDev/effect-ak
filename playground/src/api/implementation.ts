import { FileSystem, HttpApi, HttpApiBuilder } from "@effect/platform";
import { Config, Effect, Layer, pipe } from "effect";
import { readFile } from "fs/promises"
import { Deepgram, Openai, Stabilityai } from "@effect-ak/ai/vendor"

import { Endpoints, UnknownError } from "./definition.js";
import { htmlPage } from "./enrypoint.js";
import { CompileVueService } from "../compile-service.js";

const readFileEffect = (
  path: string
) =>
  pipe(
    Effect.succeed(__dirname + `/../../${path}`),
    Effect.tap(_ => Effect.logInfo("reading file", _)),
    Effect.andThen(file =>
      Effect.tryPromise(() => readFile(file))
    ),
    Effect.andThen(_ => _.toString("utf-8")),
    Effect.catchAll(() => Effect.succeed(""))
  )

export class BackendApi
  extends HttpApi.empty.add(Endpoints) {

  static live =
    HttpApiBuilder.api(BackendApi)
      .pipe(
        Layer.provide(
          HttpApiBuilder.group(BackendApi, "endpoints", handlers =>
            Effect.gen(function* () {

              const compileService = yield* CompileVueService;
              const whisperService = yield* Openai.Audio.AudioService;
              const deepgramStt = yield* Deepgram.SpeachToTextService;
              const stabilityai = yield* Stabilityai.ImageGenerationService;
              const gpt4o = yield* Openai.Text.TextService;
              const fs = yield* FileSystem.FileSystem;

              return handlers
                .handle("verbose", () =>
                  pipe(
                    Config.hashMap(Config.nonEmptyString(), "openai"),
                    Effect.catchAll(() =>
                      Effect.fail(new UnknownError())
                    )
                  )
                )
                .handle("transcribe", ({ payload }) =>
                  pipe(
                    fs.readFile(payload.audioFile.path),
                    Effect.andThen(fileContent =>
                      Effect.all({
                        whisper: 
                          whisperService.transcribe({
                            fileContent: fileContent,
                            fileName: payload.audioFile.name,
                            model: "whisper-1",
                            response_format: "json"
                          }),
                        nova2:
                          pipe(
                            deepgramStt.getTranscription(fileContent, "audio/webm"),
                            Effect.andThen(_ => _.results.channels[0].alternatives[0].transcript),
                            Effect.merge
                          ),
                        gpt4o:
                          gpt4o.complete({
                            model: "gpt-4o-audio-preview",
                            messages: [
                              {
                                role: "system",
                                content: "your task is to transcribe user's speech, don't try to fix errors, let them be. Multiple languages might be used. Also, give json object with keys: transcription, grammarErrorsCount, fluency (in %)"
                              },
                              {
                                role: "user",
                                content: [
                                  {
                                    type: "input_audio",
                                    input_audio: {
                                      data: Buffer.from(fileContent).toString("base64"),
                                      format: "wav"
                                    }
                                  }
                                ]
                              }
                            ],
                          })
                      }, { concurrency: "unbounded" }),
                        
                    ),
                    Effect.tapError(Effect.logError),
                    Effect.catchAll(() =>
                      Effect.fail(new UnknownError())
                    )
                  )
                )
                .handle("generateImage", ({ payload }) =>
                  pipe(
                    stabilityai.generateImage({
                      prompt: payload.prompt
                    }),
                    Effect.tapError(Effect.logError),
                    Effect.catchAll(() =>
                      Effect.fail(new UnknownError())
                    )
                  )
                )
                .handle("compile", () =>
                  pipe(
                    compileService.compileAll,
                    Effect.tapError(Effect.logError),
                    Effect.catchAll(() =>
                      Effect.fail(new UnknownError())
                    )
                  )
                )
                .handle("rootPage", () =>
                  Effect.succeed(htmlPage("main"))
                )
                .handle("page", ({ path }) =>
                  Effect.succeed(htmlPage(path.pageName))
                )
                .handle("vue-component", (params) =>
                  params.path.path.endsWith(".map") ?
                    pipe(
                      readFileEffect(`.out/${params.path.path}.js.map`),
                      Effect.andThen(input =>
                        Effect.try(() => JSON.parse(input))
                      ),
                      Effect.mapError(() => new UnknownError())
                    ) :
                    readFileEffect(`.out/${params.path.path}.js`)
                )
                .handle("vue-component-style", (params) =>
                  readFileEffect(`.out/${params.path.path}.css`)
                )
                .handle("vendorJs", (params) =>
                  params.path.path.at(-1)?.endsWith(".js.map") === true ?
                    pipe(
                      Effect.logInfo("reading vendor js source map file"),
                      Effect.andThen(
                        readFileEffect(`node_modules/${params.path.path.join("/")}`)
                      ),
                      Effect.andThen(input =>
                        Effect.try(() => JSON.parse(input))
                      ),
                      Effect.mapError(() => new UnknownError())
                    ) :
                    readFileEffect(`node_modules/${params.path.path.join("/")}`)
                )
                .handle("vendorCss", (params) =>
                  readFileEffect(`node_modules/${params.path.path.join("/")}.css`)
                )
            })
          )
        )
      ).pipe(
        Layer.provide([
          Openai.Text.TextService.Default,
          CompileVueService.Default,
          Deepgram.SpeachToTextService.Default,
          Openai.Audio.AudioService.Default,
          Stabilityai.ImageGenerationService.Default
        ])
      )
}
