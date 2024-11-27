import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";

import { UtilError } from "../../utils/error.js";
import { miscPackageName } from "../../const.js";

export class NodeCryptoService
  extends Effect.Service<NodeCryptoService>()(`${miscPackageName}/NodeCryptoService`, {
    effect:
      Effect.gen(function* () {

        const { createHash, createSign } =
          yield* Effect.tryPromise(() => import("node:crypto"));

        const sha256Signer = 
          yield* Effect.try(() => createSign("sha256"));

        const sha256Hasher = 
          yield* Effect.try(() => createHash("sha256"));

        yield* Effect.logDebug("NodeCrypto service is ready");

        const signText = (
          input: string,
          privateKey: string
        ) =>
          pipe(
            Effect.try(() =>
              sha256Signer.update(input).sign(privateKey, "base64url")
            ),
            Effect.mapError(cause =>
              new UtilError({
                name: "text",
                details: "signinig text error",
                cause
              })
            )
          );

          const hashText = (
            input: string
          ) =>
            pipe(
              Effect.try(() =>
                sha256Hasher.update(input).digest("base64url")
              ),
              Effect.mapError(cause =>
                new UtilError({
                  name: "text",
                  details: `hashText error, input '${input}'`,
                  cause: cause
                })
              )
            )

        return {
          signText, hashText
        } as const;

      })

  }) {}
