import { Effect, pipe } from "effect";
import { HttpBody, HttpClientRequest } from "@effect/platform";

import { ChatCompletionInterface, ProviderName } from "../../../interface/chat-completion.js";
import { 
  ChatCompletionRequest, ChatCompletionResponse, OneOfRequest, SystemMessage, UserMessage 
} from "../modules/text/schema/index.js"
import { OpenaiHttpClient } from "./http-client.js";

export class OpenaiChatCompletionEndpoint extends
  Effect.Service<OpenaiChatCompletionEndpoint>()("OpenaiChatCompletionEndpoint", {
    effect:
      Effect.gen(function* () {

        const httpClient = yield* OpenaiHttpClient;

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

        const chatCompletionService: ChatCompletionInterface = {
          provider: ProviderName.make("openai"),
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
              Effect.andThen(_ => _.text)
            )
        } as const;

        return {
          completeChat, ...chatCompletionService
        } as const;

      }),

    dependencies: [
      OpenaiHttpClient.Default
    ]

  }) { };

