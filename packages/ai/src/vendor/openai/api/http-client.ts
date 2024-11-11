import * as Effect from "effect/Effect";

import { makeHttpClient } from "../../../internal/http-client.js";

export class OpenaiHttpClient
  extends Effect.Service<OpenaiHttpClient>()("OpenaiHttpClient", {
    effect:
      Effect.gen(function* () {

        const client =
          yield* makeHttpClient({
            vendorName: "openai",
            baseUrl: "https://api.openai.com",
            auth: {
              headerName: "Authorization",
              tokenPrefix: "Bearer",
            }
          })

        return {
          ...client
        } as const;

      })

  }) {}
