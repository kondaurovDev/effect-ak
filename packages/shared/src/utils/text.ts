import { Cause, Effect, pipe } from "effect";
import { createHash, createSign } from "node:crypto";

import { UtilError } from "./util-error.js";

export const toBase64Url = (
  input: unknown
) =>
  Buffer.from(JSON.stringify(input)).toString("base64url");

export const signText = (
  input: string,
  privateKey: string
) =>
  pipe(
    Effect.try(() =>
      createSign("sha256")
    ),
    Effect.tap(() =>
      Effect.logDebug(input, privateKey)
    ),
    Effect.andThen(signer =>
      Effect.try(() =>
        signer.update(input).sign(privateKey, "base64url")
      )
    ),
    Effect.mapError(cause =>
      new UtilError({
        name: "text",
        details: "sign text error",
        cause: Cause.fail(cause)
      })
    )
  )

export const hashText = (
  input: string
) =>
  pipe(
    Effect.try(() =>
      createHash("sha256")
    ),
    Effect.andThen(hasher =>
      hasher.update(input).digest("base64url")
    ),
    Effect.mapError(cause =>
      new UtilError({
        name: "text",
        details: `hashText error, input '${input}'`,
        cause: Cause.fail(cause)
      })
    )
  )
