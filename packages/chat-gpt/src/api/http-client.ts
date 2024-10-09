import { FetchHttpClient, HttpClient, HttpClientRequest } from "@effect/platform";
import { Effect, pipe, Redacted } from "effect";

import { TokenProvider } from "./token.js";

export class ChatGptHttpClient
  extends Effect.Service<ChatGptHttpClient>()("ChatGptHttpClient", {
    effect:
      Effect.gen(function* () {

        const baseUrl = "https://api.openai.com";

        const httpClient = yield* HttpClient.HttpClient;

        const executeAuthorizedRequest = (
          request: HttpClientRequest.HttpClientRequest
        ) =>
          pipe(
            TokenProvider,
            Effect.andThen(token =>
              pipe(
                request,
                HttpClientRequest.setHeader("Authorization", `Bearer ${Redacted.value(token)}`),
                HttpClientRequest.prependUrl(baseUrl)
              )
            ),
            Effect.andThen(httpClient.execute)
          )

        return {
          executeAuthorizedRequest
        } as const;

      }),

    dependencies: [
      FetchHttpClient.layer,
      TokenProvider.live
    ]

  }) { }
