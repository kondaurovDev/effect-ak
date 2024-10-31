import { Effect } from "effect";
import { FetchHttpClient, HttpClientRequest } from "@effect/platform";

import { makeJsonHttpClient } from "../../../internal/json-http-client.js";

export class AnthropicHttpClient extends
  Effect.Service<AnthropicHttpClient>()("AnthropicHttpClient", {
    effect:
      Effect.gen(function* () {

        const client =
          yield* makeJsonHttpClient({
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
