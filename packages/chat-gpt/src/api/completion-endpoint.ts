import { Effect, pipe } from "effect";
import { HttpBody, HttpClientRequest } from "@effect/platform";

import { ChatCompletionResponse, OneOfRequest } from "../modules/text/schema/index.js"
import { BaseEndpoint } from "../api/base-endpoint.js"

export class CompletionEndpoint extends
  Effect.Service<CompletionEndpoint>()("ChatGPT.Endpoint.Completions", {
    effect:
      Effect.gen(function* () {

        const baseEndpoint = yield* BaseEndpoint;

        const completeChat =
          (request: OneOfRequest) =>
            pipe(
              Effect.logDebug("request", request),
              Effect.andThen(
                HttpBody.json(request),
              ),
              Effect.andThen(body =>
                baseEndpoint.getTyped(
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

        return {
          completeChat
        } as const;

      }),

      dependencies: [
        BaseEndpoint.Default
      ]
    
  }) { };

