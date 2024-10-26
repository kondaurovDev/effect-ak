import { Effect } from "effect";
import { FetchHttpClient, HttpClientRequest } from "@effect/platform";
import * as S from "effect/Schema";;

import { makeJsonHttpClient } from "../../../internal/json-http-client.js";

export class DeepgramHttpClient extends
  Effect.Service<DeepgramHttpClient>()("DeepgramHttpClient", {
    effect:
      Effect.gen(function* () {

        const httpClient =
          yield* makeJsonHttpClient({
            baseUrl: "https://api.deepgram.com/v1",
            defaultHeaders: {},
            auth: {
              headerName: "Authorization",
              isBearer: false,
              tokenConfigName: "deepgramToken"
            }
          });

        return {
          ...httpClient
        } as const;

      }),

    dependencies: [
      FetchHttpClient.layer
    ]

  }) { };
