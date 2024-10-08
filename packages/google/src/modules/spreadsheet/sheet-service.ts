import { Effect } from "effect";
import { HttpClientRequest } from "@effect/platform";

import { BaseEndpoint } from "../../api/index.js";
import { SpreadsheetId } from "./schema.js";
import { sheetUrlV4Prefix } from "./const.js";

export class SheetService
  extends Effect.Service<SheetService>()(`SheetService`, {
    effect:
      Effect.gen(function* () {
        const baseEndpoint = yield* BaseEndpoint;

        const getSheetDetailsById = (
          id: SpreadsheetId
        ) =>
          baseEndpoint.execute(
            "sheets",
            HttpClientRequest.get(`${sheetUrlV4Prefix}/${id}`)
          )

        return {
          getSheetDetailsById
        } as const;
      }),

      dependencies: [
        BaseEndpoint.Default
      ]

  }){ };


