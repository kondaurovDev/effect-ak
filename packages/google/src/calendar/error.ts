import { Data } from "effect";

export class GoogleCalendarError 
  extends Data.TaggedError("GoogleCalendarError")<{
    message: string
  }> {}