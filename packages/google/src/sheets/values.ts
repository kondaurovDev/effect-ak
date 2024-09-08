import { Effect, pipe } from "effect";
import { HttpBody, HttpClientRequest } from "@effect/platform";

import { GoogleApiRestClient } from "../client.js";
import { prefix } from "./common.js";

//https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append

export const appendRow = (
  spreadsheetId: string,
  range: string,
  rowValues: string[]
) =>
  pipe(
    Effect.Do,
    Effect.bind("client", () => GoogleApiRestClient),
    Effect.andThen(({ client }) => 
      client.execute(
        "sheets",
        HttpClientRequest.post(
          `${prefix}/${spreadsheetId}/values/${range}:append`, {
            urlParams: {
              valueInputOption: "USER_ENTERED"
            },
            body: HttpBody.unsafeJson({
              range,
              majorDimension: "ROWS",
              values: [
                rowValues
              ]
            })
          }
        )
      )
    )
  )
