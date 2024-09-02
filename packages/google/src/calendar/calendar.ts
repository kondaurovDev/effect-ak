import { Effect } from "effect";
import { HttpBody, HttpClientRequest } from "@effect/platform";

import { RestClient, RestClientLive } from "../client.js";
import { prefix } from "./common.js";

export const insertCalendar = (
  calendarId: string
) =>
  Effect.Do.pipe(
    Effect.bind("client", () => RestClient),
    Effect.bind("body", () =>
      HttpBody.json({
        id: calendarId
      })
    ),
    Effect.andThen(({ client, body }) =>
      client.execute(
        "apis",
        HttpClientRequest.post(
          `${prefix}/users/me/calendarList`, {
          body
        })
      )
    ),
    Effect.provide(RestClientLive)
  );

export const listCalendars =
  Effect.Do.pipe(
    Effect.bind("client", () => RestClient),
    Effect.andThen(({ client }) =>
      client.execute(
        "apis",
        HttpClientRequest.get(
          `${prefix}/users/me/calendarList`, {
        })
      )
    ),
    Effect.provide(RestClientLive),
    Effect.scoped
  );