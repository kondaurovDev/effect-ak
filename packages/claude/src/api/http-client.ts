import { Effect } from "effect";
import { FetchHttpClient, HttpClientRequest } from "@effect/platform";
import { makeJsonHttpClient } from "@efkit/shared/misc";

export class ClaudeHttpClient extends
  Effect.Service<ClaudeHttpClient>()("ClaudeHttpClient", {
    effect:
      Effect.gen(function* () {

        const client =
          yield* makeJsonHttpClient({
            baseUrl: "https://api.anthropic.com/",
            defaultHeaders: {
              "anthropic-version": "2023-06-01"
            },
            auth: {
              headerName: "x-api-key",
              tokenConfigName: "claudeToken",
              isBearer: false
            }
          })

          return client;

      }),

    dependencies: [
      FetchHttpClient.layer
    ]

  }) { };
