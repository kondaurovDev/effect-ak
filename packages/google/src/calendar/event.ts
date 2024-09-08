import { Effect, pipe } from "effect";
import { HttpBody, HttpClientRequest } from "@effect/platform";
import { Schema as S } from "@effect/schema";
import { parseDateWithTime } from "@efkit/shared"

import { GoogleApiRestClient } from "../client.js";
import { prefix } from "./common.js";

type CreateEventSchema = typeof CreateEventSchema.Type

export const CreateEventSchema =
  S.Struct({
    calendarId: S.NonEmptyString,
    summary: S.NonEmptyString,
    start: S.Struct({
      dateTime: S.String,
      timeZone: S.String
    }),
    end: S.Struct({
      dateTime: S.String,
      timeZone: S.String
    }),
    description: S.NonEmptyString
  })

// https://developers.google.com/calendar/api/v3/reference/events/insert
export const createEvent = (
  request: CreateEventSchema
) =>
  pipe(
    Effect.Do,
    Effect.bind("client", () => GoogleApiRestClient),
    Effect.bind("startDate", () => parseDateWithTime(request.start.dateTime)),
    Effect.bind("endDate", () => parseDateWithTime(request.end.dateTime)),
    Effect.bind("event", ({ startDate, endDate }) =>
      HttpBody.json({
        end: {
          dateTime: endDate.toISOString()
        },
        start: {
          dateTime: startDate.toISOString()
        },
        description: request.description,
        summary: request.summary
      })
    ),
    Effect.andThen(({ client, event }) =>
      client.execute(
        "apis",
        HttpClientRequest.post(
          `${prefix}/calendars/${request.calendarId}/events`, {
          body: event
        })
      )
    )
  )
