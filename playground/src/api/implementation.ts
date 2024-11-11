import { HttpApi, HttpApiBuilder } from "@effect/platform";
import { Cause, Effect, Layer, pipe, Array } from "effect";

import { Openai, Stabilityai } from "@effect-ak/ai/vendor";
import * as Marked from "marked"

import { ApiEndpoints, PageEndpoints, StaticFilesEndpoints, UnknownError } from "./definition.js";
import { UtilService } from "../util.js";

export class BackendApi
  extends HttpApi.empty
    .add(ApiEndpoints)
    .add(PageEndpoints)
    .add(StaticFilesEndpoints) {

  static live =
    HttpApiBuilder.api(BackendApi)
      .pipe(
        Layer.provide(
          HttpApiBuilder.group(BackendApi, "api", handlers =>
            Effect.gen(function* () {
              const deps = {
                chatgpt: yield* Openai.OpenaiChatCompletionEndpoint,
                stabilityai: yield* Stabilityai.ImageGenerationService
              }

              return handlers
                .handle("ask-ai", ({ urlParams }) =>
                  pipe(
                    deps.chatgpt.complete({
                      model: "gpt4o",
                      systemMessage: "you are a helpful assistant",
                      userMessage: urlParams.question
                    }),
                    Effect.andThen(answer =>
                      Effect.tryPromise(() =>
                        Marked.parse(answer, { async: true })
                      )
                    ),
                    Effect.catchAllCause((error) =>
                      Effect.succeed(`
                        <pre class="bg-warning">
                          ${Cause.pretty(error, { renderErrorCause: true })}
                        </pre>
                      `)
                    )
                  )
                ).handle("generate-image", ({ urlParams }) =>
                  pipe(
                    deps.stabilityai.generateImageAndSave({
                      modelEndpoint: "/core",
                      prompt: urlParams.description
                    }),
                    Effect.tap(_ => Effect.logInfo("An image has been generated", _)),
                    Effect.andThen(filePath =>
                      /*html*/`<img
                        src="/img/"
                      />`
                    )
                  ).pipe(
                    Effect.tapErrorCause(Effect.logError),
                    Effect.catchAllCause(() =>
                      new UnknownError({ })
                    )
                  )
                )
            })
          )
        ),
        Layer.provide(
          HttpApiBuilder.group(BackendApi, "html", handlers =>
            Effect.gen(function* () {
              const util = yield* UtilService;
              return handlers
                .handle("ask-ai", ({ path }) =>
                  pipe(
                    util.readFileFromProjectRoot(
                      Array.modifyNonEmptyLast(["html", ...path.path], _ => _ + ".html")
                    ),
                    Effect.catchAll(() =>
                      Effect.fail(new UnknownError())
                    )
                  )
                )
            })
          )
        ),
        Layer.provide(
          HttpApiBuilder.group(BackendApi, "static", handlers =>
            Effect.gen(function* () {
              const util = yield* UtilService;
              return handlers
                .handle("css", ({ path }) =>
                  pipe(
                    util.readFileFromNodeModules(
                      Array.modifyNonEmptyLast([ ...path.path ], _ => _ + ".css"),
                    ),
                    Effect.catchAll(() =>
                      Effect.fail(new UnknownError())
                    )
                  )
                )
                .handle("js", ({ path }) =>
                  pipe(
                    util.readFileFromNodeModules(
                      Array.modifyNonEmptyLast([...path.path], _ => _ + ".js"),
                    ),
                    Effect.catchAll(() =>
                      Effect.fail(new UnknownError())
                    )
                  )
                )
            })
          )
        )
      ).pipe(
        Layer.provide([
          Openai.OpenaiChatCompletionEndpoint.Default,
          Stabilityai.ImageGenerationService.Default,
          UtilService.Default
        ])
      )
}
