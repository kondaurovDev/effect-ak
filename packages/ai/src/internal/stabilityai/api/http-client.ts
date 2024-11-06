import * as Effect from "effect/Effect";
import * as FetchHttpClient from "@effect/platform/FetchHttpClient";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as S from "effect/Schema";;

import { makeHttpClient } from "../../http-client.js";

export class StabilityaiHttpClient extends
  Effect.Service<StabilityaiHttpClient>()("StabilityaiHttpClient", {
    effect:
      Effect.gen(function* () {

        const httpClient =
          yield* makeHttpClient({
            baseUrl: "https://api.stability.ai/v2beta",
            vendorName: "stabilityai",
            auth: {
              headerName: "Authorization",
              tokenPrefix: "Bearer"
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
