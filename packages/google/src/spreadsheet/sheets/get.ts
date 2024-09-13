import { Effect, pipe, Context } from "effect";
import { HttpClientRequest } from "@effect/platform";

import { SpreadsheetId, urlPrefix } from "../common.js";
import { GoogleApiRestClient } from "../../client.js";

export const getSheetById = (
  id: Context.Tag.Service<SpreadsheetId>,
) =>
  pipe(
    Effect.Do,
    Effect.bind("client", () => GoogleApiRestClient),
    Effect.andThen(({ client }) => 
      client.execute(
        "sheets",
        HttpClientRequest.get(`${urlPrefix}/${id}`)
      )
    )
  );
