import { Effect, pipe } from "effect";
import { HttpBody, HttpClientRequest } from "@effect/platform";
import { ChatCompletionService } from "@efkit/shared/context";

import { ClaudeHttpClient } from "../api/http-client.js";
import { MessageCompletionRequest, MessageResponse, TextMessageContent } from "./schema/index.js";

export class TextCompletionService
  extends Effect.Service<TextCompletionService>()("TextCompletionService", {
    effect:
      Effect.gen(function* () {

        const httpClient = yield* ClaudeHttpClient;

        const completeChat = (
          request: MessageCompletionRequest
        ) =>
          pipe(
            Effect.logDebug("complete request", request),
            Effect.andThen(
              HttpBody.json(request),
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

        const completeChatImpl =
          ChatCompletionService.of({
            complete: (input) =>
              pipe(
                Effect.succeed(
                  MessageCompletionRequest.make({
                    model: "claude-3-5-sonnet-20240620",
                    system: input.systemMessage,
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
                Effect.andThen(_ => _.text),
                Effect.runPromise
              )
          })

        return {
          completeChat, ...completeChatImpl
        } as const;

      })
  }) { }