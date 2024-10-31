import { Effect } from "effect";
import { FetchHttpClient, HttpClientRequest } from "@effect/platform";
import * as S from "effect/Schema";;

import { makeJsonHttpClient } from "../../../internal/json-http-client.js";

export class StabilityaiHttpClient extends
  Effect.Service<StabilityaiHttpClient>()("StabilityaiHttpClient", {
    effect:
      Effect.gen(function* () {

        const httpClient =
          yield* makeJsonHttpClient({
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
