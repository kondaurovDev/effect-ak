import { Effect, pipe } from "effect";
import { HttpBody, HttpClientRequest } from "@effect/platform";

import { BaseEndpoint } from "../../api/index.js";
import { AppendValuesToSheetCommand, Range, ValueRange } from "./schema.js";
import { sheetUrlV4Prefix } from "./const.js";

export class SheetValueService
  extends Effect.Service<SheetValueService>()(`SheetValueService`, {

    effect:
      Effect.gen(function* () {
        const baseEndpoint = yield* BaseEndpoint;

        const appendValues = (
          command: AppendValuesToSheetCommand
        ) =>
          pipe(
            Effect.Do,
            Effect.let("body", () =>
              HttpBody.unsafeJson(command.valueRange)
            ),
            Effect.andThen(({ body }) =>
              baseEndpoint.execute(
                "sheets",
                HttpClientRequest.post(
                  `${sheetUrlV4Prefix}/${command.spreadsheetId}/values/${command.valueRange.range}:append`,
                  {
                    urlParams: {
                      valueInputOption: "USER_ENTERED",
                      insertDataOption: "INSERT_ROWS"
                    },
                    body
                  }
                )
              )
            )
          )

        return {
          appendValues
        } as const;
      }),

      dependencies: [
        BaseEndpoint.Default
      ]


  }) {};


