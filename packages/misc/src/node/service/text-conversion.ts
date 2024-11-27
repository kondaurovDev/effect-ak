import * as Effect from "effect/Effect";

import { miscPackageName } from "../../const.js";

export class NodeTextConversionService
  extends Effect.Service<NodeTextConversionService>()(`${miscPackageName}/NodeTextConversionService`, {
    effect:
      Effect.gen(function* () {

        const { Buffer } = 
          yield* Effect.tryPromise(() => import("node:buffer"));

        yield* Effect.logDebug("NodeTextService is ready");

        const base64StringToFile = (
          input: string,
          fileName: string,
          type: string
        ) => {
          const bytes = stringToUint8Array(input);
          return new File([ bytes ], fileName, { type})
        }

        const uint8ArrayToString = 
          (input: Uint8Array) =>
            Buffer.from(input.buffer).toString("utf-8");

        const stringToUint8Array = 
          (input: string) =>
            new Uint8Array(Buffer.from(input));

        const toBase64Url = (
          input: unknown
        ) =>
          Buffer.from(JSON.stringify(input)).toString("base64url");

        return {
          toBase64Url, uint8ArrayToString, stringToUint8Array, base64StringToFile
        } as const;

      })

  }) {}
