import { Cache, Duration, Effect, pipe } from "effect"

import { MiscError } from "./error.js"

const dateTimeFormatter = (
  timezone: string
) =>
  Effect.try(() =>
    new Intl.DateTimeFormat("ru-RU", {
      timeZone: timezone,
      timeZoneName: 'longOffset'
    })
  )

export const getDatePartsFromTimestamp = (
  millis: number,
  timezone: string
) => 
  pipe(
    dateTimeFormatter(timezone),
    Effect.andThen(formatter => 
      formatter.formatToParts(new Date(millis))
    )
  )

export const timestampToPrettyDateTime = (
  millis: number,
  timezone: string
) =>
  pipe(
    parseDateWithTime(millis),
    Effect.andThen(date => 
      date.toLocaleString(undefined, { 
        timeZone: timezone,
        hour12: false,
      })
    )
  )

export const parseDateWithTime = (
  input: string | number
) =>
  pipe(
    Effect.try(() => new Date(input)),
    Effect.filterOrFail(date =>
      !isNaN(date.getTime())
    ),
    Effect.mapError(error => {
      if (error._tag == "NoSuchElementException") {
        return new MiscError({
          message: `Input '${input}' isn't a date string`
        })
      } else if (error._tag == "UnknownException") {
        return new MiscError({
          message: `Input '${input}' can't be transformed to a date`
        })
      } else {
        return new MiscError({
          message: `Input '${input}'. Unknown exception`
        })
      }
    })
  )



const getGMTOffsetByTimezone = (
  timezone: string
) => 
  Effect.Do.pipe(
    Effect.bind("parts", () =>
      getDatePartsFromTimestamp(
        Date.now(),
        timezone
      )
    ),
    Effect.andThen(({ parts }) => 
      Effect.fromNullable(
        parts
          .find(part => part.type === 'timeZoneName')
      ),
    ),
    Effect.catchAll(errors =>
      new MiscError({ message: `getting gmt by timezone ${timezone}: ${errors.message}` })
    ),
    Effect.andThen(result => result.value)
  )

export const GMTByTimezoneNameCache =
  pipe(
    Cache.make({
      capacity: 100,
      timeToLive: Duration.infinity,
      lookup: (timezoneName: string) => 
        getGMTOffsetByTimezone(timezoneName)
    }),
    Effect.runSync
  )