import { Effect } from "effect";
import { HttpBody, HttpClientRequest } from "@effect/platform";
import { Schema as S } from "@effect/schema";
import { parseDateWithTime } from "@efkit/shared"

import { RestClientLayer, RestClient } from "../client.js";
import { AccessToken } from "../auth/common.js";

const Client =
  RestClient("Calendar")

const ClientLive =
  RestClientLayer(
    Client,
    "www.googleapis.com",
    "/calendar/v3"
  );

export const InsertCalendar = (
  calendarId: string
) =>
  Effect.Do.pipe(
    Effect.bind("client", () => Client),
    Effect.bind("accessToken", () => AccessToken),
    Effect.bind("body", () =>
      HttpBody.json({
        id: calendarId
      })
    ),
    Effect.andThen(({ client, accessToken, body }) =>
      client(
        HttpClientRequest.post(
          "/users/me/calendarList", {
            headers: {
              "Authorization": `Bearer ${accessToken}`
            },
            body
          })
      )
    ),
    Effect.scoped,
    Effect.provide(ClientLive)
  );


export const ListCalendars =
  Effect.Do.pipe(
    Effect.bind("client", () => Client),
    Effect.bind("accessToken", () => AccessToken),
    Effect.andThen(({ client, accessToken }) =>
      client(
        HttpClientRequest.get(
          "/users/me/calendarList", {
            headers: {
              "Authorization": `Bearer ${accessToken}`
            }
          })
      )
    ),
    Effect.scoped,
    Effect.provide(ClientLive)
  );

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
  Effect.Do.pipe(
    Effect.bind("client", () => Client),
    Effect.bind("accessToken", () => AccessToken),
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
    Effect.andThen(({ client, event, accessToken }) =>
      client(
        HttpClientRequest.post(
          `/calendars/${request.calendarId}/events`, {
          body: event,
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        })
      )
    ),
    Effect.provide(ClientLive)  
  )
