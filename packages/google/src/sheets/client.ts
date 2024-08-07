import { Effect, Layer } from "effect";
import { HttpClient, HttpClientRequest } from "@effect/platform";

import { RestClientLayer, RestClient } from "../client";
import { getServiceAccountAccessToken } from "../auth";
import { SpreadsheetId } from ".";

export * from "./values"

export const SheetsClient =
  RestClient("Sheets")

export const SheetsClientLive =
  RestClientLayer(
    SheetsClient,
    "sheets.googleapis.com",
    "/v4/spreadsheets"
  ).pipe(
    Layer.provide(HttpClient.layer)
  );

export const getSpreadsheet = (
  spreadsheetId: SpreadsheetId,
) =>
  Effect.Do.pipe(
    Effect.bind("client", () => SheetsClient),
    Effect.bind("accessToken", () => getServiceAccountAccessToken),
    Effect.andThen(({ client, accessToken }) => 
      client(
        HttpClientRequest.get(`/${spreadsheetId}`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        })
      )
    ),
    Effect.provide(SheetsClientLive)
  );
