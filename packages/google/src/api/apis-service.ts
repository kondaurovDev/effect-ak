import { Effect, pipe } from "effect";
import { HttpClientRequest } from "@effect/platform";
import { Schema as S } from "@effect/schema";

import { UserInfo } from "./schema.js";
import { BaseEndpoint } from "./base-endpoint.js";

export class ApiService
  extends Effect.Service<ApiService>()(`Google.ApiService`, {
    effect:
      Effect.gen(function* () {
        const baseEndpoint = yield* BaseEndpoint;
        const userInfoEffect =
          pipe(
            baseEndpoint.execute(
              "apis",
              HttpClientRequest.get(
                "/oauth2/v1/userinfo"
              )
            ),
            Effect.andThen(S.validate(UserInfo))
          )

        return {
          userInfoEffect
        } as const;
      }),
    dependencies: [
      BaseEndpoint.Default
    ]
  }) { };
