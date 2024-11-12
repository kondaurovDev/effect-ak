import { HttpApiBuilder } from "@effect/platform";
import { Cause, Effect, pipe, String } from "effect";

import { Openai, Stabilityai } from "@effect-ak/ai/vendor";
import { AiSettingsProvider } from "@effect-ak/ai/internal";

import * as Marked from "marked"

import { UnknownError } from "../definition.js";
import { BackendApi } from "../http-api.js";

export const apiRoute = 
  HttpApiBuilder.group(BackendApi, "api", handlers =>
    Effect.gen(function* () {
      const deps = {
        chatgpt: yield* Openai.OpenaiChatCompletionEndpoint,
        stabilityai: yield* Stabilityai.ImageGenerationService,
        settings: yield* AiSettingsProvider
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
            Effect.andThen(file =>
            /*html*/`
            <img
              class="img-fluid w-50"
              src="/image/ai/${file.name}"
              alt="Generated image by AI"
            />
            `
            )
          ).pipe(
            Effect.tapErrorCause(Effect.logError),
            Effect.catchAllCause(() =>
              new UnknownError({})
            )
          )
        ).handle("debug", () =>
          Effect.succeed(`
            <span>${deps.settings.outDir}</stan>  
          `)
        )
    })
  )
