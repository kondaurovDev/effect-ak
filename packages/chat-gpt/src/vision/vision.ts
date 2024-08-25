import { Brand, Effect, pipe } from "effect";
import { Schema as S } from "@effect/schema";

import * as ChatCompletion from "../completion/index.js";

export type ImageBytes = Uint8Array & Brand.Brand<"ImageBytes">;
export const ImageBytes = Brand.nominal<ImageBytes>();

export type ImagePrompt = string & Brand.Brand<"ImagePrompt">;
export const ImagePrompt = Brand.nominal<ImagePrompt>();

export const inlineImage = (
  bytes: Uint8Array
) =>
  ({
    type: "image_url",
    image_url: {
      url: `data:image/jpeg;base64,${Buffer.from(bytes).toString("base64")}`
    }
  } as ChatCompletion.MessageContent)

export const imagePrompt = (
  intent: ImagePrompt,
  imageContent: ChatCompletion.MessageContent
) =>
  pipe(
    ChatCompletion.CompletionService,
    Effect.andThen(({ complete }) =>
      pipe(
        S.decode(ChatCompletion.ChatCompletionRequest)({
          model: "gpt-4o",
          max_tokens: 100,
          messages: [
            {
              role: "user", content: [
                {
                  type: "text",
                  text: intent
                },
                imageContent
              ],
            }
          ]
        }).pipe(
          Effect.mapError(error =>
            new ChatCompletion.CompletionError({ errorCode: "ClientError", cause: error })
          )
        ),
        Effect.andThen(complete),
        Effect.andThen(_ => _.firstChoice),
        Effect.andThen(_ => _.message.content),
      )
    )
  )
