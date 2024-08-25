import { Effect } from "effect";

import { tryAwsServiceMethod } from "../error.js";
import { Service } from "./service.js";

export const encryptSecret = (
  secret: string,
  keyId: string
) =>
  Effect.Do.pipe(
    Effect.bind("kmsSdk", () => Service),
    Effect.andThen(({ kmsSdk }) =>
      tryAwsServiceMethod(
        "encrypting secret",
        () =>
          kmsSdk.encrypt({
            KeyId: keyId,
            Plaintext: Buffer.from(secret)
          })
      )
    ),
    Effect.andThen(result =>
      Effect.fromNullable(result.CiphertextBlob)
    ),
    Effect.andThen(result =>
      Buffer.from(result).toString("base64")
    )
  )

export const decryptSecret = (
  secretBase64: string,
  keyId: string
) =>
  Effect.Do.pipe(
    Effect.bind("kmsSdk", () => Service),
    Effect.andThen(({ kmsSdk }) =>
      tryAwsServiceMethod(
        "decryping secret",
        () =>
          kmsSdk.decrypt({
            KeyId: keyId,
            CiphertextBlob: Buffer.from(secretBase64, "base64")
          })
      )
    ),
    Effect.andThen(result =>
      Effect.fromNullable(result.Plaintext)
    ),
    Effect.andThen(result =>
      Buffer.from(result).toString("utf-8")
    )
  )

