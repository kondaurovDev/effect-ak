import { Effect, pipe } from "effect";
import { createHash, createSign } from "node:crypto";

import { SharedError } from "./error.js";

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
    Effect.mapError(error =>
      new SharedError({
        message: "sign text error: " + error
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
    Effect.mapError(error =>
      new SharedError({
        message: "hashText error: " + error.message
      })
    )
  )
