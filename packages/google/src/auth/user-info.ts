import { HttpClientRequest } from "@effect/platform";
import { Schema as S } from "@effect/schema"
import { Effect, pipe } from "effect";

import { GoogleApiRestClient } from "../client.js";

const UserInfo =
  S.Struct({
    id: S.NonEmptyString,
    email: S.NonEmptyString,
    name: S.NonEmptyString
  })

export const getUserInfo =
  pipe(
    GoogleApiRestClient,
    Effect.andThen(client =>
      pipe(
        client.execute(
          "apis",
          HttpClientRequest.get(
            "/oauth2/v1/userinfo"
          )
        ),
        Effect.andThen(S.validate(UserInfo))
      )
    )
  )
