import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";

import { UtilError } from "../../utils/error.js";
import { DataReplacer, UnknownDecoded, JsonString } from "../types.js";
import { miscPackageName } from "../../const.js";

export class DataFormatJsonService extends
  Effect.Service<DataFormatJsonService>()(`${miscPackageName}/DataFormatJsonService`, {
    effect:
      Effect.gen(function* () {

        const decode = <T extends string>(
          json: T
        ) =>
          Effect.try({
            try: () => UnknownDecoded.make(JSON.parse(json)),
            catch: () => new UtilError({ name: "json", details: "INVALID_JSON" })
          })

        const encode = (
          input: unknown, replacer?: DataReplacer
        ) =>
          pipe(
            Effect.try(() =>
              JSON.stringify(input, replacer, 2)
            ),
            Effect.andThen(
              JsonString.make
            ),
            Effect.catchTag("UnknownException", exception =>
              new UtilError({
                name: "json",
                cause: exception,
                details: {
                  action: "SERIALIZATION_ERROR",
                }
              })
            )
          )

        return {
          decode, encode
        } as const;

      })
  }) { }
