import * as Effect from "effect/Effect";
import * as FetchHttpClient from "@effect/platform/FetchHttpClient";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as S from "effect/Schema";

import { makeHttpClient } from "../../../internal/http-client.js";

export class DeepgramHttpClient extends
  Effect.Service<DeepgramHttpClient>()("DeepgramHttpClient", {
    effect:
      Effect.gen(function* () {

        const httpClient =
          yield* makeHttpClient({
            baseUrl: "https://api.deepgram.com/v1",
            vendorName: "deepgram",
            auth: {
              headerName: "Authorization",
              tokenPrefix: "Token",
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
