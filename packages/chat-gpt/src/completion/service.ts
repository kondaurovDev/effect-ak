import { Context, Effect, Layer, pipe } from "effect";
import { Schema as S } from "@effect/schema"
import { HttpBody, HttpClientRequest } from "@effect/platform";

import { ChatCompletionRequest } from "./request.js"
import { ChatCompletionResponse } from "./response.js"
import { RestClient, RestClientLive, ValidJsonError } from "../client.js"
import { GptTokenValue } from "../token.js";

export class CompletionService extends
  Context.Tag("ChatGPT.CompletionService")<
    CompletionService, {
      complete: (request: ChatCompletionRequest) => Effect.Effect<ChatCompletionResponse, HttpBody.HttpBodyError | ValidJsonError, GptTokenValue >
    }
  >() {};

export const CompletionServiceLayer =
  Layer.effect(
    CompletionService,
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
        CompletionService.of({
          complete
        })
      ),
    )
  );

export const CompletionServiceLive =
  pipe(
    CompletionServiceLayer,
    Layer.provide(RestClientLive)
  )
