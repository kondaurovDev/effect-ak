import { Schema as S } from "@effect/schema";

export type CalendarId = typeof CalendarId.Type;
export const CalendarId = S.NonEmptyString.pipe(S.brand("CalendarId"));

export type InsertCalendarCommandInput = typeof InsertCalendarCommand.Type
export class InsertCalendarCommand
  extends S.Class<InsertEventCommand>("InsertCalendarCommand")({
    calendarId: CalendarId
  }) { }

// https://developers.google.com/calendar/api/v3/reference/events/insert

export type InsertEventCommandInput = typeof InsertEventCommand.Type
export class InsertEventCommand
  extends S.Class<InsertEventCommand>("InsertEventCommand")({
    calendarId: CalendarId,
    summary: S.NonEmptyString,
    start:
      S.Struct({
        dateTime: S.NonEmptyString,
        timeZone: S.NonEmptyString
      }),
    end:
      S.Struct({
        dateTime: S.NonEmptyString,
        timeZone: S.NonEmptyString
      }),
    description: S.NonEmptyString
  }) { }
