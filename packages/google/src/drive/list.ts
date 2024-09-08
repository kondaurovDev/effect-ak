import { HttpClientRequest } from "@effect/platform";
import { Effect, pipe } from "effect";

import { GoogleApiRestClient } from "../client.js"

export const GetSpreadsheetsList =
  pipe(
    Effect.Do,
    Effect.bind("client", () => GoogleApiRestClient),
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
