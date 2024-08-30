import { Effect } from "effect";
import { HttpClientRequest } from "@effect/platform";
import { RestClient } from "../client.js";

const prefix = "/v1/people";

export const getMe =
  Effect.Do.pipe(
    Effect.bind("client", () => RestClient),
    Effect.andThen(({ client }) =>
      client.execute(
        "people",
        HttpClientRequest.get(`${prefix}/me`, {
          urlParams: {
            personFields: [ "emails", "names" ]
          }
        })
      )
    )
  )
