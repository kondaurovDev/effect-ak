import { Effect } from "effect";
import { HttpClientRequest } from "@effect/platform";

import { RestClient } from "../client.js";
import * as T from "./types.js";
import { prefix } from "./common.js";

export const getSpreadsheet = (
  spreadsheetId: T.SpreadsheetId,
) =>
  Effect.Do.pipe(
    Effect.bind("client", () => RestClient),
    Effect.andThen(({ client }) => 
      client.execute(
        "sheets",
        HttpClientRequest.get(`${prefix}/${spreadsheetId}`)
      )
    ),
    Effect.provide(RestClient.live)
  );
