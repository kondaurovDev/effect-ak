import { Effect } from "effect";
import { HttpBody, HttpClientRequest } from "@effect/platform";

import { RestClient } from "../client.js";
import { prefix } from "./common.js";

//https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append

export const appendRow = (
  spreadsheetId: string,
  range: string,
  rowValues: string[]
) =>
  Effect.Do.pipe(
    Effect.bind("client", () => RestClient),
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
    ),
    Effect.provide(RestClient.live)
  )
