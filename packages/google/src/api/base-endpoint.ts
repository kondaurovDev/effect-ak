import { Config, Effect, pipe } from "effect";
import { HttpClientRequest } from "@effect/platform";

import { GoogleApiHttpClient } from "./http-client.js";
import { googleUserAccessTokenConfigKey } from "./const.js";

export type BaseUrlDomain = keyof typeof baseUrlMap;

const baseUrlMap = {
  apis: "www.googleapis.com",
  sheets: "sheets.googleapis.com",
  people: "people.googleapis.com",
  tasks: "tasks.googleapis.com"
} as const;

export class BaseEndpoint
  extends Effect.Service<BaseEndpoint>()(`Google.Api.BaseEndpoint`, {
    effect: 
      Effect.gen(function* () {
        const httpClient = yield* GoogleApiHttpClient;
        const execute = (
          baseUrl: BaseUrlDomain,
          originRequest: HttpClientRequest.HttpClientRequest
        ) =>
          pipe(
            Config.nonEmptyString(googleUserAccessTokenConfigKey),
            Effect.andThen(token =>
              pipe(
                originRequest,
                HttpClientRequest.setHeader("Authorization", `Bearer ${token}`),
                HttpClientRequest.prependUrl("https://" + baseUrlMap[baseUrl])
              )
            ),
            Effect.andThen(httpClient.execute)
          )
          
        return {
          execute
        } as const;
      }),
      dependencies: [ GoogleApiHttpClient.Default ]
  }) {};
