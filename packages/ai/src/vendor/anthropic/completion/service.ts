import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";

import { AnthropicHttpClient } from "../api/http-client.js";
import { ChatCompletionInterface, ProviderName } from "../../../internal/chat-completion.js";
import { MessageCompletionRequest, MessageResponse, TextMessageContent } from "./schema/index.js";

export class AnthropicCompletionService
  extends Effect.Service<AnthropicCompletionService>()("AnthropicCompletionService", {
    effect:
      Effect.gen(function* () {

        const httpClient = yield* AnthropicHttpClient;

        const completeChat = (
          request: MessageCompletionRequest
        ) =>
          pipe(
            Effect.logDebug("complete request", request),
            Effect.andThen(
              HttpBody.json(request)
            ),
            Effect.andThen(requestBody =>
              httpClient.getTyped(
                HttpClientRequest.post(
                  `/v1/messages`,
                  {
                    body: requestBody
                  }
                ),
                MessageResponse
              ),
            )
          )

        const completeChatImpl: ChatCompletionInterface = {
          provider: "anthropic",
          complete: (input) =>
            pipe(
              Effect.succeed(
                MessageCompletionRequest.make({
                  model: "claude-3-5-sonnet-20241022",
                  system: input.systemMessage,
                  max_tokens: 1000,
                  messages: [
                    {
                      role: "user",
                      content: [
                        TextMessageContent.make({
                          type: "text",
                          text: input.userMessage
                        })
                      ]
                    }
                  ]
                })
              ),
              Effect.andThen(completeChat),
              Effect.andThen(_ => _.content[0]),
              Effect.filterOrFail(
                _ => _.type == "text",
                _ => `Expected text response but got '${_.type}'`
              ),
              Effect.andThen(_ => _.text)
            )
        }

        return {
          completeChat, ...completeChatImpl
        } as const;

      }),

      dependencies: [
        AnthropicHttpClient.Default
      ]
  }) { }
