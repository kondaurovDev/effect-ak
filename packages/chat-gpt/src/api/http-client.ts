import { FetchHttpClient, HttpClient, HttpClientRequest } from "@effect/platform";
import { Effect, pipe, Redacted } from "effect";

import { GptTokenProvider } from "./token.js";

export class ChatGptHttpClient
  extends Effect.Service<ChatGptHttpClient>()("ChatGptHttpClient", {
    effect:
      Effect.gen(function* () {

        const baseUrl = "https://api.openai.com";

        const httpClient = 
          (yield* HttpClient.HttpClient).pipe(
            HttpClient.filterStatusOk,
            HttpClient.mapRequest(
              HttpClientRequest.prependUrl(baseUrl)
            )
          );

        const executeRequest = (
          request: HttpClientRequest.HttpClientRequest
        ) =>
          pipe(
            GptTokenProvider,
            Effect.andThen(token =>
              pipe(
                request,
                HttpClientRequest.setHeader("Authorization", `Bearer ${Redacted.value(token)}`)
              )
            ),
            Effect.andThen(httpClient.execute),
            Effect.tapErrorTag("ResponseError", error =>
              pipe(
                error.response.text,
                Effect.andThen(_ => Effect.logError("http api bad response", _))
              )
            )
          );

        return {
          executeRequest
        } as const;

      }),

    dependencies: [
      FetchHttpClient.layer
    ]

  }) { }
