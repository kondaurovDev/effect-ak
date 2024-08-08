import { HttpClientRequest } from "@effect/platform";
import { Effect } from "effect";

import { RestClient, RestClientLayer } from "../client.js"
import { getServiceAccountAccessToken } from "../auth/index.js";

const Client = 
  RestClient("Spreadsheet");

const ClientLive = 
  RestClientLayer(
    Client,
    "www.googleapis.com",
    "/drive/v3/"
  )

export const GetSpreadsheetsList =
  Effect.Do.pipe(
    Effect.bind("client", () => Client),
    Effect.bind("accessToken", () => getServiceAccountAccessToken),
    Effect.andThen(({ client, accessToken }) =>
      client(
        HttpClientRequest.get("files", {
          urlParams: {
            q: "mimeType = 'application/vnd.google-apps.spreadsheet'"
          },
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        })
      )
    ),
    Effect.provide(ClientLive)
  )
