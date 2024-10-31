import { Service, gen } from "effect/Effect";

import { makeJsonHttpClient } from "../../../internal/json-http-client.js";

export class OpenaiHttpClient
  extends Service<OpenaiHttpClient>()("OpenaiHttpClient", {
    effect:
      gen(function* () {

        const client =
          yield* makeJsonHttpClient({
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
