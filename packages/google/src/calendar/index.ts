import {Brand} from "effect";

export * from "./event"
export * from "./error"

export type CalendarId = string & Brand.Brand<"Google.CalendarId">;
export const CalendarId = Brand.nominal<CalendarId>();

export type EventTitle = string & Brand.Brand<"EventTitle">;
export const EventTitle = Brand.nominal<EventTitle>();

export type EventDescription = string & Brand.Brand<"EventDescription">;
export const EventDescription = Brand.nominal<EventDescription>();

export type EventStartDate = Date & Brand.Brand<"EventStartDate">;
export const EventStartDate = Brand.nominal<EventStartDate>();

export type EventEndDate = Date & Brand.Brand<"EventEndDate">;
export const EventEndDate = Brand.nominal<EventEndDate>();
