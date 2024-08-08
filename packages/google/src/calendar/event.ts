import { Effect } from "effect";
import { HttpBody, HttpClientRequest } from "@effect/platform";
import { Schema as S } from "@effect/schema";
import { Action, ActionName, parseDateWithTime } from "@efkit/shared"

import { RestClientLayer, RestClient } from "../client.js";
import { getServiceAccountAccessToken } from "../auth/index.js";

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
    Effect.bind("accessToken", () => getServiceAccountAccessToken),
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
    Effect.bind("client", () => 
      Client
    ),
    Effect.bind("accessToken", () => getServiceAccountAccessToken),
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
export const createEvent =
  Action(
    ActionName("Create calendar event"),
    CreateEventSchema,
    CreateEventSchema,
    input =>
      Effect.Do.pipe(
        Effect.bind("client", () => Client),
        Effect.bind("accessToken", () => getServiceAccountAccessToken),
        Effect.bind("startDate", () => parseDateWithTime(input.start.dateTime)),
        Effect.bind("endDate", () => parseDateWithTime(input.end.dateTime)),
        Effect.bind("event", ({ startDate, endDate }) =>
          HttpBody.json({
            end: {
              dateTime: endDate.toISOString()
            },
            start: {
              dateTime: startDate.toISOString()
            },
            description: input.description,
            summary: input.summary
          })
        ),
        Effect.andThen(({ client, event, accessToken }) =>
          client(
            HttpClientRequest.post(
              `/calendars/${input.calendarId}/events`, {
              body: event,
              headers: {
                "Authorization": `Bearer ${accessToken}`
              }
            })
          )
        ),
        Effect.andThen(input),
        Effect.provide(ClientLive)  
      )
  )
