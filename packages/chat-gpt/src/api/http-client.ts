import { FetchHttpClient, HttpClientRequest } from "@effect/platform";
import { Effect } from "effect";

import { makeJsonHttpClient } from "@efkit/shared/misc";
import { chatGptTokenConfigKey } from "./const.js";

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
              tokenConfigName: chatGptTokenConfigKey,
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

  }) {}
