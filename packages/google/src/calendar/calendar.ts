import { Effect, pipe } from "effect";
import { HttpBody, HttpClientRequest } from "@effect/platform";

import { GoogleApiRestClient } from "../client.js";
import { prefix } from "./common.js";

export const insertCalendar = (
  calendarId: string
) =>
  pipe(
    Effect.Do,
    Effect.bind("client", () => GoogleApiRestClient),
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
    )
  );

export const listCalendars =
  pipe(
    Effect.Do,
    Effect.bind("client", () => GoogleApiRestClient),
    Effect.andThen(({ client }) =>
      client.execute(
        "apis",
        HttpClientRequest.get(
          `${prefix}/users/me/calendarList`, {
        })
      )
    )
  );