import { Effect, pipe, Cause } from "effect";

import { UtilError } from "../utils/util-error.js";
import { DataReplacer, DecodedFromJson, EncodedToJson } from "./types.js";

export class JsonService extends Effect.Service<JsonService>()("JsonService", {
  effect:
    Effect.gen(function* () {

      const decode = <T extends string>(
        json: T
      ) =>
        Effect.try({
          try: () => DecodedFromJson.make(JSON.parse(json)),
          catch: () => new UtilError({ name: "json", details: "INVALID_JSON" })
        })

      const encode = (
        input: unknown, replacer?: DataReplacer
      ) =>
        pipe(
          Effect.try(() =>
            EncodedToJson.make(JSON.stringify(input, replacer, 2) as string)
          ),
          Effect.catchTag("UnknownException", exception =>
            new UtilError({
              name: "json",
              cause: Cause.die(exception),
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
