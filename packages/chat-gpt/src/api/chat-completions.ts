import { Effect, pipe } from "effect";
import { HttpBody, HttpClientRequest } from "@effect/platform";
import { ChatCompletionService } from "@efkit/shared/context";

import { ChatCompletionRequest, ChatCompletionResponse, OneOfRequest, SystemMessage, UserMessage } from "../modules/text/schema/index.js"
import { ChatGptHttpClient } from "./http-client.js";

export class CompletionEndpoint extends
  Effect.Service<CompletionEndpoint>()("ChatGpt.ChatCompetionEndpoint", {
    effect:
      Effect.gen(function* () {

        const httpClient = yield* ChatGptHttpClient;

        const completeChat =
          (request: OneOfRequest) =>
            pipe(
              Effect.logDebug("request", request),
              Effect.andThen(
                HttpBody.json(request),
              ),
              Effect.andThen(body =>
                httpClient.getTyped(
                  HttpClientRequest.post(
                    `/v1/chat/completions`,
                    {
                      body
                    }
                  ),
                  ChatCompletionResponse
                )
              )
            )

        const chatCompletionService =
          ChatCompletionService.of({
            complete: input =>
              pipe(
                Effect.succeed(
                  ChatCompletionRequest.make({
                    model: "gpt-4o",
                    messages: [
                      SystemMessage.make({
                        role: "system",
                        content: input.systemMessage
                      }),
                      UserMessage.make({
                        role: "user",
                        content: input.userMessage
                      }),
                    ]
                  })
                ),
                Effect.andThen(completeChat),
                Effect.andThen(_ => _.firstChoice),
                Effect.andThen(_ => _.text),
                Effect.runPromise
              )
          })

        return {
          completeChat, ...chatCompletionService
        } as const;

      }),

    dependencies: [
      ChatGptHttpClient.Default
    ]

  }) { };

