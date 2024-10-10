import { pipe, Effect } from "effect";
import { HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { Schema as S } from "@effect/schema";

import { ChatGptHttpClient } from "./http-client.js";

export class BaseEndpoint
  extends Effect.Service<BaseEndpoint>()("ChatGpt.BaseEndpoint", {
    effect:
      Effect.gen(function* () {

        const httpClient = yield* ChatGptHttpClient;

        const getBuffer =
          (request: HttpClientRequest.HttpClientRequest) =>
            pipe(
              httpClient.executeRequest(request),
              Effect.andThen(_ => _.arrayBuffer),
              Effect.andThen(Buffer.from),
              Effect.scoped
            )

        const getJson =
          (request: HttpClientRequest.HttpClientRequest) =>
            pipe(
              httpClient.executeRequest(request),
              Effect.andThen(response =>
                HttpClientResponse.schemaBodyJson(S.Unknown)(response)
              ),
              Effect.tap(response =>
                Effect.logDebug("chat gpt response", response)
              ),
              Effect.scoped
            )

        const getTyped =
          <I, I2>(request: HttpClientRequest.HttpClientRequest, schema: S.Schema<I, I2>) =>
            pipe(
              getJson(request),
              Effect.andThen(S.decodeUnknown(schema)),
              Effect.scoped
            )

        return {
          getBuffer, getJson, getTyped
        }

      }),

      dependencies: [
        ChatGptHttpClient.Default
      ]

  }) {};

