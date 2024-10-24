import { Effect, DateTime } from "effect";
import { HttpBody, HttpClientRequest } from "@effect/platform";

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
          Effect.gen(function* () {

            const startDate = yield* DateTime.make(command.start.dateTime);
            const endDate = yield* DateTime.make(command.end.dateTime);

            const httpBody =
              yield* HttpBody.json({
                end: {
                  dateTime: DateTime.formatIso(endDate)
                },
                start: {
                  dateTime: DateTime.formatIso(startDate)
                },
                description: command.description,
                summary: command.summary
              })

            const result =
              yield* baseEndpoint.execute(
                "apis",
                HttpClientRequest.post(
                  `${calendarUrlV3Prefix}/users/me/calendarList`,
                  {
                    body: httpBody
                  }
                )
              )

            return result;

          })

        return {
          insert
        } as const;
      }),

    dependencies: [
      BaseEndpoint.Default
    ]

  }) { };


