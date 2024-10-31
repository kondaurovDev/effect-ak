import { Effect, pipe, Redacted } from "effect";
import { HttpClientRequest } from "@effect/platform";

import { GoogleApiHttpClient } from "./http-client.js";
import { GoogleUserAccessTokenProvider } from "./config-provider.js";
import { BaseUrlDomain, baseUrlMap } from "../const.js";

export class BaseEndpoint
  extends Effect.Service<BaseEndpoint>()(`Google.Api.BaseEndpoint`, {
    effect:
      Effect.gen(function* () {
        const httpClient = yield* GoogleApiHttpClient;
        const acceeTokenProvider = yield* GoogleUserAccessTokenProvider;

        const execute = (
          baseUrl: BaseUrlDomain,
          originRequest: HttpClientRequest.HttpClientRequest,
          userId?: string
        ) =>
          Effect.gen(function* () {

            const token =
              yield* (userId ? acceeTokenProvider.getAccessToken(userId) : acceeTokenProvider.getAccessToken(undefined));

            const upgradedRequest = pipe(
              originRequest,
              HttpClientRequest.setHeader("Authorization", `Bearer ${Redacted.value(token)}`),
              HttpClientRequest.prependUrl("https://" + baseUrlMap[baseUrl]),
            );

            return yield* httpClient.execute(upgradedRequest);

          })

        return {
          execute
        } as const;
      }),
    dependencies: [GoogleApiHttpClient.Default]
  }) { };
