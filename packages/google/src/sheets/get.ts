import { Effect, pipe } from "effect";
import { HttpClientRequest } from "@effect/platform";

import { GoogleApiRestClient } from "../client.js";
import * as T from "./types.js";
import { prefix } from "./common.js";

export const getSpreadsheet = (
  spreadsheetId: T.SpreadsheetId,
) =>
  pipe(
    Effect.Do,
    Effect.bind("client", () => GoogleApiRestClient),
    Effect.andThen(({ client }) => 
      client.execute(
        "sheets",
        HttpClientRequest.get(`${prefix}/${spreadsheetId}`)
      )
    )
  );
