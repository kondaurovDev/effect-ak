import { Context, Effect, Layer, pipe } from "effect";
import { Schema as S } from "@effect/schema"
import { HttpBody, HttpClientRequest } from "@effect/platform";

import { ChatCompletionRequest, OneOfRequest } from "../text/schema/request.js"
import { ChatCompletionResponse } from "../text/schema/response.js"
import { BaseEndpoint, ValidJsonError } from "../api/base-endpoint.js"
import { TokenProvider } from "../api/token.js";

type MethodResult<A> = 
  Effect.Effect<A, HttpBody.HttpBodyError | ValidJsonError, TokenProvider>

export type CompletionEndpointInterface = {
  executeRequest(request: OneOfRequest): MethodResult<ChatCompletionResponse>
}

export class CompletionEndpoint extends
  Context.Tag("ChatGPT.Endpoint.Completions")<CompletionEndpoint, CompletionEndpointInterface>() {

    static live = 
      Layer.scoped(
        CompletionEndpoint,
        pipe(
          Effect.Do,
          Effect.bind("baseEndpoint", () => BaseEndpoint),
          Effect.let("executeRequest", ({ baseEndpoint }) =>
            (request: ChatCompletionRequest) =>
              pipe(
                Effect.logDebug("request", request),
                Effect.andThen(
                  HttpBody.json(request),
                ),
                Effect.andThen(body =>
                  baseEndpoint.execute(
                    HttpClientRequest.post(
                      `/v1/chat/completions`, {
                        body
                      }
                    )
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
          Effect.andThen(({ executeRequest }) =>
            CompletionEndpoint.of({
              executeRequest
            })
          ),
        )
      ).pipe(
        Layer.provide(BaseEndpoint.live)
      )


  };

