import { Effect } from "effect";
import { HttpBody, HttpClientRequest } from "@effect/platform";

import { BaseEndpoint } from "../../api/index.js";
import { calendarUrlV3Prefix } from "./const.js";
import { InsertCalendarCommandInput } from "./schema.js";

export class CalendarListService
  extends Effect.Service<CalendarListService>()(`CalendarListService`, {
    effect:
      Effect.gen(function* () {
        const baseEndpoint = yield* BaseEndpoint;

        const listEffect =
          baseEndpoint.execute(
            "apis",
            HttpClientRequest.get(
              `${calendarUrlV3Prefix}/users/me/calendarList`
            )
          )

        const insertEffect = (
          command: InsertCalendarCommandInput
        ) =>
          baseEndpoint.execute(
            "apis",
            HttpClientRequest.post(
              `${calendarUrlV3Prefix}/users/me/calendarList`, 
              {
                body: 
                  HttpBody.unsafeJson({ 
                    id: command.calendarId
                  })
              }
            )
          )

        return {
          listEffect, insertEffect
        } as const
      }),

      dependencies: [
        BaseEndpoint.Default
      ]

  }) {};


