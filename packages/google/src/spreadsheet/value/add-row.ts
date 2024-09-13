import { Effect, pipe } from "effect";
import { HttpBody, HttpClientRequest } from "@effect/platform";

import { GoogleApiRestClient } from "../../client.js";
import { urlPrefix, SpreadsheetId } from "../common.js";
import { Range, RowValues } from "./types.js";

// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append
export const appendRowsToPage = (
  range: Range,
  rows: ReadonlyArray<RowValues>
) =>
  pipe(
    Effect.Do,
    Effect.bind("client", () => GoogleApiRestClient),
    Effect.bind("spreadsheetId", () => SpreadsheetId),
    Effect.bind("body", () => 
      HttpBody.json({
        range,
        majorDimension: "ROWS",
        values: rows
      })
    ),
    Effect.andThen(({ client, spreadsheetId, body }) => 
      client.execute(
        "sheets",
        HttpClientRequest.post(
          `${urlPrefix}/${spreadsheetId}/values/${range}:append`, {
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