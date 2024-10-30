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
            auth: {
              headerName: "Authorization",
              tokenPrefix: "Bearer",
              tokenContainerName: "stabilityai"
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
