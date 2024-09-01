import { Context, pipe, Effect } from "effect";
import { HttpClientRequest } from "@effect/platform";
import { Schema as S } from "@effect/schema"
import { RestClient } from "../client.js";

export class GoogleUserAccessToken
  extends Context.Tag("Google.UserAccessToken")<
    GoogleUserAccessToken, string
  >() { };

const UserInfo =
  S.Struct({
    id: S.NonEmptyString,
    email: S.NonEmptyString,
    name: S.NonEmptyString
  })

export const getUserInfo =
  pipe(
    RestClient,
    Effect.andThen(client =>
      pipe(
        client.execute(
          "apis",
          HttpClientRequest.get(
            "/oauth2/v1/userInfo"
          )
        ),
        S.validate(UserInfo)
      )
    ),
    Effect.provide(RestClient.live)
  )