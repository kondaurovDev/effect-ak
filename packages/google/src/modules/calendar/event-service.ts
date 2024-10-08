import { Effect, pipe } from "effect";
import { HttpBody, HttpClientRequest } from "@effect/platform";
import { parseDateWithTime } from "@efkit/shared/utils";

import { BaseEndpoint } from "../../api/index.js";
import { calendarUrlV3Prefix } from "./const.js";
import { InsertEventCommandInput } from "./schema.js";

export class CalendarEventService
  extends Effect.Service<CalendarEventService>()(`CalendarEventService`, {
    effect:
      Effect.gen(function* () {
        const baseEndpoint = yield* BaseEndpoint;

        const insert = (
          command: InsertEventCommandInput
        ) =>
          pipe(
            Effect.Do,
            Effect.bind("startDate", () => parseDateWithTime(command.start.dateTime)),
            Effect.bind("endDate", () => parseDateWithTime(command.end.dateTime)),
            Effect.let("httpBody", ({ startDate, endDate }) =>
              HttpBody.unsafeJson({
                end: {
                  dateTime: endDate.toISOString()
                },
                start: {
                  dateTime: startDate.toISOString()
                },
                description: command.description,
                summary: command.summary
              })
            ),
            Effect.andThen(({ httpBody }) =>
              baseEndpoint.execute(
                "apis",
                HttpClientRequest.post(
                  `${calendarUrlV3Prefix}/users/me/calendarList`, 
                  {
                    body: httpBody
                  }
                )
              )
            )
          )

        return {
          insert
        } as const;
      }),

      dependencies: [
        BaseEndpoint.Default
      ]

  }) {};


