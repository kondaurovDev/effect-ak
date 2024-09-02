import { Context, Effect, Layer, pipe } from "effect";
import { Schema as S } from "@effect/schema"
import { HttpBody, HttpClientRequest } from "@effect/platform";

import { ChatCompletionRequest } from "./request.js"
import { ChatCompletionResponse } from "./response.js"
import { RestClient, RestClientLive, ValidJsonError } from "../client.js"
import { GptToken } from "../token.js";

type CompletionService = {
  complete: (request: ChatCompletionRequest) => Effect.Effect<ChatCompletionResponse, HttpBody.HttpBodyError | ValidJsonError, GptToken>
}

export class Completion extends
  Context.Tag("ChatGPT.CompletionService")<CompletionService, CompletionService>() { };

export const CompletionLive =
  Layer.effect(
    Completion,
    Effect.Do.pipe(
      Effect.bind("restClient", () => RestClient),
      Effect.let("complete", ({ restClient }) =>
        (request: ChatCompletionRequest) =>
          pipe(
            Effect.logDebug("request", request),
            Effect.andThen(
              HttpBody.json(request),
            ),
            Effect.andThen(body =>
              restClient(
                HttpClientRequest.post(
                  `/v1/chat/completions`, {
                  body
                })
              ).json
            ),
            Effect.tap(response =>
              Effect.logDebug("response", response)
            ),
            Effect.andThen(response =>
              S.decodeUnknown(ChatCompletionResponse)(response)
            )
          )
      ),
      Effect.andThen(({ complete }) =>
        Completion.of({
          complete
        })
      ),
    )
  ).pipe(
    Layer.provide(RestClientLive)
  );


