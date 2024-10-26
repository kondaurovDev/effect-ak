import { Service, gen } from "effect/Effect";

import { makeJsonHttpClient } from "../../../internal/json-http-client.js";

export class OpenaiHttpClient
  extends Service<OpenaiHttpClient>()("OpenaiHttpClient", {
    effect:
      gen(function* () {

        const client =
          yield* makeJsonHttpClient({
            baseUrl: "https://api.openai.com",
            defaultHeaders: {},
            auth: {
              headerName: "Authorization",
              tokenContainerName: "openai",
              isBearer: true,
            }
          })

        return {
          ...client
        } as const;

      })

  }) {}
