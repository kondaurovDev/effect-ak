import * as Effect from "effect/Effect";
import { FetchHttpClient, HttpClientRequest } from "@effect/platform";

import { makeHttpClient } from "../../http-client.js";

export class AnthropicHttpClient extends
  Effect.Service<AnthropicHttpClient>()("AnthropicHttpClient", {
    effect:
      Effect.gen(function* () {

        const client =
          yield* makeHttpClient({
            baseUrl: "https://api.anthropic.com/",
            vendorName: "anthropic",
            defaultHeaders: {
              "anthropic-version": "2023-06-01"
            },
            auth: {
              headerName: "x-api-key",
              tokenPrefix: ""
            }
          })

          return client;

      }),

    dependencies: [
      FetchHttpClient.layer
    ]

  }) { };
