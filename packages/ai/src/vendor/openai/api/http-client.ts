import { Service, gen } from "effect/Effect";

import { makeJsonHttpClient } from "../../../internal/json-http-client.js";
import { chatGptTokenConfigKey } from "./const.js";

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
              tokenConfigName: chatGptTokenConfigKey,
              isBearer: true,
            }
          })

        return {
          ...client
        } as const;

      })

  }) {}
