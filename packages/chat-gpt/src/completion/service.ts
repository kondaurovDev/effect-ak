import { Context, Effect, Layer, pipe } from "effect";
import { Schema as S } from "@effect/schema"
import { HttpBody, HttpClientRequest } from "@effect/platform";

import { ChatCompletionRequest } from "./request"
import { ChatCompletionResponse } from "./response"
import { RestClient, RestClientLive, ValidJsonError } from "../client"

type CompletionService = (
  _: ChatCompletionRequest
) => Effect.Effect<ChatCompletionResponse, HttpBody.HttpBodyError | ValidJsonError >

export const CompletionService =
  Context.GenericTag<CompletionService>("ChatGPT.Completion");

export const CompletionServiceLayer =
  Layer.effect(
    CompletionService,
    pipe(
      RestClient,
      Effect.andThen(client =>
        CompletionService.of(
          request =>
            pipe(
              Effect.logDebug("request", request),
              Effect.andThen(
                HttpBody.json(request),
              ),
              Effect.andThen(body =>
                client(
                  HttpClientRequest.post(
                    `/v1/chat/completions`, {
                    body
                  })
                ).json
              ),
              Effect.tap(response =>
                Effect.logDebug("response", response)
              ),
              Effect.andThen(S.decodeUnknown(ChatCompletionResponse)),
            )
        )
      ),
    )
  );

export const CompletionServiceLive =
  pipe(
    CompletionServiceLayer,
    Layer.provide(RestClientLive)
  )
