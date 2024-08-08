import { Effect } from "effect";
import { HttpBody, HttpClientRequest } from "@effect/platform";

import { SheetsClient, SheetsClientLive } from "./client.js";
import { getServiceAccountAccessToken } from "../auth/index.js";

//https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append

export const appendRow = (
  spreadsheetId: string,
  range: string,
  rowValues: string[]
) =>
  Effect.Do.pipe(
    Effect.bind("client", () => SheetsClient),
    Effect.bind("accessToken", () => getServiceAccountAccessToken),
    Effect.andThen(({ client, accessToken }) => 
      client(
        HttpClientRequest.post(
          `/${spreadsheetId}/values/${range}:append`, {
            urlParams: {
              valueInputOption: "USER_ENTERED"
            },
            body: HttpBody.unsafeJson({
              range,
              majorDimension: "ROWS",
              values: [
                rowValues
              ]
            }),
            headers: {
              "Authorization": `Bearer ${accessToken}`
            }
          }
        )
      )
    ),
    Effect.provide(SheetsClientLive)
  )
