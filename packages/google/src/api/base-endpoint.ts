import { Effect, pipe, Redacted } from "effect";
import { HttpClientRequest } from "@effect/platform";

import { GoogleUserAccessTokenProvider } from "./providers.js"
import { GoogleApiHttpClient } from "./http-client.js";

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
          request: HttpClientRequest.HttpClientRequest
        ) =>
          pipe(
            GoogleUserAccessTokenProvider,
            Effect.andThen(token =>
              httpClient.execute(
                pipe(
                  HttpClientRequest.setHeader("Authorization", `Bearer ${Redacted.value(token)}`)(request),
                  HttpClientRequest.prependUrl("https://" + baseUrlMap[baseUrl])
                )
              )
            )
          )
          
        return {
          execute
        } as const;
      }),
      dependencies: [ GoogleApiHttpClient.Default ]
  }) {};
