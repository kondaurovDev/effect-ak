import { HttpClientRequest } from "@effect/platform";
import { Effect } from "effect";

import { RestClient } from "../client.js"

export const GetSpreadsheetsList =
  Effect.Do.pipe(
    Effect.bind("client", () => RestClient),
    Effect.andThen(({ client }) =>
      client.execute(
        "apis",
        HttpClientRequest.get("/drive/v3/files", {
          urlParams: {
            q: "mimeType = 'application/vnd.google-apps.spreadsheet'"
          }
        })
      )
    )
  )
