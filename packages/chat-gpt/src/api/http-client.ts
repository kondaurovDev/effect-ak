import { FetchHttpClient, HttpClientRequest } from "@effect/platform";
import { Effect } from "effect";

import { makeJsonHttpClient } from "@efkit/shared/misc";

export class ChatGptHttpClient
  extends Effect.Service<ChatGptHttpClient>()("ChatGptHttpClient", {
    effect:
      Effect.gen(function* () {

        const client =
          yield* makeJsonHttpClient({
            baseUrl: "https://api.openai.com",
            defaultHeaders: {},
            auth: {
              headerName: "Authorization",
              tokenConfigName: "chatgptToken",
              isBearer: true,
            }
          })

        return {
          ...client
        } as const;

      }),

    dependencies: [
      FetchHttpClient.layer
    ]

  }) { }
