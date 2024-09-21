import { Cache, Cause, Duration, Effect, pipe } from "effect"

import { UtilError } from "./util-error.js"

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
    Effect.catchTags({
      NoSuchElementException: () =>
        new UtilError({
          name: "date",
          details: `Input '${input}' isn't a date string`
        }),
      UnknownException: () =>
        new UtilError({
          name: "date",
          details: `Input '${input}' can't be transformed to a date`
        })
    })
  )

const getGMTOffsetByTimezone = (
  timezone: string
) => 
  pipe(
    Effect.Do,
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
    Effect.catchAll(cause =>
      new UtilError({ 
        name: "date",
        details: `getting gmt by timezone ${timezone}`, 
        cause: Cause.die(cause)
      })
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