
import { HttpClientRequest } from "@effect/platform";
import { RestClient, RestClientLayer } from "../client"
import { Effect } from "effect";
import { getServiceAccountAccessToken } from "../auth";

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
