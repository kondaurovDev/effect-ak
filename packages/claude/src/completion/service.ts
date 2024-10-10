import { Effect, pipe } from "effect";
import { HttpBody, HttpClientRequest } from "@effect/platform";

import { ClaudeHttpClient } from "../api/http-client.js";
import { MessageCompletionRequestInput, MessageResponse } from "./schema/index.js";

export class TextCompletionService
  extends Effect.Service<TextCompletionService>()("TextCompletionService", {
    effect:
      Effect.gen(function* () {

        const httpClient = yield* ClaudeHttpClient;

        const completeChat = (
          request: MessageCompletionRequestInput
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

        return {
          completeChat
        } as const;

      })
  }) { }